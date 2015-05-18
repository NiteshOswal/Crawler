module.exports = {
	name: "ProjectCrawler",
	author: "Nitesh Oswal",
	support: "https://github.com/NiteshOswal",
	crawler: {
		depth: 2, //because 0 would suck
		name: "ProjectCrawlerBot", //if needed
		version: "1.0"
	},
	database: {
		host: "localhost",
		user: "root",
		password: "",
		database: "crawler"
	}
}