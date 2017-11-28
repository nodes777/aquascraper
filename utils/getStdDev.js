var require = patchRequire(require);

exports.getStdDev= function(soldJSON, avg){
  var pricesArray = soldJSON.map(function(d){ return currencyToNumber(d.bPrice);});

  var squareDiffs = pricesArray.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.round(checkNaN(Math.sqrt(avgSquareDiff)));

  return stdDev;
};

function currencyToNumber(bPrice) {
	if(typeof bPrice === "number") {
		return bPrice;
	}
  	if(typeof bPrice === "undefined") {
    	return 0;
  	}
	var currency = bPrice;
  // bPrice comes as a string with dollar sign, remove with regex
  var number = Number(currency.replace(/[^0-9\.-]+/g,""));

  return number;
}

function average(data) {
var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}

function checkNaN (x){
	if(isNaN(x)) {
		return 0;
	} else {
		return x;
	}
}