var express = require("express");
var db = require("./db.js");

module.exports.get = function(req, res) {
	var userid = req.query.userid;

	db.getUser(userid, function(err, user) {
		if (err) {
			return res.json({success:false, "err":err});
		}
		res.json(user);
	});
}
