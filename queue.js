var helpers = require("./helpers"),
	merge = require("merge");
/**
 * Iteration 2 for queue
 */

function Queue(options) {
	this.queue = options.queue || {};
	this.baseUrl = options.url;
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
			this.queue[temp] = false;
		}
	}
}

Queue.prototype.pushAll = function(urls) {
	var obj = urls.reduce(function(o, v, i) {
		if(url != undefined && url != "" && url != null && url != "javascript:;")  {
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
	this.queue[key] = false;
}

module.exports = Queue;