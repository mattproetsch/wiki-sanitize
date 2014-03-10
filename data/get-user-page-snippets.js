var phrases;

self.port.on("getUserPageSnippets", function(interestingPhrases) {
	try {
		
	phrases = interestingPhrases;
	
	var snippets = [];
	
	var userPageContent = document.getElementById("bodyContent").textContent;

	// First, go section-by-section and compare textContent of section against interestingPhrases
	// maybe a "..." + {0, 3}interestingPhrase[i]{0, 3} + "..." sort of deal
	
	for (var i = 0; i < phrases.length; i++) {
		if (phrases[i].test(userPageContent)) {
			// Construct a new re that will grab the context of this interesting phrase
			// and append it to the returned array of interesting phrases
			
			// This monstrosity cuts off the leading and trailing slashes and flags from the
			// regex given by phrases[i]
			var re = new RegExp("([\\w]+[\\s]+){0, 4}" + phrases[i].toString().substr(
														   1, phrases[i].toString().length-4)
														+ "([\\s]+[\\w]+){0, 4}", "i");
			snippets.push(re.exec(userPageContent)[0]);
		}
	}
	
	self.port.emit("userPageSnippetsReady", snippets);
	} catch (e) {
		self.port.emit("userPageSnippetsError", e);
	}
});
