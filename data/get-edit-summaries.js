self.port.on("getEditSummaries", function() {

	var summaries = [];
	var pageHistoryEdits = document.getElementById("pagehistory").querySelectorAll("li");

	//try {
	for (var i = 0; i < pageHistoryEdits.length; i++) {

		var td = pageHistoryEdits[i].getElementsByClassName("comment");

		if (td.length == 1 &&
			// We don't care about autocomments!
		   (td[0].getElementsByClassName("autocomment").length == 0)) {

			if (i != 0) {
				summaries.push({
					sum: td[0].textContent,
					link: pageHistoryEdits[i].getElementsByClassName("mw-history-histlinks")[0].childNodes[1].href
				});
			}
			else {
				// This is the current edit and therefore does not have a "cur" link
				summaries.push({
					sum: td[0].textContent,
					link: null
				});
			}

		}
	}

	self.port.emit("editSummariesReady", summaries);


	//} catch (e) {
	//	self.port.emit("editSummariesError", e);
	//}

});
