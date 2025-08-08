import { abi } from '../abi/MarketplaceOffer721.json';
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
  //0x45a13a6790d57b0230fd88c6639171f9f2ca8a3537797271d22976e973398e43 0x520fd68e21bc8e9e19b2899205af00c6bf10b184 1718867235638159526 0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687 100000 1719641758

  console.log(
    'createOffer  ------ 11111111111',
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
  //0x45a13a6790d57b0230fd88c6639171f9f2ca8a3537797271d22976e973398e43 0x520fd68e21bc8e9e19b2899205af00c6bf10b184 1718867235638159526 0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687 100000 1719641758

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
  console.log(
    'cancelOffer  ------ 11111111111',
    offerNumber,
    nftAddress,
    tokenId
  );
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
