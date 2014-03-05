self.port.on("getTalkPageSnippets", function(interestingPhrases) {
	var snippets = {
		
	};

	// Like we do with get-user-page-snippets.js, we will go section-by-section
	// and return the targeted keyword along with its context

	try {

		// ...extract some snippets and put them in the snippets var...

		self.port.emit("talkPageSnippetsReady", snippets);
	} catch(e) {
		self.port.emit("talkPageSnippetsError", e);
	}
});