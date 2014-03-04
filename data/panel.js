self.port.on("setHTML", function(setHTML) {
	document.innerHTML = setHTML;
});

self.port.on("setInterestingEditSummaries", function(editSummariesJson) {


	document.body.innerHTML = "";

	if (editSummariesJson.length == 0) {
		document.body.style = "text-align: left; padding-left: 100px;";
		document.body.innerHTML = "<p>No interesting edit summaries.</p>";
	}

	else {
		document.body.style = "";
		for (var i = 0; i < editSummariesJson.length; i++) {
			var summary = document.createElement("p");
			summary.innerHTML = "<b>" + editSummariesJson[i].editSummary + ":</b> " + editSummariesJson[i].desc + "\n";
			document.body.appendChild(summary);
		}
	}
})