
const { ethers, getChainId} = require('hardhat')
const { providers,Wallet} = require('ethers')

const fs = require('fs')
const path = require('path')
let util = require('ethereumjs-util')



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
    }


    let publicKeys = [];
    let signatures = [];
    let addresses = [];
    for(var i = 0 ;i < data["signs"].length; i++){
        publicKeys.push(data["signs"][i]["publicKey"]);
        signatures.push(data["signs"][i]["signature"]);
        addresses.push(data["signs"][i]["address"]);
    }
    
    let txData = await EOP.setAbiterList(
        publicKeys,
        data["msg"],
        signatures,
        addresses
    );

    console.log(txData.hash);

    if(chainID != 42){ 

        let publickKeys = await EOP.getAbiterList()
        for(var i = 0 ;i < publickKeys.length ;i ++){
            console.log(publickKeys[i]);
        }

    }


}



main();