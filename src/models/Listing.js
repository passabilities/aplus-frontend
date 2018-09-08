class Listing {
	constructor(solidityArray, dataHash, escrow) {
		this.price = solidityArray[0].toNumber();
		this.owner = solidityArray[1];
		this.dataHash = dataHash;
		this.bigNumberPrice = solidityArray[0];
		this.escrow = escrow;
	}
}

export default Listing;