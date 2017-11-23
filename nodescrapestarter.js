var exec = require('child_process').exec;

function startScrape(){
	exec('casperjs scrape.js', //process.env
		    { //Providing a env overwrites all other envs including PATH
		    	/*env: { 'PATH': './node\\_modules/.bin/',
		    		'deets' : process.env.deets,
		    	 },*/
			},
		    function(err, stdout, stderr) {
		        if (err) {
		            console.log('ERROR. err was:' + err);
		            console.log('\n' + err.message.toString());
		            console.log('\n' + err.code);
		            console.log('ERROR. stderr was:' + stderr);
		            process.exit(1);
		        } else {
		            console.log('success stdout was:' + stdout);
		        }
		    }
		);
}


console.log("Starting scrape...");
startScrape();
setInterval(forceCrash, 86400000);

function forceCrash(){
	console.log("Forcing a crash to restart server");
	process.exit(1);
}
/*
setTimeout(function(){
	console.log("Starting setInterval...");
	// every 24 hours
	setInterval(startScrape, 86400000);
	console.log("Starting scrape...");
	startScrape();
	// in roughly 4.86 hours it will be midnight, start of new day.
},17500000);

*/