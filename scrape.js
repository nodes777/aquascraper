/* Casperjs Script */
var fs = require("fs");
var system = require('system');
//var utils = require('utils'); // native module, for debuggin
var fishArray = JSON.parse( fs.read("./input/fishArray.js") );

/* Utility Functions */
var tableToJSON = require('./utils/tableToJSON');
var grab = require('./utils/grabTable');
var sold = require('./utils/getSoldItems');
var getAvg = require('./utils/getAvg');
var getStdDev = require('./utils/getStdDev');
var getSalesVolume = require('./utils/getSalesVolume');
//var deets = require('./deets');
var deets = "8U20xkoK7TNgnRXFnnlM9PBi6bSarxgt9nYmgV26" ;

/* Get a Date to send to the url for better Firebase organization*/
var time = Date.now();
var date = new Date(time);
console.log("\nStarting scrape on: " + date);

var dateArray = date.toString().split(" ");
var dayOfWeek = dateArray[0];
var dayScraped = dateArray.slice(2,3);
dayScraped.push(dayOfWeek);
var dayScrapedUrl = dayScraped.join("-");

var firebaseMonth = dateArray.slice(1,2);
firebaseMonth += dateArray.slice(3,4);

var firebaseMonthPath = firebaseMonth.toString();

console.log(firebaseMonthPath);

/* Create casper object*/
var casper = require('casper').create({
  //verbose: true,
  //logLevel: 'debug',
  /* Inject jquery on the page so I can select easier */
  clientScripts: ["./utils/jquery.min.js"],
  /* Don't load images to save memory */
    pageSettings: {
      // NO WAIT, DO LOAD IMAGES, for some BS reason, this prevents a worse memory leak
        loadImages:  true,
        loadPlugins: false,
    },
    /* Don't load these kinds of files too */
    onResourceRequested : function(R, req, net) {
    var match = req.url.match(/fbexternal-a\.akamaihd\.net\/safe_image|\.pdf|\.mp4|\.png|\.gif|\.avi|\.bmp|\.jpg|\.jpeg|\.swf|\.fla|\.xsd|\.xls|\.doc|\.ppt|\.zip|\.rar|\.7zip|\.gz|\.csv/gim);
    if (match !== null) {
      net.abort();
    }
  },
});

/* Paths */
var url = "http://www.aquabid.com/cgi-bin/auction/closed.cgi";
// var outputFormat = ".json" // js, txt, html
// var pathToFolder = "./data/";
// var arrPath = "./array/";
// var soldPath = "./sold/";
// var jsonPath = "./json/";

/* Array to fill and send to Firebase */
var allFish = {
  allAuctions: {},
  stats: {}
  //sold : {}
};

/* For capturing console.logs() within the pages
      casper.on('remote.message', function(msg) {
        this.echo('remote message caught: ' + msg);
      })
      casper.on( 'page.error', function (msg, trace) {
        this.echo( 'Error: ' + msg, 'ERROR' );
      });
*/

/* Start the scraping */
casper.start(url);

casper.waitForSelector('select[name="category"]').then(function(){
  casper.each(fishArray, function(self, currentFish, i){
    /*
    * .evaluate is not async, so it must be wrapped in a .then
    * .then is STEP Async, they're executed one after the other
    */
    casper.then(function(){
      console.log("Getting: " + currentFish);
      // Change the drop down selections
     casper.evaluate(function(currentFish) {
         $('select[name="category"]').val(currentFish).change();
         $('select[name="DAYS"]').val('1').change();
      },currentFish);
    });

    casper.thenClick("input[value='Submit']");
    /* Wait for the .bluebg class to load on the page */
    casper.waitForSelector(".bluebg", function(){
      /* Get the data from the HTML*/
      var tableData = grab.grabTable(this);
          //utils.dump(tableData);
          //console.log(tableData);

      /* Format the data string into JSON*/
      var formattedJSON = tableToJSON.format(tableData);
      /* Sort for only the sold items */
      var soldJSON = sold.getSoldItems(formattedJSON);

      var stats = {};

      stats.avg = getAvg.getAvg(soldJSON);
      stats.stdDev = getStdDev.getStdDev(soldJSON, stats.avg);
      stats.salesVolume = getSalesVolume.getSalesVolume(soldJSON);
      console.log(JSON.stringify(stats));

      console.log("Finished: " + currentFish + ": "+(i+1)+"/"+(fishArray.length) );

      /*
      * Add the currentFish as a property to allFish
      * Its value is the soldJSON
      */
      //allFish.sold[currentFish] = soldJSON;
      //console.log(JSON.stringify(formattedJSON));
      var timestamp = Date.now()
      allFish.allAuctions[currentFish] = formattedJSON;
      allFish.stats[currentFish] = stats;
      allFish.stats.timestamp = timestamp;
    });
  });
});

/* Talking to Firebase */
casper.then(function(){
      console.log("Sending to Firebase...");
        /* POST to Firebase */
        // Open the url for the database, include a new path for the date
        casper.thenOpen("https://aquascraper-data.firebaseio.com/"+firebaseMonthPath+"/"+dayScrapedUrl+".json?auth="+deets+"&debug=true",{
          method: "post",
          data: JSON.stringify(allFish),
          contentType : 'application/json',
          dataType: 'json',
        },function(response){
          casper.echo("POSTED Daily fish data to Firebase");
          casper.echo(JSON.stringify(response));
        });

        // Add the newest days stats
        casper.thenOpen("https://aquascraper-data.firebaseio.com/stats/"+firebaseMonthPath+"-"+dayScrapedUrl+".json?auth="+deets+"&debug=true",{
          method: "put",
          data: JSON.stringify(allFish.stats),
          contentType : 'application/json',
          dataType: 'json',
        },function(response){
          casper.echo("POSTED Daily stats to Firebase");
          casper.echo(JSON.stringify(response));
        });

/*
        // Check for number of stat days
        casper.thenOpen('https://aquascraper-data.firebaseio.com/stats.json?orderBy="timestamp"&limitToLast=30').then(function(){
          casper.echo("GET stats from Firebase");
          var thirtDayStatsJSON = JSON.parse(this.getPageContent());
          var dayNames = Object.keys(thirtDayStatsJSON);
          var numOfDays = dayNames.length;
          casper.echo("Number of Days with stats: "+ numOfDays); 
          console.log(JSON.stringify(thirtDayStatsJSON))


          // If there's more than 30 days worth of stats, delete the last day.
           if(numOfDays>30){
              casper.thenOpen("https://aquascraper-data.firebaseio.com/stats/"+dayNames[0]+".json?auth="+deets+"&debug=true",{
                method: "delete",
                contentType : 'application/json',
                dataType: 'json',
              },function(response){
                casper.echo("Deleted 31st day ago stat on Firebase");
                casper.echo(JSON.stringify(response));
              });
           }
*/
        });



// Start the casper suite, when finished, call terminate
casper.run(terminate);

/* Function Definitions*/
function terminate (){
  this.echo("Exiting...").exit();
}


/* Writing to file
// Write the data as array
fs.write(pathToFolder+arrPath+fish+".js", JSON.stringify(tableData, null, 4), 'w')
// write json of all closed auctions
fs.write(pathToFolder+jsonPath+fish+outputFormat, JSON.stringify(formattedJSON, null, 4), 'w')
// write json sold items only
fs.write(pathToFolder+soldPath+fish+outputFormat, JSON.stringify(soldJSON, null, 4), 'w')
console.log("Data written: "+fish);
*/