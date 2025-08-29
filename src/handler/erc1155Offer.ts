import { abi } from '../abi/MarketplaceOffer1155.json';
import { getWeb3Instance } from '../web3Util';
const web3 = getWeb3Instance();

export async function createOffer(
  platformAddress,
  offerNumber,
  nftAddress,
  tokenId,
  payAddress,
  value,
  expiry
) {
  console.log(
    'placeOrder  ------ 888888888888888',
    offerNumber,
    nftAddress,
    tokenId,
    payAddress,
    value,
    expiry
  );
  try {
    const contract = new web3.eth.Contract(abi, platformAddress);
    const transferTx = contract.methods
      .createOffer(offerNumber, nftAddress, tokenId, payAddress, value, expiry)
      .encodeABI();

    return transferTx;
  } catch (error) {
    console.log(error);
  }
}

//cancelOffer
export async function cancelOffer(platformAddress, offerNumber) {
  console.log('cancelOffer  ------ 11111111111', offerNumber);
  try {
    const contract = new web3.eth.Contract(abi, platformAddress);
    const transferTx = contract.methods.cancelOffer(offerNumber).encodeABI();

    return transferTx;
  } catch (error) {
    console.log(error);
  }
}

//acceptOffer
export async function acceptOffer(
  platformAddress,
  offerNumber,
  nftAddress,
  tokenId
) {
  try {
    const contract = new web3.eth.Contract(abi, platformAddress);
    const transferTx = contract.methods
      .acceptOffer(offerNumber, nftAddress, tokenId)
      .encodeABI();

    return transferTx;
  } catch (error) {
    console.log(error);
  }
}
