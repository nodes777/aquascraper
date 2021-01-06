# Aquascraper

Aquascraper scrapes the results of the closed auctions from aquabid.com. It then sends that data to Firebase to be rendered. The visualized data can be viewed at [taylornodell.com](http://taylornodell.com/aquadisplay/). The visualized data repo is [nodes777/aquadisplay](https://github.com/nodes777/aquadisplay). I wrote about the process of making this [on medium](https://medium.com/@Tnodes/all-i-wanted-to-do-is-scrape-in-javascript-c329c8e757e3).

## Installation
Requires:
* [Phantom.js](http://phantomjs.org/)
* [Casperjs](http://casperjs.org/)
* Include Phantom and Casper [in your PATH](https://stackoverflow.com/questions/14894311/installing-casperjs-on-windows-how-to-do-it-correctly)
* To send the data to Firebase, you'll need to replace the deets in deets.js with your own secret code and place that in [your environmental variables](https://kb.wisc.edu/cae/page.php?id=24500). Otherwise you can write the data to disk, with the commented out code in scrape.js. If you're on Heroku, you'll also need to set up an [environmental variable](https://devcenter.heroku.com/articles/config-vars)


## Instructions
### To Scrape:
In a terminal run
`casperjs scrape.js`

Data is currently written to Firebase, code to write to disk is commented out.

### To Grab the Data from Firebase
#### By a Single Day's raw data
Make a JSONP request:

```
$.ajax({
  url: "https://aquascraper-data.firebaseio.com/"+monthAndYear+"/"+day+".json?callback=processJson&print=pretty",
  dataType: "jsonp",
  jsonpCallback: "processJson"
});
```
`monthAndYear` must be formatted like "Nov2017"
`day` must be formatted like "01-Wed"
The earliest available date is Oct2017, 15-Sun.

Returns all closed auctions (sold and unsold) for that day as a JSON object.

#### By Stats Only
Follows [Firebase API rules](https://firebase.google.com/docs/database/rest/retrieve-data) for filtering.
Make a JSONP request:

```
$.ajax({
  url: 'https://aquascraper-data.firebaseio.com/stats.json?orderBy="timestamp"&limitToLast=30',
  dataType: "jsonp",
  jsonpCallback: "processJSON"
});
```

Returns a JSON object of all fish type's market stats; average, standard deviation, and sales volume of each day within the url parameters. This example URL grabs the last 30 days.

## Bugs

* ~~Currently the data being displayed for the closed auctions aquabid, after selecting "view 1 previous day", includes sales that have been sold before their close date. This allows a single sale to remain as a valid data point for multiple days. If serious data analysis is to be done, this must be sorted to only display the data on the day that the sale is made.~~ This was fixed on February 22nd 2018. All previous scrapes have sales from dates around that specific day so they have higher sales volumes. The current set up only scrapes sales if that sale was made on the day of the scrape. This is more accurate to the "sales that were made today".

## To Dos
* Add links to fish closed auction pages

### Note
As of January 2nd 2018, [aquabid's robots.txt](http://www.aquabid.com/robots.txt) only prevents automated browsing on the "/cgi-bin/auction/vfb.cgi" pages. Presumably, this is to avoid automated bid making.
