var exec = require('child_process').exec;
console.log("Starting scrape");
setInterval(startScrape, 86400000);
startScrape();

function startScrape(){
	exec('casperjs scrape.js',
		    {
		    	env: { //'PATH': 'C:/phantomjs-2.1.1-windows/bin:./node\\_modules/.bin/:/app/.heroku/node/bin',
		    		'deets' : process.env.deets,
		    	 },
			},
		    function(err, stdout, stderr) {
		        if (err) {
		            console.log('ERROR. err was:' + err);
		            console.log('ERROR. stderr was:' + stderr);
		        } else {
		            console.log('success stdout was:' + stdout);
		        }
		    }
		);
}
