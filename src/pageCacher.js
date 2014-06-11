// Require MD5 module from https://code.google.com/p/crypto-js/
phantom.injectJs('md5.js');

var page = require('webpage').create();
var fs = require('fs');
var system = require('system');

var args = system.args;
var sitemappath;
var pageCount = 0;

if (args.length !== 2) {
	console.log('Must pass sitemap URL as command line argument');
	phantom.exit();
} 
else {
	sitemappath =  args[1];
}

page.open(sitemappath, function(status) {
	if(status !== 'success') {
		console.log('error loading sitemap');
		phantom.exit();
	}
	else {
		var xmlDoc = loadXMLString(page.content);
		var urls = xmlDoc.getElementsByTagName('url');
		processNextPage(urls);
	}
});

var processNextPage = function (urls) {
    if(pageCount >= urls.length) {
		phantom.exit();
	}
	else {
		var url = urls[pageCount].getElementsByTagName('loc')[0].textContent.toLowerCase();
		console.log(url + '\r\n' + CryptoJS.MD5(url) + '\r\n');
		page.open(url, function(status) {
			console.log(page.title);
			fs.write(CryptoJS.MD5(url) + '.html', page.content, 'w');

			pageCount++;
			processNextPage(urls);
		});
	}
};

var loadXMLString = function(txt) {
	if (window.DOMParser) {
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(txt,"text/xml");
	}
	return xmlDoc;
};