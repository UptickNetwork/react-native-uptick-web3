# uptickChainAppReactNative

React Native uptick web3 SDK 是一款专为 React Native 开发语言打造的 web3 交互工具，其旨在极大地简化用户与您的去中心化应用（Dapp）建立连接的流程，并高效地实现与区块链的交互操作。

借助这一 SDK，开发者能够轻松完成对 NFT 的多项操作，包括但不限于发布合约、创建资产、转移资产等，同时还支持多种创新的销售模式，如常规上架、优惠上架以及货品卡发布等多样化形式，全方位满足不同业务场景需求。不仅如此，通过使用 uptick api 服务[](https://docs.services.uptick.network/5449703m0)，Dapp 的开发过程将得到进一步的优化与简化，该 API 服务提供了从 NFT 创建直至市场销售的全流程完整功能支持，为开发者构建功能丰富、体验卓越的 Dapp 提供了坚实有力的技术支撑，助力其在区块链应用开发领域脱颖而出，快速实现业务价值。

SDK 还集成了便捷的第三方登录功能，支持：

- 邮箱登录：通过邮箱验证码实现安全登录
- Google 登录：支持 Google 账号一键登录
- Apple 登录：支持 iOS 设备使用 Apple ID 快速登录

在使用第三方登录功能前，开发者需要先在 [Web3Auth 官网](https://web3auth.io/),这些配置完成后，才能正常使用 SDK 中的第三方登录功能。

## 安装 SDK

To install with Yarn, run:

```
yarn add @uptickjs/react-native-uptick-web3
```

To install with NPM, run:

```
npm install @uptickjs/react-native-uptick-web3
```

## web3 初始化

在使用 WEB3 发送交易前执行

```
import {utils, getWeb3Instance} from './web3Util';
const web3 = getWeb3Instance();

```

初始化 web3 方法

```
const web3 = new Web3('https://json-rpc.uptick.network');

export const getWeb3Instance = () => {
  return web3;
};

export const setProvider = (provider: string) => {
  web3.setProvider(provider);
};

```

## 方法介绍

创建钱包

```
import * as bip39 from 'bip39';
import {
  importWallet,
} from '@xyyz1207/react-native-uptick-web3/src/web3Util';

  let mnemonic = bip39.generateMnemonic();
  const wallet = importWallet(mnemonic);
```

导入钱包

```
import * as bip39 from 'bip39';
import {
  validateMnemonic,
  importWallet,
} from '@xyyz1207/react-native-uptick-web3/src/web3Util';

// Import wallet with mnemonic
      if (validateMnemonic(mnemonic.trimStart().trimEnd())) {
     const wallet = importWallet(mnemonic);
      }
// Import wallet with privatekey
	 const wallet = importWallet(privatekey);
```

第三方登录初始化

```
import {
  initWeb3Auth,
  GoogleLogin,
  EmailLogin,
  AppleLogin,
} from '@xyyz1207/react-native-uptick-web3/src/web3Util';

// init web3AuthObj
 let web3AuthObj = initWeb3Auth(
      resolvedRedirectUrl,
      clientId,
      appName,
      logoLight,
      logoDark,
    );
```

|       Params        | Parameter type |   Parameter description    |
| :-----------------: | :------------: | :------------------------: |
| resolvedRedirectUrl |     String     | 配置允许的域名和重定向地址 |
|      clientId       |     String     |       项目 clientId        |
|       appName       |     String     |          App 包名          |
|      logoLight      |     String     |    light 模式项目 logo     |
|      logoDark       |     String     |     dark 模式项目 logo     |

邮箱登录

```
EmailLogin(email)
```

| Params | Parameter type | Parameter description |
| :----: | :------------: | :-------------------: |
| email  |     String     |       邮箱地址        |

返回结果
Params | Parameter type | Parameter description
:---: | :---: | :---:
privateKey | String | 钱包地址私钥
userInfo | Object | 用户基础信息

Google 登录

```
GoogleLogin()
```

返回结果
Params | Parameter type | Parameter description
:---: | :---: | :---:
privateKey | String | 钱包地址私钥
userInfo | Object | 用户基础信息

Apple 登录

```
AppleLogin()
```

返回结果
Params | Parameter type | Parameter description
:---: | :---: | :---:
privateKey | String | 钱包地址私钥
userInfo | Object | 用户基础信息

Evm 地址 Uptick 地址相互转换

```
uptickAddress2EVM(address)

evmAddress2UptickAddress(address)
```

| Params  | Parameter type | Parameter description |
| :-----: | :------------: | :-------------------: |
| address |     String     |       用户地址        |

获取余额

```
 getBalance = (
  address: string,
  rpcUrl: string,
)
```

| Params  | Parameter type | Parameter description |
| :-----: | :------------: | :-------------------: |
| address |     String     |       用户地址        |
| rpcUrl  |     String     |      JsonRpcURL       |

创建合约

```
deploy()

```

|     Params      | Parameter type | Require |       Parameter description        |
| :-------------: | :------------: | :-----: | :--------------------------------: |
|     nftType     |     String     |  true   |              nft 类型              |
|   privateKey    |     String     |  true   |             privateKey             |
|    gasPrice     |     Number     |  true   |              gasPrice              |
|      name       |     String     |  true   |              合约名字              |
|   metadataUrl   |     String     |  false  |           metadata 信息            |
| lazySignAddress |     String     |  false  | 签名地址，用于 mint 资产时验证签名 |

创建资产

```
mintNft()
```

|      Params       | Parameter type |   Require    | Parameter description |
| :---------------: | :------------: | :----------: | :-------------------: |
|      nftType      |     String     |     true     |       nft 类型        |
|     toAddress     |     String     |     true     |       接收地址        |
|    nftAddress     |     String     | nft 合约地址 |
|       nftId       |     String     |     true     |         nftId         |
|    metaDataUrl    |     String     |     true     |     metadata 信息     |
| royaltyPercentage |     String     |     true     |       分成比例        |
|    amountValue    |     Number     |    false     |         数量          |

资产转送

```
NftTransfer()
```

|   Params   | Parameter type | Parameter description |
| :--------: | :------------: | :-------------------: |
|    from    |     String     |       转出类型        |
|     to     |     String     |       接收地址        |
|   nftId    |     String     |         nftId         |
| nftAddress |     String     |     nft 合约地址      |
|  nftType   |     String     |       nft 类型        |
|   amount   |     Number     |       转送数量        |

资产普通销售上架

```
nftOnsale()

```

|      Params      | Parameter type | Parameter description |
| :--------------: | :------------: | :-------------------: |
|    nftAddress    |     String     |     nft 合约地址      |
|      nftid       |     String     |         nftid         |
|      price       |     Array      |       上架价格        |
|   tokenAddress   |     Array      |   上架币种合约地址    |
|      amount      |     string     |       上架数量        |
| plateFromAddress |     string     |     销售合约地址      |
|     nftType      |     String     |       nft 类型        |
|   nftTokenIds    |     String     |      多个 NFTid       |

资产优惠销售上架

```
couponOnSale()

```

|      Params      | Parameter type | Parameter description |
| :--------------: | :------------: | :-------------------: |
|    nftAddress    |     String     |     nft 合约地址      |
|      nftid       |     String     |         nftid         |
|      price       |     String     |       上架价格        |
|   tokenAddress   |     String     |   上架币种合约地址    |
|      amount      |     Number     |       上架数量        |
| plateFromAddress |     string     |     销售合约地址      |
|     nftType      |     String     |       nft 类型        |
|    couponCode    |     String     |        优惠码         |
|   reducedPrice   |     Number     |       优惠价格        |

资产拍卖上架

```
createAuction()
```

|     Params     | Parameter type | Parameter description |
| :------------: | :------------: | :-------------------: |
|    nftType     |     String     |       nft 类型        |
|   nftAddress   |     String     |     nft 合约地址      |
|     nftid      |     String     |         nftid         |
| startTimeStamp |     String     |     拍卖开始时间      |
|  endTimeStamp  |     String     |     拍卖结束时间      |
|    startBid    |     String     |        起拍价         |
|    fixPrice    |     String     |        一口价         |
|   ReserveBid   |     String     |        保底价         |
|      fee       |     Number     |        手续费         |
|     amount     |     Number     |       上架数量        |
|   payAddress   |     String     |   上架币种合约地址    |

拍卖竞价

```
auction_placeBid()
```

|    Params     | Parameter type | Parameter description |
| :-----------: | :------------: | :-------------------: |
|    nftType    |     String     |       nft 类型        |
|  nftAddress   |     String     |     nft 合约地址      |
|     nftid     |     String     |         nftid         |
|   fixPrice    |     Number     |       竞拍价格        |
|  payAddress   |     String     |   支付币种合约地址    |
|     owner     |     String     |      售卖者地址       |
|  fromAddress  |     String     |      竞拍者地址       |
| marketAddress |     String     |     销售合约地址      |

资产下架

```
offSale()
```

|      Params      | Parameter type | Parameter description |
| :--------------: | :------------: | :-------------------: |
|    nftAddress    |     String     |     nft 合约地址      |
|      nftid       |     String     |         nftid         |
|      seller      |     String     |        seller         |
| plateFromAddress |     String     |   plateFromAddress    |
|     nftType      |     String     |       nft 类型        |
|   nftTokenIds    |     String     |      nftId 列表       |

拍卖撤回

```
auction_end()
```

|   Params   | Parameter type |    Parameter description     |
| :--------: | :------------: | :--------------------------: |
|  nftType   |     String     |           nft 类型           |
| nftAddress |     String     |         nft 合约地址         |
|   nftid    |     String     |            nftid             |
|   owner    |     String     | ERC1155 类型，需要上架者地址 |

购买资产

```
NftPayOrder()
```

|   Params   | Parameter type |  Parameter description  |
| :--------: | :------------: | :---------------------: |
|  nftType   |     String     |        nft 类型         |
| nftAddress |     String     |      nft 合约地址       |
|   nftid    |     String     |          nftid          |
| toAddress  |     String     |       购买者地址        |
|   price    |     Number     |        购买价格         |
| marketType |     String     |        购买类型         |
| couponCode |     String     |   优惠码，没有就填‘0’   |
| couponLink |     String     | couponLink，没有就填‘0’ |
| payAddress |     String     |    支付币种合约地址     |

出价

```
createOffer()

```

|      Params      | Parameter type | Parameter description |
| :--------------: | :------------: | :-------------------: |
| plateFromAddress |     String     |   plateFromAddress    |
|     nftType      |     String     |       nft 类型        |
|   offerNumber    |     String     |   出价号码(随机数)    |
|    nftAddress    |     String     |     nft 合约地址      |
|      nftid       |     String     |         nftid         |
|    payAddress    |     String     |   支付币种合约地址    |
|    payAmount     |     Number     |       出价金额        |
|      expiry      |     String     |      出价有效期       |

取消出价

```
cancelOffer()

```

|      Params      | Parameter type | Parameter description |
| :--------------: | :------------: | :-------------------: |
| plateFromAddress |     String     |   plateFromAddress    |
|     nftType      |     String     |       nft 类型        |
|   offerNumber    |     String     |   出价号码(随机数)    |

接受出价

```
acceptOffer()
 platformAddress,
  nftType,
  offerNumber,
  nftAddress,
  tokenId,
```

|      Params      | Parameter type | Parameter description |
| :--------------: | :------------: | :-------------------: |
| plateFromAddress |     String     |     出价合约地址      |
|     nftType      |     String     |       nft 类型        |
|   offerNumber    |     String     |   出价号码(随机数)    |
|    nftAddress    |     String     |     nft 合约地址      |
|      nftid       |     String     |         nftid         |

查询跨链手续费

```
getFeeByChainID()
```

|  Params  | Parameter type | Parameter description |
| :------: | :------------: | :-------------------: |
| tokenIds |     Array      |        tokenid        |
| chainId  |     Number     |      链 chainid       |

资产跨链，支持 Uptick\Polygon\Arbitrum\BSC

```
uptickToEVM()

```

|      Params      | Parameter type | Parameter description |
| :--------------: | :------------: | :-------------------: |
|    tochainId     |     Number     |    目标链 chainid     |
|    toAddress     |     String     |       接受地址        |
|     metadate     |     String     |     metadate 信息     |
| plateFromAddress |     String     |     跨链合约地址      |

## example

## issues 报告

https://github.com/UptickNetwork/react-native-uptick-web3/issues
