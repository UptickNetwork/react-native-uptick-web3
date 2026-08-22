import { ethers } from 'ethers';
import { utils, getWeb3Instance } from './web3Util';
import { abi as ERCCoupon721 } from './abi/ERC721CouponPlatform.json';
import { abi as ERCCoupon1155 } from './abi/ERC1155CouponPlatform.json';
import { abi as ERC20ABI } from './abi/IERC20.json';
import { abi as AllowanceABI } from './abi/Allowance.json';
import { abi as ERC721PlatformABI } from './abi/ERC721Platform.json';
import { abi as ERC1155PlatformABI } from './abi/ERC1155Platform.json';
import { abi as BridgeABI } from './abi/Bridge.json';

import * as erc721Auction from './handler/erc721Auction';
import * as erc1155Auction from './handler/erc1155Auction';
import * as erc721Offer from './handler/erc721Offer';
import * as erc1155Offer from './handler/erc1155Offer';
import * as uptick721 from './handler/erc721';
import * as uptick1155 from './handler/erc1155';
import * as lazyNFT1948 from './handler/lazyNFT1948';
import * as uptick20 from './handler/erc20';

const web3 = getWeb3Instance();

// 6 位小数代币（USDC/USDT 等）地址白名单：这些代币的金额换算使用 'mwei'
const SIX_DECIMAL_TOKENS = [
  '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd',
  '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75',
  '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687',
  '0xeceeefcee421d8062ef8d6b4d814efe4dc898265',
  '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
  '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
];
const isSixDecimalToken = (addr: string) =>
  SIX_DECIMAL_TOKENS.includes((addr || '').toLowerCase());

// address, platformAddress
export async function deploy(
  nftType,
  privateKey,
  gasPrice,
  name,
  metadataUrl,
  lazySignAddress,
) {
  if (nftType == 'ERC721') {
    let result = await uptick721.deploy(
      privateKey,
      gasPrice,
      name,
      metadataUrl,
    );
    return result;
  } else if (nftType == 'ERC1155') {
    let result = await uptick1155.deploy(
      privateKey,
      gasPrice,
      name,
      metadataUrl,
    );
    return result;
  } else if (nftType == 'ERC1948') {
    let result = await lazyNFT1948.deploy(
      privateKey,
      gasPrice,
      name,
      metadataUrl,
      lazySignAddress,
    );
    return result;
  }
}
export async function deployData(nftType, name, metadataUrl, lazySignAddress) {
  if (nftType == 'ERC1155') {
    let result = await uptick1155.deployData(name, metadataUrl);
    return result;
  }
}

export async function erc20Deploy(
  privateKey,
  gasPrice,
  name,
  symbol,
  totalSupply,
  decimals,
) {
  let result = await uptick20.deploy(
    privateKey,
    gasPrice,
    name,
    symbol,
    totalSupply,
    decimals,
  );
  return result;
}

export async function mintNft(
  nftType,
  toAddress,
  nftAddress,
  tokenId,
  baseurl,
  royaltyPercentage,
  amountValue,
) {
  if (nftType == 'ERC721') {
    let transferFrom = await uptick721.mintNft(
      toAddress,
      nftAddress,
      tokenId,
      baseurl,
      royaltyPercentage,
    );

    return transferFrom;
  } else if (nftType == 'ERC1155') {
    let transferFrom = await uptick1155.mintNft(
      toAddress,
      nftAddress,
      tokenId,
      baseurl,
      royaltyPercentage,
      amountValue,
    );

    return transferFrom;
  }
}
export async function auction_placeBid(
  nftType,
  nftAddress,
  nftid,
  fixPrice,
  payAddress,
  owner,
  fromAddress,
  marketAddress,
) {
  try {
    let fee = 0;
    if (isSixDecimalToken(payAddress)) {
      // uptick 测试/生产环境的 IRIS/ATOM 保留 6 位小数，用 'mwei' 换算避免浮点精度丢失
      fixPrice = web3.utils.toWei(String(fixPrice), 'mwei');
    } else {
      fixPrice = web3.utils.toWei(String(fixPrice));
    }

    if (payAddress != '0x0000000000000000000000000000000000000000') {
      fee = 0;
    } else {
      fee = fixPrice;
    }

    if (nftType == 'ERC721' || nftType == 'ERC1948') {
      let result = await erc721Auction.placeBid(
        marketAddress,
        nftAddress,
        nftid,
        fixPrice,
        fee,
        fromAddress,
      );

      return result;
    } else if (nftType == 'ERC1155') {
      let result = await erc1155Auction.placeBid(
        marketAddress,
        nftAddress,
        nftid,
        fixPrice,
        owner,
        fee,
      );

      return result;
    }
  } catch (error) {
    console.error('auction_placeBid', error);
    throw error;
  }
}

