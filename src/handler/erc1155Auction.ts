import {abi} from '../abi/ERC721Auction.json';
import {getWeb3Instance} from '../web3Util';
const web3 = getWeb3Instance();

export async function placeBid(
  marketAddress,
  nftAddress,
  nftid,
  fixPrice,
  owner,
) {
  //let rep = await contract.bid(nftAddress,owner,nftid,fixPrice, {

  try {
    const contract = new web3.eth.Contract(abi, marketAddress);
    const transferTx = contract.methods
      .bid(nftAddress, owner, nftid, fixPrice)
      .encodeABI();

    return transferTx;
  } catch (error) {
    console.log(error);
  }
}

export async function createAuction(
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
  marketAddress,
) {
  try {
    const contract = new web3.eth.Contract(abi, marketAddress);
    const transferTx = contract.methods
      .createAuction(
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
        marketAddress,
      )
      .encodeABI();

    return transferTx;
  } catch (error) {
    console.log(error);
  }
}
// 撤回拍卖
export async function endAuction(
  nftAddress,
  nftid,
  _auctioneer,
  marketAddress,
) {
  try {
    const contract = new web3.eth.Contract(abi, marketAddress);
    const transferTx = contract.methods
      .endAuction(nftAddress, nftid, _auctioneer)
      .encodeABI();
    return transferTx;
  } catch (error) {
    console.log(error);
  }
}
