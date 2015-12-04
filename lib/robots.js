var helpers = require("./helpers"),
	config = require("../config");

/**
 * Wrapper to request robots.txt and parse it into an easy to read object which 
 * can be used by the crawler via a callback
 * @param url string The url to be crawled
 * @param fetchCallback function the callback which'll have access to the robots.txt object
 */

function Robots(url, fetchCallback) {
	//this is supposed to be the parsed URL object
	this.url = url;
	this.bots = [];
	this.fetch(fetchCallback);
}

Robots.prototype.parse = function(txt) {
	var _self = this,
		lines = txt.split("\n"),
		currentUA = "";
	lines.forEach(function(line) {
		line = line.trim().toLowerCase().split(": ");
		switch(line[0]) {
			case 'user-agent':
				if(typeof currentUA == "object") {
					_self.bots.push(currentUA);
				}
				currentUA = {name: line[1], disallow: [], allow: []};
				break;
			case 'disallow':
				currentUA.disallow.push( line[1].trim() );
				break;
			case 'allow':
				currentUA.allow.push( line[1].trim() );
				break;
			case 'sitemap': //maybe something to think about later
				break;
			default:
				break;
		}
	});
	if(_self.bots.length == 0 && typeof currentUA == "object") {
		_self.bots.push(currentUA);
	}
	helpers.log("Robots: robots.txt parsed \nObject - ");
	helpers.log(_self.bots);
}

Robots.prototype.findBot = function(botname) {
	var _self = this;
	helpers.log("Botname : " + botname);
	for (var i = _self.bots.length - 1; i >= 0; i--) {
		if(_self.bots[i].name == botname) {
			return _self.bots[i];
		}
	};
	return false;
}

Robots.prototype.canWeFetch = function(url) {
	helpers.log(url);
	if(typeof url == "object") url = helpers.objectUrlToString(url);
	helpers.log("Robots: Can We Fetch : " + url);
	var _self = this,
		bot = false,
		allowed = true,
		bots = ["*", config.crawler.name.toLowerCase()];
		helpers.log("Robots: Test Bots :"); helpers.log(bots);
	for (var i = bots.length - 1; i >= 0; i--) {
		bot = _self.findBot(bots[i]);
		helpers.log("Robots: Bot: " + bots[i] + " Find Bot Status: ");helpers.log(bot);
		if(bot) {
			if(bot.disallow.length > 0) {
				allowed = !((new RegExp(bot.disallow.join("\\b|\\b"))).test(url)); //first, are we disallowed?
				helpers.log("Robots: Test - disallowed for " + bots[i] + " Result: " + allowed);
			}
			if(bot.allow.length > 0) {
				allowed = ((new RegExp(bot.allow.join("\\b|\\b"))).test(url)); //second, are we allowed? like even a slightest bit
				helpers.log("Robots: Test - allowed for " + bots[i] + " Result: " + allowed);
			}
		}
	};
	helpers.log("Robots: " + ((allowed)?"yes we can":"no we can't, nuh uh") + " fetch : " + url);
	return allowed;
}

Robots.prototype.fetch = function(callback) {
	var _self = this;
	if(typeof callback == undefined) { //maybe if I wanted to, I can slip a callback to deal with the bots
		callback = function(response, bots) {};
	}
	helpers.log("Robots: fetching robots.txt");
	var request = helpers.fetch(helpers.urlToString(_self.url) + "/robots.txt", function(response) {
		response.setEncoding("utf8"); //because we originally receive a buffer
		response.on("data", function(txt) {
			helpers.log("Robots: fetched a copy of robots.txt buffer");
			_self.parse(txt);
			callback(true, _self.bots);
		})
	});
	request.on("error", function(e) {
		helpers.log("Robots: cannot fetch robots.txt for this host");
		callback(false, _self.bots)
	});
}

module.exports = Robots;