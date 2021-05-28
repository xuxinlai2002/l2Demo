
const { ethers, getChainId} = require('hardhat')
const { providers,Wallet} = require('ethers')
var Tx = require('ethereumjs-tx');

const fs = require('fs')
const path = require('path')
let util = require('ethereumjs-util')

var Web3 = require('web3')
var web3 = new Web3(network.provider)

const main = async () => {


    let accounts = await ethers.getSigners()
  
    //1.read config
    let file = path.resolve(__dirname, '../data/config.json')
    let contentText = fs.readFileSync(file,'utf-8');
    let data = JSON.parse(contentText);
    
    //2.0 load contract
    let chainID = await getChainId();
    let EOP;
    if(chainID == 42){   //kovan 
        let crontractAddress = data["contractAddress"];
        const Factory__EOP = await ethers.getContractFactory('EOP',accounts[0])
        EOP = await Factory__EOP.connect(accounts[0]).attach(crontractAddress);

    }else{              //hardhat
        const Factory__EOP = await ethers.getContractFactory('EOP',accounts[0])
        EOP = await Factory__EOP.connect(accounts[0]).deploy();

        var from = "0x41eA6aD88bbf4E22686386783e7817bB7E82c1ed";
        // var to = "0x46A26B330c0988a58aFF56e2a106F8256Ca89872";
        // var value = 100;
        var value = web3.utils.toWei('0.1', 'ether')
        //console.log(value);
        const privKey = "c03b0a988e2e18794f2f0e881d7ffcd340d583f63c1be078426ae09ddbdec9f5";

        to = EOP.address;
        console.log(EOP.address);

        await getEthBalance(to, "EOP Balance before send: ");
        await sendEth(from,to,value,privKey);
        sleep(1000) //100ms
        // end eth numbers of myAddress
        await getEthBalance(to, "EOP Balance After send: ");
    }

    let publicKeys = [];
    let signatures = [];
    let addresses = [];
    for(var i = 0 ;i < data["signs"].length; i++){
        publicKeys.push(data["signs"][i]["publicKey"]);
        signatures.push(data["signs"][i]["signature"]);
        addresses.push(data["signs"][i]["address"]);
    }
    
    to = "0xebE2F80dFc5Eb9b84693089BC483064dca6F40c6";
    let tos = [];
    let values = [];
    let txSize = data["txSize"];
    for(var i = 0 ;i < txSize ;i ++){
        tos.push(to);
        values.push(1);
    }

    console.log("withDraw count is : " + txSize);
    await getEthBalance(to, "Balance before send: ");
    let txData = await EOP.withDraw(
        tos,
        values,
        data["msg"],
        signatures,
        addresses
    );

    console.log(txData.hash);

    sleep(3000) //100ms
    await getEthBalance(to, "Balance After send: ");



}

async function sendEth(from,to,value,privateKey){

    // get the nonce
    var nonceCnt = await web3.eth.getTransactionCount(from);
    const bufPrivKey = new Buffer.from(privateKey, 'hex'); 
    await signTransaction(from,to,value,nonceCnt, bufPrivKey)

}

//---------------//
async function signTransaction(fromAddress,toAddress,contractObj,sendNum,nonceNum, privKey) {

    var serializedTx = getEthRawTx(fromAddress,toAddress,contractObj,sendNum,nonceNum, privKey)

    // Comment out these three lines if you don't really want to send the TX right now
    // console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
    var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    // console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
}


function getEthRawTx(fromAddress,toAddress,sendNum,nonceNum, privKey) {
    //raw Tx
    var rawTransaction = {
        "from": fromAddress,
        "nonce": web3.utils.toHex(nonceNum),
        "gasLimit": web3.utils.toHex(8000000),
        "gasPrice": web3.utils.toHex(10e9),
        "to": toAddress,
        "value": web3.utils.toHex(sendNum),
        "data": '',
    };

    var tx = new Tx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    return serializedTx;
}

function sleep(delay) {
    return new Promise(reslove => {
      setTimeout(reslove, delay)
    })
}

function getEthBalance(fromAddress, bookmark) {
    web3.eth.getBalance(fromAddress).then(
        function (wei) {
            // balance = web3.utils.fromWei(wei, 'ether')
            // console.log(bookmark + balance);
            console.log(bookmark + wei);
    });
}


main();