// createOffer
export async function createOffer(
  plateFromAddress,
  nftType,
  offerNumber,
  nftAddress,
  tokenId,
  payAddress,
  payAmount,
  expiry,
) {
  if (isSixDecimalToken(payAddress)) {
    // uptick 测试/生产环境的 IRIS/ATOM 保留 6 位小数
    payAmount = web3.utils.toWei(String(payAmount), 'mwei');
  } else {
    payAmount = web3.utils.toWei(String(payAmount));
  }

  if (nftType == 'ERC721' || nftType == 'ERC1948') {
    let result = await erc721Offer.createOffer(
      plateFromAddress,
      offerNumber,
      nftAddress,
      tokenId,
      payAddress,
      payAmount,
      expiry,
    );

    return result;
  } else if (nftType == 'ERC1155') {
    let result = await erc1155Offer.createOffer(
      plateFromAddress,
      offerNumber,
      nftAddress,
      tokenId,
      payAddress,
      payAmount,
      expiry,
    );

    return result;
  }
}

//CancelOffer
export async function cancelOffer(platformAddress, nftType, offerNumber) {
  if (nftType == 'ERC721' || nftType == null || nftType == 'ERC1948') {
    let result = await erc721Offer.cancelOffer(platformAddress, offerNumber);

    return result;
  } else if (nftType == 'ERC1155') {
    let result = await erc1155Offer.cancelOffer(platformAddress, offerNumber);

    return result;
  }
}

//AcceptOffer
export async function acceptOffer(
  platformAddress,
  nftType,
  offerNumber,
  nftAddress,
  tokenId,
) {
  if (nftType == 'ERC721' || nftType == 'ERC1948') {
    let result = await erc721Offer.acceptOffer(
      platformAddress,
      offerNumber,
      nftAddress,
      tokenId,
    );

    return result;
  } else if (nftType == 'ERC1155') {
    let result = await erc1155Offer.acceptOffer(
      platformAddress,
      offerNumber,
      nftAddress,
      tokenId,
    );

    return result;
  }
}

//创建拍卖
export async function createAuction(
  platformAddress,
  nftType,
  nftAddress,
  nftid,
  _amount,
  _auctioneer,
  _startTime,
  _endTime,
  reservePrice,
  buyoutPrice,
  guaranteedPrice,
  tokenAddress,
) {
  let _reservePrice = 0;
  let _buyoutPrice = 0;
  let _guaranteedPrice = 0;

  if (isSixDecimalToken(tokenAddress)) {
    _reservePrice = utils.toWei(reservePrice, 'mwei');
    if (buyoutPrice > 0) {
      _buyoutPrice = utils.toWei(buyoutPrice, 'mwei');
    }
    if (guaranteedPrice > 0) {
      _guaranteedPrice = utils.toWei(guaranteedPrice, 'mwei');
    }
  } else {
    _reservePrice = utils.toWei(reservePrice);
    if (buyoutPrice > 0) {
      _buyoutPrice = utils.toWei(buyoutPrice);
    }
    if (guaranteedPrice > 0) {
      _guaranteedPrice = utils.toWei(guaranteedPrice);
    }
  }

  if (nftType == 'ERC721' || nftType == 'ERC1948') {
    let result = erc721Auction.createAuction(
      platformAddress,
      nftAddress,
      nftid,
      _auctioneer,
      _startTime,
      _endTime,
      _reservePrice,
      _buyoutPrice,
      _guaranteedPrice,
      tokenAddress,
    );
    return result;
  } else if (nftType == 'ERC1155') {
    // 注意：erc1155Auction.createAuction 参数顺序为
    // (nftAddress, nftid, _amount, _auctioneer, _startTime, _endTime,
    //  _reservePrice, _buyoutPrice, _guaranteedPrice, tokenAddress, marketAddress)
    let result = erc1155Auction.createAuction(
      nftAddress,
      nftid,
      _amount,
      _auctioneer,
      _startTime,
      _endTime,
      _reservePrice,
      _buyoutPrice,
      _guaranteedPrice,
      tokenAddress,
      platformAddress,
    );

    return result;
  }
}
//撤回拍卖
export async function endAuction(
  nftType,
  nftAddress,
  nftid,
  _auctioneer,
  plateFromAddress,
) {
  if (nftType == 'ERC721' || nftType == 'ERC1948') {
    let result = await erc721Auction.endAuction(
      nftAddress,
      nftid,
      _auctioneer,
      plateFromAddress,
    );

    return result;
  } else if (nftType == 'ERC1155') {
    let result = await erc1155Auction.endAuction(
      nftAddress,
      nftid,
      _auctioneer,
      plateFromAddress,
    );

    return result;
  }
}

