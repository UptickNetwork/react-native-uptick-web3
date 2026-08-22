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
  try {
    const contract = new web3.eth.Contract(abi, platformAddress);
    const transferTx = contract.methods
      .createOffer(offerNumber, nftAddress, tokenId, payAddress, value, expiry)
      .encodeABI();

    return transferTx;
  } catch (error) {
    console.error('erc1155Offer createOffer error', error);
    throw error;
  }
}

//cancelOffer
export async function cancelOffer(platformAddress, offerNumber) {
  try {
    const contract = new web3.eth.Contract(abi, platformAddress);
    const transferTx = contract.methods.cancelOffer(offerNumber).encodeABI();

    return transferTx;
  } catch (error) {
    console.error('erc1155Offer cancelOffer error', error);
    throw error;
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
    console.error('erc1155Offer acceptOffer error', error);
    throw error;
  }
}
