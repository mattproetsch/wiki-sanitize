self.port.on("resolvePageTitle", function() {

	// Wikipedia pages can consist of any characters except an octothorpe, I think
	var title_re = new RegExp("https?://en.wikipedia.org/wiki/([^\#]+)");
	var title = title_re.exec(document.URL);

	try {
		// Return the first captured subgroup
		self.port.emit("titleResolved", title[1]);
	} catch (e) {
		window.alert("Title not resolved");
	}
});


self.port.on("alert", function(msg) {
	window.alert(msg);
});
