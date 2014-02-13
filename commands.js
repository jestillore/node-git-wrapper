
var options = {};

/*
 * Checks to see if this is a git repository
**/
var isRepo = exports.isRepo = function(callback){
	var answer = true;
	return this.exec('status', function(err, msg){
		if(err){
			answer = err.toString().indexOf('Not a git repository') === -1;
		}
		callback(answer);
	});
};

/*
 * Pull latest from the repository
**/
var pull = exports.pull = function(remote, branch){
  	if(typeof remote == 'function') {
    	callback = remote;
    	remote = 'origin';
    	branch = 'master';
  	} else if(typeof branch == 'function') {
    	callback = branch;
    	branch = 'master';
  	}

  	var args = [remote, branch];
	return this.exec('pull', args, function (err, stdout) {

	});
};

/*
 * Calls `git branch`
**/
var branch = exports.branch = function(name, args, callback) {
  	args = (args || []).concat([name]);
  	return this.exec('branch', args, function (err, stdout) {
  		if(typeof callback == 'function')
  			callback(err, stdout);
  	});
};

/*
 * Calls `git checkout`
**/
var checkout = exports.checkout = function(branch, args) {
  	args = (args || []).concat([branch]);
  	return this.exec('checkout', args, function (err, stdout) {

  	});
};

/*
 * Calls `git reset --hard HEAD`
**/
var reset = exports.reset = function () {
	options = {
		hard: true
	};
	return this.exec('reset', options, ['HEAD'], function (err, stdout) {

	});
};
