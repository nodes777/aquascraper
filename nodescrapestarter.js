var exec = require('child_process').exec;
console.log("Starting setInterval...");
setInterval(startScrape, 86400000);
console.log("Starting scrape...");
startScrape();

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
