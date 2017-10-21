var require = patchRequire(require);

exports.getSoldItems = function(arrOfObjs){
		var soldItems = arrOfObjs.filter(function(fishSale){
			return fishSale.reserveMet === "Yes";
		});
	return soldItems;
}