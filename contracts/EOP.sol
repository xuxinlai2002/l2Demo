// SPDX-License-Identifier: MIT
pragma solidity >0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

/**
 * @title ERC20
 * @dev A super simple ERC20 implementation!
 */
contract EOP {

    /**********
     * Events *
     **********/

    /*************
     * Variables *
     *************/
     address public owner;
     bytes[] pubKeyList;


    /***************
     * Constructor *
     ***************/
    constructor() payable {
        owner = msg.sender;
    }

    /********************
     * Public Functions *
     ********************/
    /**
     * @param _pubKeyList Abiter List
     */
    function setAbiterList(
        bytes[] memory _pubKeyList,
        bytes32 hash, 
        bytes[] memory sig,
        address[] memory signer
    )
        external{

        bool ret = _verifyAbt(hash,sig,signer);
        require(ret, "verify failed");
        pubKeyList = _pubKeyList;
    }

    function getAbiterList()
        external view returns(bytes[] memory){

       return pubKeyList;

    }


    function withDraw(     
        address[] memory to,
        uint256[] memory value,
        bytes32 hash, 
        bytes[] memory sig,
        address[] memory signer
    )
        external{


        bool ret = _verifyAbt(hash,sig,signer);
        require(ret, "verify failed");

        uint256 txSize = to.length;
        uint256 i = 0;
        for(i = 0 ;i < txSize ;i ++){
            _safeTransferETH(to[i],value[i]);
        }
    }

    /**
    * @dev verify Signature
    * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
    * @param signature bytes signature, the signature is generated using web3.eth.sign(). Inclusive "0x..."
    * @param signer signer address
    */ 
    function _verifySignature(bytes32 hash, bytes memory signature, address signer) internal pure returns (bool) {
        address addressFromSig = _recoverSigner(hash, signature);
        return addressFromSig == signer;
    }

    /**
    * @dev Recover signer address from a message by using their signature
    * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
    * @param sig bytes signature, the signature is generated using web3.eth.sign(). Inclusive "0x..."
    */
    function _recoverSigner(bytes32 hash, bytes memory sig) internal pure returns (address) {
        require(sig.length == 65, "Require correct length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        // Divide the signature in r, s and v variables
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "Signature version not match");

        return _recoverSigner2(hash, v, r, s);
    }

    function _recoverSigner2(bytes32 h, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, h));
        address addr = ecrecover(prefixedHash, v, r, s);

        return addr;
    }

    function _verifyAbt(
        bytes32 hash, 
        bytes[] memory sig,
        address[] memory signer
    ) pure internal returns (bool){

        uint8 i = 0;
        uint8 verifiedNum = 0;
        bool isVerified = false;
       
        for(i = 0; i < 32; i++) {

            isVerified = _verifySignature(hash,sig[i],signer[i]);
            if(isVerified){
                verifiedNum ++ ;
            }
            if(verifiedNum >= 25){
                return true;
            }
        }
        return false;
    }


    function sendViaTransfer(
        address _to,
        uint256 _amount
    )
        external
    {
        _safeTransferETH(_to, _amount);
    }


    /**
     * @dev Internal accounting function for moving around L1 ETH.
     *
     * @param _to L1 address to transfer ETH to
     * @param _value Amount of ETH to send to
     */
    function _safeTransferETH(
        address _to,
        uint256 _value
    )
        internal
    {
        (bool success, ) = _to.call{value: _value}(new bytes(0));
        // console.log(success);
        require(success, 'TransferHelper::safeTransferETH: ETH transfer failed');
    }


    receive()
        external
        payable
    {
    }



}