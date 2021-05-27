
const { ethers, getChainId} = require('hardhat')
const { providers,Wallet} = require('ethers')

const fs = require('fs')
const path = require('path')
let util = require('ethereumjs-util')


const main = async () => {

    let chainID = await getChainId();
    if(chainID != 42){
        console.log("do not work in kovan env!");
    }

    let accounts = await ethers.getSigners()
  
    //1.read config
    let file = path.resolve(__dirname, '../data/config.json')
    let contentText = fs.readFileSync(file,'utf-8');
    let data = JSON.parse(contentText);
    
    //2.0 load contract
    let EOP;
    let crontractAddress = data["contractAddress"];
    const Factory__EOP = await ethers.getContractFactory('EOP',accounts[0])
    EOP = await Factory__EOP.connect(accounts[0]).attach(crontractAddress);

    let publickKeys = await EOP.getAbiterList()
    for(var i = 0 ;i < publickKeys.length ;i ++){
        console.log(publickKeys[i]);
    }


}



main();