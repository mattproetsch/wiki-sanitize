self.port.on("getUserPageSnippets", function(interestingPhrases) {
	var snippets = [ "This is an interesting user page snippet",
		"This is another interesting user page snippet"
		];

	// First, go section-by-section and compare textContent of section against interestingPhrases
	// maybe a "..." + {0, 3}interestingPhrase[i]{0, 3} + "..." sort of deal
	try {

		// Parse user page here
		// Fill in contents of snippets var
		self.port.emit("userPageSnippetsReady", snippets);
	} catch (e) {
		self.port.emit("userPageSnippetsError", e);
	}
});