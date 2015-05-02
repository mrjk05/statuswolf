var express = require("express");
var db = require("./db.js");

module.exports.get = function(req, res) {
	console.log("todo.get");
	
	if (req.query.id) {
		console.log("get single");
		
		db.getTodo(req.query.id, function(err, todo) {
			if (err) {
				res.json({success:false, "err":err});
			} else {
				res.json({success:true, "todo":todo});
			}
		});
	}
	
	// List all
	else {
		console.log("get all");
		
		var assigneeemail = req.query.assigneeemail;
		var creatoremail = req.query.creatoremail;
		db.getTodos(assigneeemail, creatoremail, function(err, todos) {
			if (err) {
				res.json({success:false, "err":err});
			} else {
				res.json({success:true, "todos":todos});
			}
		});
	}
}

module.exports.put = function(req, res) {
	console.log("todo.put");

	var todo = {};
	if (req.query.creatoremail) todo.creatoremail = req.query.creatoremail;
	if (req.query.title) todo.title = req.query.title;
	if (req.query.description) todo.description = req.query.description;
	if (req.query.startdate) todo.startdate = req.query.startdate;
	if (req.query.enddate) todo.enddate = req.query.enddate;
	if (req.query.status) todo.status = req.query.status;
	if (req.query.assigneeemail) todo.assigneeemail = req.query.assigneeemail;
	
	db.addTodo(todo, function(err) {
		if (err) {
			res.json({success:false, "err":err});
		} else {
			res.json({success:true});			
		}
	});
}


module.exports.post = function(req, res) {
	console.log("todo.post");
	console.log(req.body);

	var todo = {};
	if (req.body.id) todo.id = req.body.id;
	if (req.body.creatoremail) todo.creatoremail = req.body.creatoremail;
	if (req.body.title) todo.title = req.body.title;
	if (req.body.description) todo.description = req.body.description;
	if (req.body.startdate) todo.startdate = req.body.startdate;
	if (req.body.enddate) todo.enddate = req.body.enddate;
	if (req.body.status) todo.status = req.body.status;
	if (req.body.assigneeemail) todo.assigneeemail = req.body.assigneeemail;
	
	db.updateTodo(todo, function(err) {
		if (err) {
			res.json({success:false, "err":err});
		} else {
			res.json({success:true});			
		}
	});
}