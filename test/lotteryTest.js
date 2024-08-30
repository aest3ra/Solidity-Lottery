const Lottery = artifacts.require("Lottery");
const assertRevert = require('./asserRevert');


contract('Lottery', function([deployer, user1, user2]){

    let betAmountBN = new web3.utils.BN('5000000000000000');

    beforeEach(async () => {
        lottery = await Lottery.new();
    })


    describe('Test', function () {
        it('test', async () => {
            console.log(123)
        })
    })
});