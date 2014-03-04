self.port.on("getEditSummaries", function() {

	var summaries = [];
	var pageHistory_ul = document.getElementById("pagehistory");

	try {
	for (var i = 1; i < pageHistory_ul.childNodes.length; i += 2) {
		td = pageHistory_ul.childNodes[i].getElementsByClassName("comment");
		if (td.length == 1 &&
		   (td[0].childNodes.length == 1 ||
				td[0].getElementsByClassName("autocomment").length == 0)) {

			summaries.push(td[0].textContent + "\n");

		}
	}

	self.port.emit("editSummariesReady", summaries);
	} catch (e) {
		self.port.emit("editSummariesError", e);
	}

});
