self.port.on("getUserPageSnippets", function(interestingPhrases) {
	var snippets = [];
	
	try {
	
		var userPageContent = document.getElementById("bodyContent").textContent;

		// First, go section-by-section and compare textContent of section against interestingPhrases
		// maybe a "..." + {0, 3}interestingPhrase[i]{0, 3} + "..." sort of deal
		
		for (var i = 0; i < phrases.length; i++) {
			if (interestingPhrases[i].re.test(userPageContent)) {
				// Construct a new re that will grab the context of this interesting phrase
				// and append it to the returned array of interesting phrases
				var re = buildContextREFrom(interestingPhrases[i].re);
				snippets.push(re.exec(userPageContent)[0]);
			}
		}
		
		self.port.emit("userPageSnippetsReady", snippets);
	} catch (e) {
		self.port.emit("userPageSnippetsError", e.message);
	}
});

// Given an RE of form "/[REGEX_MEAT]/gi", returns a regex matching the context of a match to REGEX_MEAT
var buildContextREFrom = function(re) {
	
	var ctxREStr = "([\\w]+[\\s]+){0,4}";
	ctxREStr += re.toString().substr(1, re.toString().length-4);
	ctxREStr += "([\\s]+[\\w]+){0,4}";
	
	return new RegExp(ctxREStr, "i");
}
