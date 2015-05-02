
// YYYY/MM/DD HH:MM:SS
module.exports.getCurrentDate = function() {
	var d = new Date;
	return [d.getFullYear(), d.getMonth() + 1, d.getDate() ].join('/') + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
}