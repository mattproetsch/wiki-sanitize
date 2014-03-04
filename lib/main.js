var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var pageWorker = require("sdk/page-worker");
var tabs = require("sdk/tabs");
var panel = require("sdk/panel");


var wikisanitize = (function() {

	var interestingPhrases = [

		{
			re: /pa(y|id|yment)/mi,
			desc: "pay/paid/payment"
		},

		{
			re: /compensat(e|ed|ion)/mi,
			desc: "compensate/compensated/compensation"
		},

		{
			re: /hire(d|s)?/mi,
			desc: "hire/hired/hires"
		},

		{
			re: /disclos(ed|ure)/mi,
			desc: "disclosed/disclosure"
		},
		
		{
			re: /contribut(e|ed|ion)/mi,
			desc: "contribute/contibuted/contribution"
		},

		{
			re: /affiliat(e|ed|ion)/mi,
			desc: "affiliate/affiliated/affiliation"
		},

		{
			re: /client(ele)?/mi,
			desc: "client/clientele"
		},
		
		{
			re: /employ(ee|er|ed)?/mi,
			desc: "employ/employee/employer/employed"
		},

		{
			re: /work(s|ed)?/mi,
			desc: "work/works/worked"
		}


	];

	var extractInterestingSummaries = function(editSummaries) {
		var retn = [];

		for (var i = 0; i < editSummaries.length; i++) {
			for (var j = 0; j < interestingPhrases.length; j++) {
				if (interestingPhrases[j].re.test(editSummaries[i])) {
					retn.push({
						editSummary: editSummaries[i],
						desc: interestingPhrases[j].desc
					});
					break;
				}
			}
		}

		return retn;
	}


	// getEditorsWorker gets the editors from toolserver.org of the page whose title is given by wiki-sanitize.pageTitle
	// when the editorsArray is ready, callback(editorsArray) is called
	var getEditorsWorker = function(pageTitle, callback) {

		let worker = pageWorker.Page({
			contentScriptFile: data.url("get-editors.js"),
			contentURL: "https://toolserver.org/~daniel/WikiSense/Contributors.php?wikifam=.wikipedia.org&wikilang=en&order=-edit_count&page="+pageTitle+"&grouped=on&ofs=0&max=1000"
		});

		worker.port.emit("getEditors");
		worker.port.on("editorsReady", function(editorsArray) {
			callback(editorsArray, null);
		});
		worker.port.on("editorsError", function(e) {
			callback(null, e);
		});

		return worker; // for destruction later
	}

	//TODO: make limit variable
	// getEditSummariesWorker returns non-auto-generated summaries of the current page
	var getEditSummariesWorker = function(pageTitle, callback) {

		let worker = pageWorker.Page({
			contentScriptFile: data.url("get-edit-summaries.js"),
			contentURL: "https://en.wikipedia.org/w/index.php?title="+pageTitle+"&offset=20150101000000&limit=1000&action=history"
		});

		worker.port.emit("getEditSummaries");
		worker.port.on("editSummariesReady", function(editSumsArray) {
			callback(editSumsArray, null);
		});
		worker.port.on("editSummariesError", function(e) {
			callback(null, e);
		});

		return worker; // for destruction later
	}

	/* Since worker destruction is the task of the caller, these methods are no longer necessary
	// execute the supplied function when the editors for the supplied pageTitle are ready
	var getEditors = function(pageTitle, callback) {

		// Handle case where we need to launch a new editorsWorker
		if (editorsWorkerInProgress == false && !editorsWorker) {
			editorsWorker = getEditorsWorker(pageTitle, callback);
			return editorsWorker; // for destruction by calling method
		}
	}

	// execute the supplied function when the edit summaries for the supplied pageTitle are ready
	var getEditSummaries = function(pageTitle, callback) {

		// Handle case where we need to launch a new editSummariesWorker
		if (editSummariesWorkerInProgress == false && !editSummariesWorker) {
			editSummariesWorker = getEditSummariesWorker(pageTitle, callback);
			return editSummariesWorker; // for destruction by calling method
		}
	}
	*/

	return {
		getEditors: getEditorsWorker,
		getEditSummaries: getEditSummariesWorker,
		extractInterestingSummaries: extractInterestingSummaries
	};


}());




function getMoney(title, wikiPageTab) {
	// getMoney will download the pages for the edit history and the find most active contributors to a page
	// then it will make this information accesible to the user to determine the trustworthiness of a page

	var editors = null;
	var summaries = null;
	
	// Alert_worker exists for debugging purposes
	let alert_worker = wikiPageTab.attach({
		contentScript: "self.port.on(\"alert\", function(msg) { window.alert(msg); });"
	});

	var infoPanel = panel.Panel({
		width: 380,
		height: 180,

		position: {
			bottom: 20,
			right: 40
		},

		contentURL: data.url("panel.html"),

		contentScriptFile: data.url("panel.js")
	});

	if (tabs.activeTab == wikiPageTab)
		infoPanel.show();

	tabs.on('deactivate', function(deactivatedTab) {
		if (deactivatedTab == wikiPageTab) {

			infoPanel.hide();
		}
		else {
			infoPanel.show();
		}
	});


	var editorListPageWorker = wikisanitize.getEditors(title, function(editorList, err) {
		if (err === null) {
			editors = editorList;
			//alert_worker.port.emit("alert", editors[0]);
		}
		else {
			alert_worker.port.emit("alert", "Editors retrieval error: " + err);
		}
	});

	var editSummariesPageWorker = wikisanitize.getEditSummaries(title, function(summariesList, err) {
		if (err === null) {
			summaries = summariesList;
			infoPanel.port.emit("setInterestingEditSummaries",
						wikisanitize.extractInterestingSummaries(summaries));
			if (tabs.activeTab == wikiPageTab) {
				infoPanel.show();
			}
		}
		else {
			alert_worker.port.emit("alert", "Edit summary retrieval error: " + err);
		}
	});









}

// Sloppily use pageMod to inject the addon to all wikipedia pages
pageMod.PageMod({

	include: "*.wikipedia.org",
	contentScriptFile: data.url("get-page-title.js"),
	contentScriptWhen: "ready",

	onAttach: function(worker) {
		worker.port.emit("resolvePageTitle");

		worker.port.on("titleResolved", function(pageTitle) {
			getMoney(pageTitle, worker.tab);
			//worker.port.emit("alert", pageTitle);
		});

	}
});




tabs.open("http://en.wikipedia.org/wiki/Fakih_Usman");
