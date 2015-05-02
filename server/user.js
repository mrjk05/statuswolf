var express = require("express");
var db = require("./db.js");

module.exports.get = function(req, res) {
	if (req.query.email) {
		db.getUser(req.query.email, function(err, user) {
			if (err) {
				return res.json({success:false, "err":err});
			}
			res.json(user);
		});
	} else {
		// Get all users
		db.getUsers(function(err, users) {
			if (err) {
				return res.json({success:false, "err":err});
			}
			res.json(users);
		});
	}
}
