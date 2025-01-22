# uptickChainAppReactNative


The React Native uptick web3 SDK is a web3 interaction tool specifically designed for the React Native programming language. It aims to greatly simplify the process for users to connect to your decentralized application (Dapp) and efficiently perform interaction operations with the blockchain.

With the help of this SDK, developers can easily complete multiple operations on NFTs, including but not limited to publishing contracts, creating assets, and transferring assets. Meanwhile, it also supports various innovative sales models, such as regular listing, preferential listing, and product card release, etc., fully meeting the needs of different business scenarios. Moreover, by using the uptick API service [](https://docs.services.uptick.network/5449703m0), the development process of Dapps will be further optimized and simplified. This API service provides complete functionality support for the whole process from NFT creation to marketplace sales, offering solid and powerful technical support for developers to build Dapps with rich features and excellent user experience, helping them stand out in the field of blockchain application development and quickly realize business value.

The SDK also integrates convenient third-party login features that support:

Email login: Use email verification code to securely log in
Google Sign-in: Support one-click login with Google account
Apple Login: Support iOS devices to quickly sign in with Apple ID

Before using the third-party login function, developers need to go to the Web3Auth official website before they can use the third-party login function in the SDK normally.


## Installation of the SDK

To install with Yarn, run:
```
yarn add @uptickjs/react-native-uptick-web3
```
To install with NPM, run:
```
npm install @uptickjs/react-native-uptick-web3
```

## Initialization of web3

Execute this before sending transactions using WEB3.

```
import {utils, getWeb3Instance} from './web3Util';
const web3 = getWeb3Instance();

```

The method for initializing web3:

```
const web3 = new Web3('https://json-rpc.uptick.network');

export const getWeb3Instance = () => {
  return web3;
};

export const setProvider = (provider: string) => {
  web3.setProvider(provider);
};

```


## Introduction to Methods

Create a Wallet
```
import * as bip39 from 'bip39';
import {
  importWallet,
} from '@uptickjs/react-native-uptick-web3/src/web3Util';

  let mnemonic = bip39.generateMnemonic();
  const wallet = importWallet(mnemonic);
```
Import a Wallet
```
import * as bip39 from 'bip39';
import {
  validateMnemonic,
  importWallet,
} from '@uptickjs/react-native-uptick-web3/src/web3Util';

// Import wallet with mnemonic
      if (validateMnemonic(mnemonic.trimStart().trimEnd())) {
     const wallet = importWallet(mnemonic);
      }
// Import wallet with privatekey	  
	 const wallet = importWallet(privatekey);  
```
Third-party login initialization
```
import {
  initWeb3Auth,
  GoogleLogin,
  EmailLogin,
  AppleLogin,
} from '@uptickjs/react-native-uptick-web3/src/web3Util';

// init web3AuthObj
 let web3AuthObj = initWeb3Auth(
      resolvedRedirectUrl,
      clientId,
      appName,
      logoLight,
      logoDark,
    );
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---:
resolvedRedirectUrl  | String | schema
clientId  | String | web3auth clientId
appName  | String | App Package Name
logoLight  | String | light logo
logoDark  | String | dark logo

Email login
```
EmailLogin(email)
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---:
email  | String | Email

Returns results
Params     |  Parameter type  | Parameter description
:---: | :---: | :---:
privateKey  | String | Wallet Private Key
userInfo  | Object | User information

Google login
```
GoogleLogin()
```
Returns results
Params     |  Parameter type  | Parameter description
:---: | :---: | :---:
privateKey  | String | Wallet Private Key
userInfo  | Object | User information

Apple login
```
AppleLogin()
```
Returns results
Params     |  Parameter type  | Parameter description
:---: | :---: | :---:
privateKey  | String | Wallet Private Key
userInfo  | Object | User information



Convert between EVM Address and Uptick Address
```
uptickAddress2EVM(address)

evmAddress2UptickAddress(address)
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---:
address  | String | Address

Get Balance
```
 getBalance = (
  address: string,
  rpcUrl: string,
)
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---:
address  | String | Address
rpcUrl  | String | JsonRpcURL

Create a Contract
```
deploy()
  
```
Params     |  Parameter type     |  Require  | Parameter description
:---: | :---: | :---: | :---:
nftType  | String | true| nft type
privateKey  | String | true| privateKey
gasPrice  | Number | true| gasPrice
name  | String | true | contract name
metadataUrl  | String | false | Metadata information
lazySignAddress  | String | false | signature address, used to verify signature when minting assets

Create Assets

```
mintNft()
```
Params     |  Parameter type     |  Require  | Parameter description
:---: | :---: | :---: | :---:
nftType  | String | true| nft type
toAddress  | String | true | Receiving address
nftAddress  | String | true | nft contract address
nftId  | String | true | nftId
metaDataUrl  | String | true | Metadata information
royaltyPercentage  | String | true | Share ratio
amountValue  | Number | false | amount

Transfer Assets

```
NftTransfer()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
from  | String | Transfer out address
to  | String | Receiving address
nftId  | String | nftId
nftAddress  | String | nft contract address
nftType  | String | nft type
amount  | Number  | amount

Regular Sales Listing of Assets
```
nftOnsale()

```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftAddress  | String | nft contract address
nftid  | String | nftid
price  | Array | Listing price
tokenAddress  | Array  | The token contract address for selling your NFT
amount  | string  | listing quantity
plateFromAddress  | string  | Bidder address
nftType  | String | nft type
nftTokenIds  | String | Multiple nftIDs

Preferential Sales Listing of Assets

```
couponOnSale()

```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftAddress  | String | nft contract address
nftid  | String | nftid
price  | String | Listing price
tokenAddress  | String  | The token contract address for selling your NFT
amount  | Number  | listing quantity
plateFromAddress  | string  | Bidder address
nftType  | String | nft type
couponCode  | String | Discount code
reducedPrice | Number | Discount price


Auction Listing of Assets

```
createAuction()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft type
nftAddress  | String | nft contract address
nftid  | String | nftid
startTimeStamp  | String | auction start time
endTimeStamp  | String | auction end time
startBid  | String | starting price
fixPrice  | String | fixed price
ReserveBid  | String | reserve price
fee  | Number | handling fee
amount  | Number  | listing quantity
payAddress  | String  | The token contract address for selling your NFT








Auction Bidding

```
auction_placeBid()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft type
nftAddress  | String | nft contract address
nftid  | String | nftid
fixPrice  | Number | Bidding price
payAddress  | String  | The token contract address for bidding
owner  | String  | owner address
fromAddress  | String  | Bidder address
marketAddress  | String  | plateFrom address





Remove Assets from Listing

```
offSale()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftAddress  | String | nft contract address
nftid  | String | nftid
seller  | String | seller
plateFromAddress  | String | plateFromAddress
nftType  | String | nft type
nftTokenIds  | String | nftId list


Withdraw from Auction

```
auction_end()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft type
nftAddress  | String | nft contract address
nftid  | String | nftid
owner  | String  | ERC1155 type, requires the address of the owner

Purchase Assets
```
NftPayOrder()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft type
nftAddress  | String | nft contract address
nftid  | String | nftid
toAddress  | String  | buyer address
price  | Number  | purchase price
marketType  | String  |  purchase type
couponCode  | String  | coupon code, fill in ‘0’ if none
couponLink  | String  | couponLink, fill in ‘0’ if none
payAddress  | String  | The token contract address for purchasing



Place an Offer

```
createOffer()

```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
plateFromAddress  | String | plateFromAddress
nftType  | String | nft type
offerNumber  | String | Offer number (random number)
nftAddress  | String | nft contract address
nftid  | String | nftid
payAddress  | String | The token contract address for bidding
payAmount  | Number | Offer amount
expiry | String | Offer validity period

Cancel an Offer

```
cancelOffer()

```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
plateFromAddress  | String | plateFromAddress
nftType  | String | nft type
offerNumber  | String | offer number (random number)

Accept an Offer

```
acceptOffer()

```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
plateFromAddress  | String | offer contract address
nftType  | String | nft type
offerNumber  | String | offer number (random number)
nftAddress  | String | offer contract address
nftid  | String | nftid


Query Cross-Chain Handling Fees
```
getFeeByChainID()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
tokenIds  | Array | tokenid
chainId  | Number | Target chain id


Cross-Chain Transfer of Assets (supporting Uptick, Polygon, Arbitrum, BSC)
```
uptickToEVM()

```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
tochainId  | Number | Target chain id
toAddress  | String | Receiving address
metadate  | String | Metadate information
plateFromAddress  | String | Offer contract address




## Problem Reporting

https://github.com/UptickNetwork/react-native-uptick-web3/issues
