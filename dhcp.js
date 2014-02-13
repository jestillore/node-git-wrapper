
var exec = require('child_process').exec;

var start = exports.start = function (callback) {
	exec('sudo service isc-dhcp-server start', function (err, stdout, stderr) {
		if(typeof callback == 'function') callback(stdout.indexOf('start/running') >= 0);
	});
};

var stop = exports.stop = function (callback) {
	exec('sudo service isc-dhcp-server stop', function (err, stdout, stderr) {
		if(typeof callback == 'function') callback(stdout.indexOf('stop/waiting') >= 0);
	});
};

var status = exports.status = function (callback) {
	exec('service isc-dhcp-server status', function (err, stdout, stderr) {
		callback(stdout.indexOf('start/running') >= 0);
	});
};
