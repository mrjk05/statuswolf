var db = require("./db.js");
var uuid = require('node-uuid');

module.exports.login = function(email, password, callback) {
	var sessid = uuid.v4();
	
	console.log("email: " + email + ", password: " + password);
	
	var success = (((email == "jinskaduthodil@gmail.com") && (password == "secret")) || ((email == "vishalkaduthodil@gmail.com") && (password == "secret")));
	callback(success, sessid);
}

module.exports.checkSession = function(sessid, callback) {
	callback(true);
}