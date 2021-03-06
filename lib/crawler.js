var config = require("../config"),
	helpers = require("./helpers"),
	robots = require("./robots"),
	queue = require("./queue"),
	cheerio = require("cheerio"),
	//fiber = require("fibers"),
	minifier = require("html-minifier").minify;

/**
 * A basic crawler, can be required inside different modules and used as -
 * new Crawler(url, depth, persist)
 * @param string url The url to begin the crawling with
 * @param depth number The depth upto which the crawler should crawl
 * @param persist boolean Decides whether the queue should be saves inside a database
 */
function Crawler(url, depth, persist) {
	this.url = helpers.httpize(url);
	this.depth = depth || config.crawler.depth;
	this.counter = 0;
	//queue structure
	this.queue = new queue({
		url: helpers.urlToString(this.url), //pass in the base url
		persist: (persist != undefined)
	});
	this.robotsTxt = {};
	helpers.log("Crawler Init: \nhttpized url: ");
	helpers.log(this.url);
	helpers.log(" depth: " + this.depth);
	var _self = this;
	_self.work(); //let the crawling begin!
	/*var f = fiber(function() {
		
		fiber.yield();
		fiber.yield();
	});
	try {
		f.run();
	} catch(e) {}
	dumper(_self.queue.getBaseUrl(), _self.queue.getQueue());*/

}

Crawler.prototype._fetchAllUrls = function(body, depth) {
	var _self = this,
		$ = cheerio.load(body), //call in cheerio to parse the html body
		links = $("a"); 
	links.each(function(k, v) {
		_self.queue.push(v.attribs.href); //push them to the queue
	});
	return _self.queue.getQueue();
}

Crawler.prototype.crawl = function(url, depth) {
	var _self = this,
		request;
	if(depth == 0 || _self.queue.get(url) /*may return true if already crawled*/) {
		return false;
	}
	helpers.log("Crawler: Crawling " + url);
	/*
	 * Things needed (just for reference, so I don't forget the flow)
	 * BaseUrl: which I can get from this.queue.getBaseUrl()
	 * URL to start with: this.queue.getQueue()[0] || passed from parameter (need to think)
	 * Every push is resolving the URL, so not to worry about that, forget that atm
	 */
	 if(!_self.robotsTxt.canWeFetch(url)) { //if we can't fetch this
	 	return false;
	 }
	 helpers.fetch(url, function(response) {
	 	if(response.statusCode == 200) {
	 		_self.queue.pop(url); //set it's visited param to true
	 		var body = "";
	 		response.setEncoding("utf8");
	 		response.on("data", function(data) {
	 			body += data;
	 		});
	 		response.on("end", function() {
	 			_self.crawlAll(_self._fetchAllUrls(body, depth - 1), depth - 1); //decrement depth
	 		});
	 		response.on("error", function(err) {
	 			console.log("Request Error for : " + url);console.log(err); //why console.log? because unlike debugging mode, we need to see atleast errors;
	 		});
	 	}
	 });

}

Crawler.prototype.crawlAll = function(urls, depth) {
	var _self = this;
	helpers.log("Crawler: Depth: " + depth + "\nQueue: ");
	helpers.log(_self.queue.getQueue());
	urls.forEach(function(url) {
		_self.crawl(url, depth);
	});
}

Crawler.prototype.work = function() {
	var _self = this,
	robotsTxt = new robots(_self.url, function(response, bots) { //request robots.txt and pass in a callback to work on other things
		_self.queue.push(_self.url);
		_self.robotsTxt = robotsTxt; 
		helpers.log("Crawler: Depth: " + _self.depth + "\nQueue: ");
		helpers.log(_self.queue.getQueue());
		_self.crawl(_self.url, _self.depth);
	});
}

module.exports = Crawler;