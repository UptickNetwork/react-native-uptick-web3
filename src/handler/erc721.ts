import {abi, bytecode} from '../abi/Uptick721.json';
import {getWeb3Instance} from '../web3Util';
const web3 = getWeb3Instance();

export async function deploy(privateKey, gasPrice, name, metadataUrl) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  let proofContract = new web3.eth.Contract(abi);

  let proof = await proofContract
    .deploy({
      data: bytecode,
      arguments: [name, metadataUrl],
    })
    .send(
      {
        from: account.address,
        gasPrice: gasPrice,
        gasLimit: '0x3D0900',
      },
      function (e, transactionHash) {
        console.log(e);
      },
    )
    .on('receipt', function (receipt) {
      console.log('Deploy Result', receipt);

      return receipt.address;
    })
    .on('error', error => {
      console.error(error);
    });
  return proof._address;
}

export async function mintNft(
  toAddress,
  nftAddress,
  tokenId,
  baseurl,
  mintByCreatorFee,
) {
  try {
    const contract = new web3.eth.Contract(abi, nftAddress);
    const transferTx = contract.methods
      .mintByCreatorFee(toAddress, tokenId, baseurl, mintByCreatorFee)
      .encodeABI();

    return transferTx;
  } catch (error) {
    console.log(error);
  }
}
export async function isApprovedForAll(
  accountAddress: string,
  nftAddress: string,
  plateFromAddress: string,
) {
  const contract = new web3.eth.Contract(abi, nftAddress);
  let transferTx = contract.methods
    .isApprovedForAll(accountAddress, plateFromAddress)
    .call()
    .then((result: any) => {
      console.log('result', result);

      // resolve(result);
      return result;
    })
    .catch((error: any) => {
      reject(error);
      console.log('isApprovedForAllerror', error);
    });
  return transferTx;
}

export function setApprovalForAll(
  accountAddress: string,
  plateFromAddress: string,
) {
  try {
    const contract = new web3.eth.Contract(abi, accountAddress);
    const transferTx = contract.methods
      .setApprovalForAll(plateFromAddress, true)
      .encodeABI();

    return transferTx;
  } catch (error) {
    console.log(error);
  }
}

export function NftTransfer(
  from: string,
  to: string,
  tokenId: string,
  nftAddress: string,
) {
  try {
    const contract = new web3.eth.Contract(abi, nftAddress);

    const transferTx = contract.methods
      .transferFrom(from, to, tokenId)

      .encodeABI();
    return transferTx;
  } catch (error) {
    console.log(error);
  }
}

export function setApprovTokenid(
  offerAddress: string,
  tokenId: string,
  nftAddress: string,
) {
  try {
    const contract = new web3.eth.Contract(abi, nftAddress);
    const transferTx = contract.methods
      .approve(offerAddress, tokenId)
      .encodeABI();

    return transferTx;
  } catch (error) {
    console.log(error);
  }
}
