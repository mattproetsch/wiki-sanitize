var bgColors = {
	editSums: "#FF9999",
	userPages: "#E6E6AF",
	talkPage : "#80CCE6"
};

var interestingEditSummaries = "";
var interestingUserPageSnippets = "";
var interestingTalkPageSections = "";

self.port.on("setInterestingEditSummaries", function(editSummariesJson) {

	if (editSummariesJson.length == 0) {
		interestingEditSummaries = "No interesting edit summaries.";
	}

	else {

		interestingEditSummaries = "";
		for (var i = 0; i < editSummariesJson.length; i++) {

			interestingEditSummaries += "<h3 style=\"font-weight:bold; font-size: 9pt;\">"
					+ "<span style=\"color:blue; text-decoration:underline; cursor:pointer;\""
					+ "loc='" + editSummariesJson[i].link + "'>[Edit summary]</span></h3>"
					+ "<p style=\"font-size: 8pt;\">" + editSummariesJson[i].sum + "</p>\n";
		}
	}
});

self.port.on("clearInterestingUserPageSnippets", function() {
	interestingUserPageSnippets = "";
});

self.port.on("appendInterestingUserPageSnippets", function(snippets) {
	for (var i = 0; i < snippets.content.length; i++) {
		interestingUserPageSnippets += "<h3 style=\"font-weight:bold; font-size: 9pt\">"
			+ "<span style=\"color: blue; text-decoration:underline; cursor:pointer;\""
			+ "loc='https://en.wikipedia.org/wiki/User:" + snippets.user + "'>[User page: "
			+ snippets.user + "]</span></h3><p style=\"font-size: 8pt;\">" + snippets.content[i] + "</p>";
	}
});

self.port.on("setInterestingTalkPageSections", function(snippets) {
	
	interestingTalkPageSections = "<h3 style=\"font-weight:bold; font-size: 9pt\">"
			+ "<span style=\"color:blue; text-decoration:underline; cursor:pointer;\""
			+ "loc='https://en.wikipedia.org/wiki/Talk:" + snippets.articleName + "'>[Talk page]</span></h3>";
			
	for (var i = 0; i < snippets.content.length; i++) {
		interestingTalkPageSections += "<p>" + snippets.content[i] + "</p>";
	}
});

// Listen for clicks to links and send their target to the main addon code to be opened in a new tab
window.addEventListener("click", function(event) {
	var tgt = event.target;
	if (tgt.nodeName == "SPAN" &&
		tgt.getAttribute("loc") != null) {
		self.port.emit("tabOpen", tgt.getAttribute("loc"));
	}
});


self.port.on("buildContentView", function() {
	buildContentView();
});


var buildContentView = function() {

	var editSumsDiv = document.createElement("div");
	editSumsDiv.style.backgroundColor = bgColors.editSums;
	editSumsDiv.innerHTML = interestingEditSummaries;

	var userPagesDiv = document.createElement("div");
	userPagesDiv.style.backgroundColor = bgColors.userPages;
	userPagesDiv.innerHTML = interestingUserPageSnippets;

	var talkPageDiv = document.createElement("div");
	talkPageDiv.style.backgroundColor = bgColors.talkPage;
	talkPageDiv.innerHTML = interestingTalkPageSections;

	document.body.innerHTML = "";
	document.body.appendChild(editSumsDiv);
	document.body.appendChild(userPagesDiv);
	document.body.appendChild(talkPageDiv);


};
