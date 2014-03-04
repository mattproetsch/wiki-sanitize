document.getTDsByAttr = function(attr, value) {
	var everything = document.getElementsByTagName("td");
	var retn = [];

	for (var i = 0; i < everything.length; i++) {
		if (everything[i].getAttribute(attr) == value) {
			retn.push(everything[i]);
		}
	}

	return retn;
}

self.port.on("getEditors", function() {

	var retn = [];
	var users = document.getTDsByAttr("title", "User");
	for (var i = 0; i < users.length; i++) {
		retn.push(users[i].childNodes[0].innerHTML);
	}

	self.port.emit("editorsReady", retn);
});
