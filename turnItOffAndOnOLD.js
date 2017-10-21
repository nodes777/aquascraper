var system = require('system');
var currentFish = system.env.currentFish;
/* Casperjs Script */
var fs = require("fs");
//var utils = require('utils'); // native module, for debuggin
//var fishArray = JSON.parse( fs.read("./input/fishArray.js") );

/* Utility Functions */
var tableToJSON = require('./utils/tableToJSON');
var grab = require('./utils/grabTable');
var sold = require('./utils/getSoldItems');
//var deets = require('./deets');

var casper = require('casper').create({
  //verbose: true,
  //logLevel: 'debug',
  /* Inject jquery on the page so I can select easier */
  clientScripts: ["./utils/jquery.min.js"],
  /* Don't load images to save memory */
    pageSettings: {
        loadImages:  false,
        loadPlugins: false,
        clearMemoryCaches: true
    },
    /* Don't load these kinds of files too */
    onResourceRequested : function(R, req, net) {
    var match = req.url.match(/fbexternal-a\.akamaihd\.net\/safe_image|\.pdf|\.mp4|\.png|\.gif|\.avi|\.bmp|\.jpg|\.jpeg|\.swf|\.fla|\.xsd|\.xls|\.doc|\.ppt|\.zip|\.rar|\.7zip|\.gz|\.csv/gim);
    if (match !== null) {
      net.abort();
    }
  },
});

/* Consts */
var url = "http://www.aquabid.com/cgi-bin/auction/closed.cgi";


/* Array to fill and send to Firebase */
var auction = {
  allAuctions: {},
  sold : {}
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

    casper.then(function(){
      //console.log("Getting: " + currentFish);
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

        //console.log("formattedJSON JSON: "+ JSON.stringify(formattedJSON));
      /* Sort for only the sold items */
      var soldJSON = sold.getSoldItems(formattedJSON);
        //console.log("Sold JSON: "+ JSON.stringify(soldJSON));
      //console.log("Grabbed and sorted: " + currentFish );

      /*
      * Add the currentFish as a property to allFish
      * Its value is the soldJSON
      */
      auction.allAuctions = formattedJSON;
      auction.sold = soldJSON;

    });
});

// Start the casper suite, when finished, call terminate
casper.run(terminate);

/* Function Definitions*/
function terminate (){
  system.stdout.write(JSON.stringify(auction));
  //this.echo("Exiting...");
  this.exit();
}