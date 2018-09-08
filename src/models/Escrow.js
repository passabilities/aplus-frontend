class Escrow {
	constructor(solidityArray) {
		this.buyer = solidityArray[0];
		this.seller = solidityArray[1];
		this.paid = solidityArray[2];
		this.fulfilled = solidityArray[3];
		this.tokensClaimed = solidityArray[4];
		this.dataHash = solidityArray[5];
		this.buyerPublicKey = solidityArray[6];
	}
}

export default Escrow;