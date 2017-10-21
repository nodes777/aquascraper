var require = patchRequire(require);

exports.grabTable = function(page){

	var allClosedTable = page.evaluate(function(){
	    // The fish table is the 4th table on the page
	    var table = document.querySelectorAll('table')[3];
	    var trs = table.querySelectorAll("tr");

	    var trTextArray = Array.prototype.map.call(trs, function(t) { return t.innerText; });

	    return trTextArray;
	});
	return allClosedTable;
};