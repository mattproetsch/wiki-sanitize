self.port.on("resolvePageTitle", function() {

	var title_re = new RegExp("https?://en.wikipedia.org/wiki/([\\S]+)");
	var title = title_re.exec(document.URL);

	try {
		// Return the first captured subgroup
		self.port.emit("titleResolved", title[1]);
	} catch (e) {
		window.alert("Title not resolved");
	}
});

self.port.on("alert", msg) {
	window.alert(msg);
}