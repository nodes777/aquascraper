var require = patchRequire(require);

exports.format = function(tableDataArray){
   var entries = [];

   format(tableDataArray);

	function format(tableDataArray){
		    // skip "Close\nItem\nSeller\nHigh Bidder\nBid Price\nReserve Met?\n",
		for(var i = 1; i<tableDataArray.length; i++){
			//convert \n to v*^%, then split on *^%
			var tmpArr = tableDataArray[i].replace( /\n/g, "v*^%" ).split( "v*^%" );
			//console.log("tmpArr "+tmpArr);
			var entry = new AuctionEntry(tmpArr[0], tmpArr[1], tmpArr[2], tmpArr[3], tmpArr[4], tmpArr[5]);
			entries.push(entry);
		}
	}

	function AuctionEntry(date, item, seller, hBidder, bPrice, reserveMet){
		this.date = date;
		this.item = item;
		this.seller = seller;
		this.highBidder = hBidder;
		this.bPrice = bPrice;
		this.reserveMet = reserveMet;
	}
	return entries;
};

/*
var dump =[
    "Close\nItem\nSeller\nHigh Bidder\nBid Price\nReserve Met?\n",
    "7/22\n2 nice pair flame gouramis, picture shows sample!\n90125\nNone\n---\nNo Bids\n",
    "7/22\nBreeding group (5) Albino Paradise\n90125\nLambertplusa\n$25.00\nYes\n",
    "7/22\n2 breeding pair sunset gouramis\n90125\nNone\n---\nNo Bids\n",
    "7/22\n2 pair of neon blue dwarf gouramis, acutal batch!!\n90125\nNone\n---\nNo Bids\n",
    "7/22\nBreeding group (5) Albino Paradise\n90125\nJcp\n$25.00\nYes\n",
    "7/31\nBreeding group (5) Albino Paradise\n90125\nNone\n---\nNo Bids\n",
    "7/31\n2 pair of neon blue dwarf gouramis, acutal batch!!\n90125\nNone\n---\nNo Bids\n",
    "7/31\n2 breeding pair sunset gouramis\n90125\nNone\n---\nNo Bids\n",
    "7/31\n2 nice pair flame gouramis, picture shows sample!\n90125\nNone\n---\nNo Bids\n",
    "8/1\nSix gorgeous male Dwarf Gouramis\nZiggys\nNone\n---\nNo Bids\n",
    "8/1\nSix Adorable Honey Gouramis - Mixed Sex!\nZiggys\nNone\n---\nNo Bids\n",
    "8/5\nFLAMING FIRE GOURAMI PAIR. NEW PICTUTES. FREE SHIP\nYusra111\nJerryl\n$15.75\nYes\n",
    "8/8\nBreeding group (5) Albino Paradise\n90125\nYusra111\n$25.00\nYes\n",
    "8/8\n2 breeding pair sunset gouramis\n90125\nNone\n---\nNo Bids\n",
    "8/8\n2 pair of neon blue dwarf gouramis, acutal batch!!\n90125\nMikey\n$25.00\nYes\n",
    "8/10\nSix Adorable Honey Gouramis - Mixed Sex!\nZiggys\nFishlass\n$12.00\nYes\n",
    "8/11\nSix Precious Fire Honey Gourami - Mixed Sexes!\nZiggys\nNone\n---\nNoBids\n",
    "8/20\n6 Powder Blue Gourami T. lalius TR 1.25'' FEMALE\nWetspot\nKid437\n$30.00\nYes\n",
    "8/21\n6 Red Flame Dwarf Gourami T. lalius MALE TR 2''\nWetspot\nKid437\n$36.00\nYes\n"
];
*/