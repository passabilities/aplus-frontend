class Escrow {
	constructor(solidityArray) {
		this.buyer = solidityArray[0];
		this.seller = solidityArray[1];
		this.paid = solidityArray[2];
		this.fulfilled = solidityArray[3];
		this.dataHash = solidityArray[4];
		this.buyerPublicKey = solidityArray[5];
	}
}

export default Escrow;