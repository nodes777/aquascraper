console.log('Executing casper test');
var request = require('request');
var exec = require('child_process').exec;
var fishArray = ["fwanabantoid","fwbettasct","fwbettasd","fwbettasdt","fwbettashm","fwbettashmp","fwbettasvt","fwbettaswt","fwbettas","fwarowana","fwcatfishc","fwcatfishp","fwcatfish","fwcharacins","fwcichlidsmh","fwcichlidsmmb","fwcichlidsmp","fwcichlidsm","fwcichlidst","fwcichlidsv","fwcichlidsw","fwcichlidc","fwangelfish","fwapisto","fwdiscus","fwcichlidso","fwcyprinids","fwflowerhorn","fwgoldfish","fwguppies","fwinverts","fwkillifish","fwkillifishe","fwkoi","fwlivebearers","fwlivebearersw","fwcatfishl","fwrainbows","fwsnails","fwstringray","fwusnative","fw","fwmixed"];
var deets = require("./deets.js");

var allAuctions = {};

var promises = fishArray.map(function(currentFish) {
  return new Promise(function(resolve, reject) {
    	exec('casperjs turnitoffandon.js',
		    {
		    	env: { //'PATH': 'C:/phantomjs-2.1.1-windows/bin:./node\\_modules/.bin/:/app/.heroku/node/bin',
		    			'currentFish': currentFish
		    	 },
			},
		    function(err, stdout, stderr) {
		        if (err) {
		            console.log('ERROR. err was:' + err);
		            console.log('ERROR. stderr was:' + stderr);
		            return reject(err);
		        } else {
		            console.log('success stdout was:' + stdout);
		            allAuctions[currentFish] = JSON.parse(stdout);
		            //console.log(allAuctions);
		            resolve();
		        }
		    }
		);
    });
  });

Promise.all(promises)
.then(function() {
	console.log("allAuctions are done."+allAuctions);
	console.log("Sending to Firebase...");
		var options = {
		  method: 'post',
		  body: allAuctions,
		  json: true,
		  url: "https://aquascraper-data.firebaseio.com/test.json?auth="+deets+"&debug=true"
		};
		request(options, function (err, res, body) {
		  if (err) {
		    console.error('error posting json: ', err);
		    throw err;
		  }
		  var headers = res.headers;
		  var statusCode = res.statusCode;
		  console.log('headers: ', headers);
		  console.log('statusCode: ', statusCode);
		  console.log('body: ', body);
		});

})
.catch(console.error);

/*
fishArray.forEach(function(currentFish){
	exec('casperjs turnitoffandon.js',
	    {
	    	env: { //'PATH': 'C:/phantomjs-2.1.1-windows/bin:./node\\_modules/.bin/:/app/.heroku/node/bin',
	    			'currentFish': currentFish
	    	 },
		},
	    function(err, stdout, stderr) {
	        if (err) {
	            console.log('ERROR. err was:' + err);
	            console.log('ERROR. stderr was:' + stderr);
	        } else {
	            console.log('success stdout was:' + stdout);
	            allAuctions[currentFish] = stdout;
	            //console.log(allAuctions);
	        }
	    }
	);
});
*/

/*
request.post({
            url: "https://aquascraper-data.firebaseio.com/test.json?auth="+deets+"&debug=true",
            json: allAuctions,
        },
        function (err, httpResponse, body) {
            console.log("Error: "+ err, "Sent: "+body);
        });

*/