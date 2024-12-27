import {abi} from '../abi/ERC721Auction.json';
import {getWeb3Instance} from '../web3Util';
const web3 = getWeb3Instance();

export async function placeBid(
  marketAddress,
  nftAddress,
  nftid,
  fixPrice,
  fee,
  address,
) {
  console.log(
    'placeOrder  ------ 888888888888888',
    marketAddress,
    nftAddress,
    nftid,
    fixPrice,
    fee,
    address,
  );
  try {
    const contract = new web3.eth.Contract(abi, marketAddress);
    const transferTx = contract.methods
      .bid(nftAddress, nftid, fixPrice)
      .encodeABI();

    return transferTx;
  } catch (error) {
    console.log(error);
  }
}

export function createAuction(
  marketAddress,
  nftAddress,
  nftid,
  _auctioneer,
  _startTime,
  _endTime,
  _reservePrice,
  _buyoutPrice,
  _guaranteedPrice,
  _tokenAddress,
) {
  try {
    console.log('zxx===createAuction', marketAddress);
    const contract = new web3.eth.Contract(abi, marketAddress);
    const transferTx = contract.methods
      .createAuction(
        nftAddress,
        nftid,
        _startTime,
        _endTime,
        _reservePrice,
        _buyoutPrice,
        _guaranteedPrice,
        _tokenAddress,
      )
      .encodeABI();
    return transferTx;
  } catch (error) {
    console.log(error);
  }
}
// 撤回拍卖
export function endAuction(nftAddress, nftid, _auctioneer, marketAddress) {
  try {
    const contract = new web3.eth.Contract(abi, marketAddress);
    const transferTx = contract.methods
      .endAuction(nftAddress, nftid)
      .encodeABI();
    return transferTx;
  } catch (error) {
    console.log(error);
  }
}