export const getFeeByChainID = (
  chainId: string,
  contractAddress: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const contract = new web3.eth.Contract(BridgeABI, contractAddress);
    contract.methods
      .getFeeByChainID('1', chainId)
      .call()
      .then((balance: any) => {
        resolve(balance);
      })
      .catch((error: any) => {
        reject(error);
        console.error('getFeeByChainID error', error);
      });
  });
};

export async function isApprovedForAll(
  nftType: string,
  accountAddress: string,
  nftAddress: string,
  plateFromAddress: string,
) {
  if (nftType == 'ERC721' || nftType == 'ERC1948') {
    let approveResult = await uptick721.isApprovedForAll(
      accountAddress,
      nftAddress,
      plateFromAddress,
    );

    return approveResult;
  } else if (nftType == 'ERC1155') {
    let approveResult = await uptick1155.isApprovedForAll(
      accountAddress,
      nftAddress,
      plateFromAddress,
    );
    return approveResult;
  }
}

export const setApprovTokenid = (
  offerAddress: string,
  tokenId: string,
  nftAddress: string,
) => {
  const transferTx = uptick721.setApprovTokenid(
    offerAddress,
    tokenId,
    nftAddress,
  );
  return transferTx;
};

export const setApprovalForAll = (
  nftType: string,
  address: string,
  plateFromAddress: string,
) => {
  if (nftType == 'ERC721' || nftType == 'ERC1948') {
    const transferTx = uptick721.setApprovalForAll(address, plateFromAddress);

    return transferTx;
  } else if (nftType == 'ERC1155') {
    const transferTx = uptick1155.setApprovalForAll(address, plateFromAddress);

    return transferTx;
  }
};

export const nftOnsaleCoupon = (
  nftAddress: string,
  nftId: string,
  price: string,
  tokenAddress: string,
  amount: string,
  plateFromAddress: string,
  nftType: string,
  couponCode: string,
  couponValue: string,
) => {
  let weiPrice = 0;
  let couponPrice = 0;
  if (isSixDecimalToken(tokenAddress)) {
    weiPrice = utils.toWei(price, 'mwei');
    couponPrice = utils.toWei(couponValue, 'mwei');
  } else {
    weiPrice = utils.toWei(price);
    couponPrice = utils.toWei(couponValue);
  }
  if (nftType == 'ERC721' || nftType == 'ERC1948') {
    const contract = new web3.eth.Contract(ERCCoupon721, plateFromAddress);
    const transferTx = contract.methods
      .onSale(
        nftAddress,
        nftId,
        weiPrice,
        tokenAddress,
        couponCode,
        couponPrice,
      )
      .encodeABI();

    return transferTx;
  } else if (nftType == 'ERC1155') {
    const contract = new web3.eth.Contract(ERCCoupon1155, plateFromAddress);
    const transferTx = contract.methods
      .onSale(
        nftAddress,
        nftId,
        weiPrice,
        amount,
        tokenAddress,
        couponCode,
        couponPrice,
      )
      .encodeABI();

    return transferTx;
  }
};

