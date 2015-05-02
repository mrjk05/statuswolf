var express = require("express");
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var auth = require("./auth.js");
var user = require("./user.js");
var todo = require("./todo.js");

function validateSessidGET(req, res, callback) {
	validateSessid(req.query.sessid, req, res, callback);
}

function validateSessidPOST(req, res, callback) {
	validateSessid(req.body.sessid, req, res, callback);
}

function validateSessidPUT(req, res, callback) {
	validateSessid(req.query.sessid, req, res, callback);
}

function validateSessid(sessid, req, res, callback) {
	callback(req, res);
	/*
	if (!sessid) {
		res.json({success:false, err:"SESSID_INVALID"});
		return;
	}
	
	auth.checkSession(sessid, function(success) {
		if (success) {
			callback(req, res);
		} else {
			res.json({success:false, err:"SESSID_INVALID"});
		}
	});*/
}

// user
app.get("/user", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	validateSessidGET(req, res, function(req, res) {
		user.get(req, res);
	});	
});

// login
app.get("/login", function(req, res) {	
	res.header("Access-Control-Allow-Origin", "*");
	var email = req.query.email;
	var password = req.query.password;
	
	if (!email || !password) {
		console.log("Bad query:");
		console.log(req.query);
	}
	
	auth.login(email, password, function(success, sessid) {
		if (success) {
			res.json({success:true, "sessid":sessid});
		} else {
			res.json({success:false, err:"AUTH_FAIL"});
		}
	});
});

// todo
app.get("/todo", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	validateSessidGET(req, res, function(req, res) {
		todo.get(req, res);
	});
});
app.put("/todo", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	validateSessidPUT(req, res, function(req, res) {
		todo.put(req, res);
	});
});
app.post("/todo", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	validateSessidPUT(req, res, function(req, res) {
		todo.post(req, res);
	});
});

app.listen("8086");