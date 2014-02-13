
var options = {};
var config = {
	prefix: 'stable_'
};

var compareVersion = exports.compareVersion = function (v1, v2) {
	return v2.major > v1.major || (v2.major == v1.major && (v2.minor > v1.minor || (v2.minor == v1.minor && v2.patch > v1.patch)));
};

var formatVersion = exports.formatVersion = function (version) {
	var v = version.split('.');
	return {
		major: parseInt(v[0].substr(config.prefix.length)),
		minor: parseInt(v[1]),
		patch: parseInt(v[2])
	}
};

/*
 * Checks to see if this is a git repository
**/
exports.isRepo = function(callback){
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
exports.pull = function(remote, branch, callback){
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
		if(typeof callback == 'function') callback(err, stdout);
	});
};

/*
 * Calls `git branch`
**/
exports.branch = function(name, args, callback) {
  	args = (args || []).concat([name]);
  	return this.exec('branch', args, function (err, stdout) {
  		if(typeof callback == 'function')
  			callback(err, stdout);
  	});
};

/*
 * Calls `git checkout`
**/
exports.checkout = function(branch, args, callback) {
  	args = (args || []).concat([branch]);
  	return this.exec('checkout', args, function (err, stdout) {
  		if(typeof callback == 'function') callback(err, stdout);
  	});
};

/*
 *
**/
exports.fetch = function (callback) {
	return this.exec('fetch', function (err, stdout) {
		if(typeof callback == 'function') callback(err, stdout);
	});
};

/*
 * Calls `git reset --hard HEAD`
**/
exports.reset = function (callback) {
	options = {
		hard: true
	};
	return this.exec('reset', options, ['HEAD'], function (err, stdout) {
		if(typeof callback == 'function') callback(err, stdout);
	});
};

/*
 * Get all branches and store it in an array
**/
exports.branches = function (ast, callback) {
	options = {
		a: true
	};
	this.exec('branch', options, [], function (err, stdout) {
		var branches = stdout.split("\n");
		var b = [];
		branches.forEach(function (branch) {
			branch = branch.replace(/\s+/g, '');
			if(ast) branch = branch.replace('*', '');
			b.push(branch);
		});
		callback(b);
	});
};

/*
 * Get the current branch
**/
exports.currentBranch = function (callback) {
	this.branches(false, function (branches) {
		for(var a = 0; a < branches.length; a++) {
			if(branches[a].charAt(0) == '*') {
				callback(branches[a]);
				break;
			}
		}
	});
};

/*
 * Find the latest branch basing the version.
**/
exports.latestBranch = function (callback) {
	this.branches(true, function (branches) {
		var latest = '';
		branches.forEach(function (branch) {
			if(branch.indexOf(config.prefix) >= 0) {
				branch = branch.substr(branch.indexOf(config.prefix));
				if(latest == '') latest = branch;
				if(compareVersion(formatVersion(latest), formatVersion(branch))) {
					latest = branch;
				}
			}
		});
		callback(latest);
	});
};
