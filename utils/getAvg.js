var require = patchRequire(require);

exports.getAvg = function(soldJSON){
	var pricesArray = soldJSON.map(function(d){ return currencyToNumber(d.bPrice);});
  	var total = pricesArray.reduce(function(accumulator, currentValue){
   		var sum = accumulator + currentValue;
   		return  sum;
  	}, 0);
  	var avg = total/pricesArray.length;
  	avg = checkNaN(avg);
  	return Math.round(avg);
};

function checkNaN (x){
	if(isNaN(x)) {
		return 0;
	} else {
		return x;
	}
}

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
