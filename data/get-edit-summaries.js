var phrases;

self.port.on("getEditSummaries", function(interestingPhrases) {

	phrases = interestingPhrases;
	
	var summaries = [];
	var pageHistoryEdits = document.getElementById("pagehistory").querySelectorAll("li");

	try {
	for (var i = 0; i < pageHistoryEdits.length; i++) {

		var td = pageHistoryEdits[i].getElementsByClassName("comment");

		if (td.length == 1 &&
			// We don't care about autocomments!
		   (td[0].getElementsByClassName("autocomment").length == 0)) {
		   	
		   	var editSummary = td[0].textContent;

			if (i != 0 && testPhrase(editSummary)) {
				summaries.push({
					sum: editSummary,
					link: pageHistoryEdits[i].getElementsByClassName("mw-history-histlinks")[0].childNodes[1].href
				});
			}
			else if (testPhrase(editSummary) {
				// This is the current edit and therefore does not have a "cur" link
				summaries.push({
					sum: editSummary,
					link: null
				});
			}

		}
	}

	self.port.emit("editSummariesReady", summaries);


	} catch (e) {
		self.port.emit("editSummariesError", e.message);
	}

});


var testPhrase = function(editSummary) {

	for (var i = 0; i < phrases.length; i++) {
		if (phrases[i].re.test(editSummary)) {
			return true;
		}
	}
	
	return false;
}
