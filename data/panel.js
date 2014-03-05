var bgColors = {
	editSums: "#FF9999",
	userPages: "#E6E6AF",
	talkPage : "#80CCE6"
};

var interestingEditSummaries = "";
var interestingUserPageSections = "";
var interestingTalkPageSections = "";

self.port.on("setInterestingEditSummaries", function(editSummariesJson) {

	if (editSummariesJson.length == 0) {
		interestingEditSummaries = "No interesting edit summaries.";
	}

	else {
		var emitted = false;

		interestingEditSummaries = "";
		for (var i = 0; i < editSummariesJson.length; i++) {

			interestingEditSummaries += "<h3 style=\"font-weight:bold; font-size: 9pt;\">"
					+ "<span style=\"font-color:blue; text-decoration:underline; cursor:pointer;\" "
					+ "loc='" + editSummariesJson[i].link + "'>[Edit summary]</a></h3>"
					+ "<p style=\"font-size: 8pt;\">" + editSummariesJson[i].sum + "</p>\n";

		}
	}

	buildContentView();
});

window.addEventListener("click", function(event) {
	var tgt = event.target;
	if (tgt.nodeName == "SPAN" &&
		tgt.getAttribute("loc") != null) {
		self.port.emit("tabOpen", tgt.getAttribute("loc"));
	}
});

var buildContentView = function() {

	var editSumsDiv = document.createElement("div");
	editSumsDiv.style.backgroundColor = bgColors.editSums;
	editSumsDiv.innerHTML = interestingEditSummaries;

	var userPagesDiv = document.createElement("div");
	userPagesDiv.style.backgroundColor = bgColors.userPages;
	userPagesDiv.innerHTML = interestingUserPageSections;

	var talkPageDiv = document.createElement("div");
	talkPageDiv.style.backgroundColor = bgColors.talkPage;
	talkPageDiv.innerHTML = interestingTalkPageSections;

	document.body.innerHTML = "";
	document.body.appendChild(editSumsDiv);
	document.body.appendChild(userPagesDiv);
	document.body.appendChild(talkPageDiv);

};