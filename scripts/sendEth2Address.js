const { ethers, network } = require('hardhat')
const fs = require('fs')
const path = require('path')
const util = require('ethereumjs-util')
var Web3 = require('web3')
var web3 = new Web3(network.provider)

const main = async () => {

    let chainID = await getChainId();
    if(chainID != 42){
        console.log("do not work in kovan env!");
    }

    let accounts = await ethers.getSigners()

    web3.eth.sendTransaction({
        from: accounts[0].address,
        to: "0x46A26B330c0988a58aFF56e2a106F8256Ca89872", 
        value: web3.utils.toWei('0.00001', "ether"), 
    }, function(err, transactionHash) {
        if (err) { 
            console.log(err); 
        } else {
            console.log(transactionHash);
        }
    });


}



main();

