import {abi, bytecode} from '../abi/LazyNFT1948.json';
import {getWeb3Instance} from '../web3Util';

const web3 = getWeb3Instance();
export async function deploy(
  privateKey,
  gasPrice,
  name,
  metadataUrl,
  lazySignAddress,
) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  let proofContract = new web3.eth.Contract(abi);

  let proof = await proofContract
    .deploy({
      data: bytecode,
      arguments: [name, metadataUrl, lazySignAddress],
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
      // 合约部署失败时的处理逻辑
    });
  return proof._address;
}
export function stringToBytes32(str) {
  const padded = web3.utils.padLeft(web3.utils.asciiToHex(str), 64); //

  return padded;
}

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
  let dataStr = stringToBytes32(data);
  const contract = new web3.eth.Contract(abi, nftAddress);
  const transferTx = contract.methods
    .lazyMint(
      toAddress,
      tokenId,
      baseurl,
      payAddress,
      payAmount,
      creatorFee,
      signature,
      dataStr,
    )
    .encodeABI();

  return transferTx;
};
