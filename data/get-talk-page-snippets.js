self.port.on("getTalkPageSnippets", function(interestingPhrases) {
	
	var snippets = [];

	try {

		var talkPageContent = document.getElementById("bodyContent").textContent;

		for (var i = 0; i < interestingPhrases.length; i++) {

			var regex = new RegExp(interestingPhrases[i].re);

			if (regex.test(talkPageContent)) {
				var reCtx = buildContextREFrom(interestingPhrases[i].re);
				snippets.push(reCtx.exec(talkPageContent)[0]);
			}
		}

		self.port.emit("talkPageSnippetsReady", snippets);

	} catch (e) {
		self.port.emit("talkPageSnippetsError", e.message + ": " + e.lineNumber);
	}
});

// Given an RE of form "/[REGEX_MEAT]/gi", returns a regex matching the context of a match to REGEX_MEAT
var buildContextREFrom = function(re) {
	
	var ctxREStr = "([\\w]+[\\s]+){0,4}";
	ctxREStr += re;
	ctxREStr += "([\\s]+[\\w]+){0,4}";
	
	return new RegExp(ctxREStr, "i");
}