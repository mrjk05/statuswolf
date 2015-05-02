var nodemailer = require("nodemailer");

module.exports.send = function(to, subject, message) {
	var transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: "statuswolf123@gmail.com",
			pass: "statuswolfpassword"
		}
	});
	
	var toStr = "";
	var i = 0;
	to.forEach(function(addr) {
		toStr += addr;
		if (i != (to.length - 1)) toStr += ", ";
	});
	
	var mailOptions = {
		"from": "StatusWolf <wolfmaster@statuswolf.com.tar.gz>",
		"to": toStr,
		"subject": subject,
		"text": message,
		"html": message
	};
	
	transporter.sendMail(mailOptions, function(err, info) {
		if (err) {
			console.log("Failed to send mail.");
			console.log(err);
		} else {
			console.log("Mail sent.");			
		}
	});
}
