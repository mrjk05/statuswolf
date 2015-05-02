var cps = require('cps-api');
var conn = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'statuswolf', 'cnr.cpp@hotmail.com', 'cp3124lol', 'document', '//document/id', {'account': 100090});
var uuid = require('node-uuid');
var utils = require('./utils.js');
var j2xml = require('js2xmlparser');

// Todos
module.exports.getTodos = function(assigneeemail, creatoremail, callback) {
	console.log("module.exports.getTodos");
	var key = (assigneeemail ? "assigneeemail" : "creatoremail");
	var value = (assigneeemail ? assigneeemail : creatoremail);
	
	var querystr = "(" + cps.Term(value, key) + cps.Term("todo", "type") + ")";
	var searchReq = new cps.SearchRequest(querystr);
	conn.sendRequest(searchReq, function (err, searchRes) {
		if (err) return callback(err);
		
		callback(null, searchRes.results.document);
	});
}

module.exports.getTodo = function(id, callback) {
	console.log("module.exports.getTodo");
	
	var querystr = "(" + cps.Term(id, "id") + cps.Term("todo", "type") + ")";
	var searchReq = new cps.SearchRequest(querystr);
	conn.sendRequest(searchReq, function (err, searchRes) {
		if (err) return callback(err);
		
		callback(null, searchRes.results.document[0]);
	});
}

module.exports.addTodo = function(todo, callback) {
	todo.id = uuid.v4();
	todo.type = "todo";

	// Required fields
	if (!todo.title) return callback("title required.");
	
	// Default start date to now
	if (!todo.startdate) todo.startdate = utils.getCurrentDate();
	
	// Default status to green
	if (!todo.status) todo.status = 3;
	
	// Default assignee to creator
	if (!todo.assigneeemail) todo.assigneeemail = todo.creatoremail;
	
	conn.sendRequest(new cps.InsertRequest([todo]), function (err, res) {
		if (err) {
			console.error(err);
			return callback(err);
		}
		return callback();
	});
}

module.exports.updateTodo = function(todo, callback) {
	var updateReq = new cps.PartialReplaceRequest(todo);
	conn.sendRequest(updateReq, function(err, updateRes) {
	   if (err) {   
			console.error(err);
			return callback(err);
	   }
	   return callback();
	});
}

// Users
module.exports.getUser = function(email, callback) {
	var searchReq = new cps.SearchRequest(cps.Term(email, "email"));
	conn.sendRequest(searchReq, function (err, searchRes) {
		if (err) return callback(err);
	
		callback(null, searchRes.results.document[0]);
	});
}