export const nftOnsale = (
  nftAddress: string,
  nftId: string,
  price: string,
  tokenAddress: string,
  amount: string,
  plateFromAddress: string,
  nftType: string,
  nftTokenIds: string,
) => {
  let weiPrice = 0;
  let prices = [];
  let chainAddresss = [];
  if (price > 0) {
    if (nftTokenIds) {
      if (isSixDecimalToken(tokenAddress)) {
        weiPrice = utils.toWei(price, 'mwei');
        for (let i = 0; i < nftId.length; i++) {
          prices.push(weiPrice);
          chainAddresss.push(tokenAddress);
        }
      } else {
        weiPrice = utils.toWei(price);
        for (let i = 0; i < nftId.length; i++) {
          prices.push(weiPrice);
          chainAddresss.push(tokenAddress);
        }
      }
    } else {
      if (isSixDecimalToken(tokenAddress)) {
        weiPrice = utils.toWei(price, 'mwei');
      } else {
        weiPrice = utils.toWei(price);
      }
    }
  }

  if (nftType == 'ERC721' || nftType == 'ERC1948') {
    if (nftTokenIds) {
      // 批量上架
      const contract = new web3.eth.Contract(
        ERC721PlatformABI,
        plateFromAddress,
      );
      const transferTx = contract.methods
        .onSaleBatch(nftAddress, nftId, prices, chainAddresss)
        .encodeABI();

      return transferTx;
    } else {
      const contract = new web3.eth.Contract(
        ERC721PlatformABI,
        plateFromAddress,
      );
      const transferTx = contract.methods
        .onSale(nftAddress, nftId, weiPrice, tokenAddress)
        .encodeABI();

      return transferTx;
    }
  } else if (nftType == 'ERC1155') {
    if (nftTokenIds) {
      const contract = new web3.eth.Contract(
        ERC1155PlatformABI,
        plateFromAddress,
      );
      const transferTx = contract.methods
        .onSaleBatch(nftAddress, nftId, prices, amount, chainAddresss)
        .encodeABI();

      return transferTx;
    } else {
      const contract = new web3.eth.Contract(
        ERC1155PlatformABI,
        plateFromAddress,
      );
      const transferTx = contract.methods
        .onSale(nftAddress, nftId, weiPrice, amount, tokenAddress)
        .encodeABI();

      return transferTx;
    }
  }
};

// 下架
export async function offsale(
  nftAddress: string,
  nftId: string,
  seller: string,
  plateFromAddress: string,
  nftType: string,
  nftTokenIds: string,
) {
  let fromaddressarr = [];

  if (nftType == 'ERC721' || nftType == 'ERC1948') {
    if (nftTokenIds) {
      for (let i = 0; i < nftId.length; i++) {
        fromaddressarr.push(seller);
      }
      const contract = new web3.eth.Contract(
        ERC721PlatformABI,
        plateFromAddress,
      );
      const transferTx = contract.methods
        .offSaleBatch(nftAddress, nftId)
        .encodeABI();

      return transferTx;
    } else {
      const contract = new web3.eth.Contract(
        ERC721PlatformABI,
        plateFromAddress,
      );
      const transferTx = contract.methods
        .offSale(nftAddress, nftId)
        .encodeABI();

      return transferTx;
    }
  } else if (nftType == 'ERC1155') {
    try {
      if (nftTokenIds) {
        for (let i = 0; i < nftId.length; i++) {
          fromaddressarr.push(seller);
        }

        const contract = new web3.eth.Contract(
          ERC1155PlatformABI,
          plateFromAddress,
        );
        const transferTx = contract.methods
          .offSaleBatch(nftAddress, nftId, fromaddressarr)
          .encodeABI();

        return transferTx;
      } else {
        const contract = new web3.eth.Contract(
          ERC1155PlatformABI,
          plateFromAddress,
        );
        const transferTx = contract.methods
          .offSale(nftAddress, nftId, seller)
          .encodeABI();

        return transferTx;
      }
    } catch (error) {
      console.error('offsale error', error);
      throw error;
    }
  }
}

export const uptickToEVM = (
  tochainId: string,
  toAddressArr: Array,
  metadata: string,
  plateFromAddress: string,
) => {
  const contract = new web3.eth.Contract(BridgeABI, plateFromAddress);
  const transferTx = contract.methods
    .depositGeneric(tochainId, toAddressArr, metadata)
    .encodeABI();

  return transferTx;
};

