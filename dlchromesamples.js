var url = 'http://developer.chrome.com/extensions/samples.html'
var cheerio = require('cheerio'); 
var request = require('request');
var _ = require('underscore')._;
var mkdirp = require('mkdirp');
var path = './chromesamples/'
var fs = require('fs');
var Url = require('url');
//.resolve(from,to);
//

function doRequest(url){
console.log('dorequest');
request(url, function (error, response, body) {
console.log('got response');
  if (!error && response.statusCode == 200) {
    console.log(body) // Print the google web page.
	parseRequest(body,url);
  }else{
    console.log('err:',error);
    console.log('status:',response.statusCode)
    console.log('body:',body);
  }
});
}

function parseRequest(body,url){
	console.log('parsebody start: ',url);
    var $ = cheerio.load(body);
	_.each($('div.sample'),function(val,idx){ val = $($($(val).find('div')[2]).find('a'))
		_.each(val,function(file,idx2){ file = $(file);
			var href = file.attr('href');
			var folder = href.split('/');
			folder.pop();
			folder = folder.join('/')+'/'
			console.log('folder:',folder);
			mkdirp.sync(path+folder);
			var furl = Url.resolve(url,href);
			dlFile(href,furl,1000*idx+100*idx2);
			console.log('url:',url,"\nhref:",href,"\nfurl:",furl,"\n");
		});
	});
	}

doRequest(url);

function dlFile(href,furl,twait){
	setTimeout(function(){
	console.log('startdl:',furl);
		request(furl).pipe(fs.createWriteStream(path + href))
	},twait);
	
}