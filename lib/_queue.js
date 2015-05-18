var helpers = require("./helpers");
var config = require("./config");
var mysql = require("mysql");
var pool = mysql.createPool(config.database);

/**
 * Iteration 1, with db? hopefully next version
 */

function Queue(options) {
	this.queue = options.queue || [];
	this.baseUrl = options.url;
	helpers.log("Inital Queue : ");
	helpers.log(this);
}

Queue.prototype.getBaseUrl = function() {
	return this.baseUrl;
}

Queue.prototype.getQueue = function() {
	return this.queue;
}

Queue.prototype.forEach = function(callback) {
	this.queue.forEach(callback);
}

Queue.prototype.push = function(url) {
	if(url != undefined && url != "" && url != null && url != "javascript:;")  {
		var temp = helpers.resolveUrl(this.baseUrl, url);
		temp = new Buffer(temp).toString('base64')
		if(this.queue.indexOf(temp) == -1) { //only insert if not found
			pool.getConnection(function(err, connection) {
				connection.query("INSERT INTO `repo` (`url`) values (?)", [], function(error, results, fields) {
					connection.release();
				});
			});
			this.queue.push(temp);
		}
	}
	return (this.queue.length - 1);
}

Queue.prototype.pop = function(key) {
	this.queue.pop(key);
}

module.exports = Queue;