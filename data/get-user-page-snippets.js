self.port.on("getUserPageSnippets", function(interestingPhrases) {

	var snippets = [];
	
	try {
	
		var userPageContent = document.getElementById("bodyContent").textContent;
		
		for (var i = 0; i < interestingPhrases.length; i++) {

			var regex = new RegExp(interestingPhrases[i].re);

			if (regex.test(userPageContent)) {
				var reCtx = buildContextREFrom(interestingPhrases[i].re);
				snippets.push(reCtx.exec(userPageContent)[0]);
			}
		}
		
		self.port.emit("userPageSnippetsReady", snippets);

	} catch (e) {
		self.port.emit("userPageSnippetsError", e.message + ": " + e.lineNumber);
	}
});

// Given an RE of form "/[REGEX_MEAT]/gi", returns a regex matching the context of a match to REGEX_MEAT
var buildContextREFrom = function(re) {
	
	var ctxREStr = "([\\w]+[\\s]+){0,4}";
	ctxREStr += re;
	ctxREStr += "([\\s]+[\\w]+){0,4}";
	
	return new RegExp(ctxREStr, "i");
}