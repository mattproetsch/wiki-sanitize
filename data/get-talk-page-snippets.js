self.port.on("getTalkPageSnippets", function(interestingPhrases) {
	
	var snippets = [];
	
	
	// Like we do with get-user-page-snippets.js, we will go section-by-section
	// and return the targeted keyword along with its context
	
	

	try {

		var talkPageContent = document.getElementById("bodyContent").textContent;

		for (var i = 0; i < interestingPhrases.length; i++) {
			if (interestingPhrases[i].re.test(talkPageContent)) {
				var re = buildContextREFrom(interestingPhrases[i].re);
				snippets.push(re.exec(talkPageContent)[0]);
			}
		}
		// ...extract some snippets and put them in the snippets var...

		self.port.emit("talkPageSnippetsReady", snippets);
	} catch(e) {
		self.port.emit("talkPageSnippetsError", e.message);
	}
});


// Given an RE of form "/[REGEX_MEAT]/gi", returns a regex matching the context of a match to REGEX_MEAT
var buildContextREFrom = function(re) {

	var ctxREStr = "([\\w]+[\\s]+){0,4}";
	ctxREStr += re.toString().substr(1, re.toString().length-4);
	ctxREStr += "([\\s]+[\\w]+){0,4}";
	
	return new RegExp(ctxREStr, "i");
}