// 获取津贴
export const receiveAllowance = (
  receiver: string,
  cycleNumber: number,
  signature: string,
  contractAddress: string,
) => {
  try {
    const contract = new web3.eth.Contract(AllowanceABI, contractAddress);
    const transferTx = contract.methods
      .receiveAllowance(receiver, cycleNumber, signature)
      .encodeABI();

    return transferTx;
  } catch (error) {
    console.error('receiveAllowance error', error);
    throw error;
  }
};

// 多币种下单 授权
export const token20ApprovalForAll = (
  platFromAddress: string,
  contractAddress: string,
  amount: number,
) => {
  const contract = new web3.eth.Contract(ERC20ABI, contractAddress);
  const transferTx = contract.methods
    .approve(platFromAddress, amount)
    .encodeABI();

  return transferTx;
};
// 多币种下单 检测是否授权成功
export const check20ApprovalForAll = (
  from: string,
  platFromAddress: string,
  contractAddress: string,
  amount: number,
) => {
  const contract = new web3.eth.Contract(ERC20ABI, contractAddress);
  return contract.methods.allowance(from, platFromAddress).call();
};

export const NftPayOrder = (
  from: string,
  to: string,
  tokenId: string,
  nftAddress: string,
  contractAddress: string,
  nftType: string,
  amount: number,
  marketType: string,
  couponCode: string,
  couponLink: string,
) => {
  if (nftType == 'ERC721' || nftType == 'ERC1948') {
    if (marketType == '3' || marketType == '5') {
      if (!couponCode) {
        couponCode = 0;
      }
      if (!couponLink) {
        couponLink = 0;
      }

      const contract = new web3.eth.Contract(ERCCoupon721, contractAddress);
      const transferTx = contract.methods
        .placeOrder(nftAddress, tokenId, to, couponCode, couponLink)
        .encodeABI();

      return transferTx;
    } else {
      const contract = new web3.eth.Contract(
        ERC721PlatformABI,
        contractAddress,
      );
      const transferTx = contract.methods
        .placeOrder(nftAddress, tokenId, to)
        .encodeABI();

      return transferTx;
    }
  } else if (nftType == 'ERC1155') {
    if (marketType == '3' || marketType == '5') {
      if (!couponCode) {
        couponCode = 0;
      }
      if (!couponLink) {
        couponLink = 0;
      }
      const contract = new web3.eth.Contract(ERCCoupon1155, contractAddress);
      const transferTx = contract.methods
        .placeOrder(
          nftAddress,
          tokenId,
          from,
          amount,
          to,
          couponCode,
          couponLink,
          ethers.toUtf8Bytes(''),
        )
        .encodeABI();

      // nftAddress, nftId,toAddress,1,fromAddress,utils.toUtf8Bytes(''),
      return transferTx;
    } else {
      const contract = new web3.eth.Contract(
        ERC1155PlatformABI,
        contractAddress,
      );
      const transferTx = contract.methods
        .placeOrder(
          nftAddress,
          tokenId,
          from,
          amount,
          to,
          ethers.toUtf8Bytes(''),
        )
        .encodeABI();

      // nftAddress, nftId,toAddress,1,fromAddress,utils.toUtf8Bytes(''),
      return transferTx;
    }
  }
};

export const LazyPayOrder = (
  toAddress,
  tokenId,
  baseurl,
  payAddress,
  payAmount,
  creatorFee,
  signature,
  nftAddress,
  data,
) => {
  const transferTx = lazyNFT1948.LazyPayOrder(
    toAddress,
    tokenId,
    baseurl,
    payAddress,
    payAmount,
    creatorFee,
    signature,
    nftAddress,
    data,
  );

  return transferTx;
};

export function NftTransfer(
  from: string,
  to: string,
  tokenId: string,
  nftAddress: string,
  nftType: string,
  amount: number,
) {
  if (nftType == 'ERC721' || nftType == 'ERC1948') {
    const transferTx = uptick721.NftTransfer(from, to, tokenId, nftAddress);
    return transferTx;
  } else if (nftType == 'ERC1155') {
    const transferTx = uptick1155.NftTransfer(
      from,
      to,
      tokenId,
      nftAddress,
      amount,
    );
    return transferTx;
  }
}
