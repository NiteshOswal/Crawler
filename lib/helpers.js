var url = require("url"),
	followredirects = require("follow-redirects"),
	http = require("http"),
	https = require("https"),
	log = true; //change it to false in a production environment, or if you want to!

/**
 * Bunch of helper functions which can be used all around the app
 */
module.exports = {
	log: function(s) {
		if(log) console.log(s);
	},
	httpize: function(s) {
		s = (!s.match(/^[a-zA-Z]+:\/\//g)) ? "http://" + s : s;
		return url.parse(s); //return the parsed url object
	},
	urlToString: function(s) {
		return s.protocol + ((s.slashes)?"//":"") + s.host;
	},
	objectUrlToString: function(o) {
		return url.format(o);
	},
	resolveUrl: function(s, p) {
		return url.resolve(s, p);
	},
	fetch: function(s, callback) {
		//returns a request object to handle stuff
		if(typeof s == "string") s = url.parse(s);
		var protocol = followredirects.http,
			options = {
				hostname: s.hostname,
				port: s.port,
				method: "GET",
				path: s.pathname,

			};
		if(s.protocol == "https:") {
			protocol = followredirects.https;
		}
		this.log("Helpers: Requesting: ");
		this.log(options);
		this.log("Protocol: " + s.protocol);
		var request = protocol.request(options, callback); //callback requires just 1 param to handle usually response
		request.end();
		return request;
	},
	isValidUrl: function(s) {
		/**
		 * Communities ftw! Source: http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url
		 */
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		  '(\\#[-a-z\\d_]*)?$','i' // fragment locator
		);
		return pattern.test(s);
	}
}