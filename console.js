/**
 * The console entry point for the crawler app
 */
var helpers = require("./helpers"),
	crawler = require("./crawler"),
	config = require("./config"),
	fs = require("fs"),
	path = require("path"), //to avoid relative links in file dumps
	args = require("minimist")(process.argv.slice(2)),
	usage = "Usage: node console.js <url> [-d depth]";
if(args.h == true || args._[0] == "help") {
	console.log(
		"\n" + config.name + ", by " + config.author + " (" + config.support + ") \n\n" +
		usage +
		"-d  depth of crawling"
	);
} else {
	if(helpers.isValidUrl(args._[0])) {
		helpers.log("Console Init: url: " + args._[0] + " depth: " + args.d);
		var c = new crawler(args._[0], args.d, function(name, queue) {
			helpers.log("Crawler: Dumping URLs to file \t for URL:" + name);
			fs.writeFileSync(path.join(__dirname, "dumps") + "/" + new Buffer(name).toString('base64') + ".json", JSON.stringify({
				name: name,
				date: new Date(),
				urls: queue
			}));
		});
	} else {
		console.warn("Please enter a valid url to crawl");
	}
}
