var helpers = require("./helpers"),
	merge = require("merge"),
	config = require("../config");
	mysql = require("mysql");
	pool = mysql.createPool(config.database);
/**
 * Iteration 2 for queue
 */

function Queue(options) {
	this.queue = options.queue || {};
	this.baseUrl = options.url;
	this.persist = options.persist || false;
	helpers.log("Inital Queue : ");
	helpers.log(this);
}

Queue.prototype.getBaseUrl = function() {
	return this.baseUrl;
}

Queue.prototype.getQueue = function() {
	return Object.keys(this.queue);
}

Queue.prototype.get = function(index) {
	return this.queue[index];
}

Queue.prototype.push = function(url) {
	if(url != undefined && url != "" && url != null && url != "javascript:;")  {
		var temp = helpers.resolveUrl(this.baseUrl, url);
		if(this.queue[temp] == undefined && typeof this.queue[temp] != "boolean" && typeof temp != "object") { //only insert if not found
			if(this.persist) {
				pool.getConnection(function(err, connection) {
					connection.query("INSERT INTO `repo` (`url`) values (?)", [temp], function(error, results, fields) {
						connection.release();
					});
				});
			}
			this.queue[temp] = false;
		}
	}
}

Queue.prototype.pushAll = function(urls) {
	var obj = urls.reduce(function(o, v, i) {
		if(url != undefined && url != "" && url != null && new RegExp(/^java/g).test(url) == false)  {
			var temp = helpers.resolveUrl(this.baseUrl, v);
			if(this.queue[temp] == undefined && typeof this.queue[temp] != "boolean") { //only insert if not found
				this.queue[temp] = false;
			}
		}
		o[v] = false;
	}, {});
	this.queue = merge(this.queue, obj);
}

Queue.prototype.pop = function(key) {
	if(this.persist) {
		pool.getConnection(function(err, connection) {
			connection.query("UPDATE `repo` set `crawled` = '1' where `url` = ?", [key], function(error, results, fields) {
				connection.release();
			});
		});
	}
	this.queue[key] = true;
}

module.exports = Queue;