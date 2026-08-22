import { abi, bytecode } from '../abi/Uptick1155.json';
import { getWeb3Instance } from '../web3Util';
import { ethers } from 'ethers';
const web3 = getWeb3Instance();

export async function deploy(privateKey, gasPrice, name, metadataUrl) {
  let web3 = getWeb3Instance();
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  let proofContract = new web3.eth.Contract(abi);

  let proof = await proofContract
    .deploy({
      data: bytecode,
      arguments: [name, '', metadataUrl],
    })
    .send(
      {
        from: account.address,
        gasPrice: gasPrice,
        gasLimit: '0x3D0900',
      },
      function (e, transactionHash) {
        if (e) {
          console.error('deploy error', e);
        }
      },
    )
    .on('receipt', function (receipt) {
      console.log('Deploy Result', receipt);

      return receipt.address;
    })
    .on('error', (error) => {
      console.error(error);
      // 合约部署失败时的处理逻辑
    });
  return proof._address;
}
export async function deployData(name, metadataUrl) {
  let web3 = getWeb3Instance();
  let proofContract = new web3.eth.Contract(abi);

  let data = await proofContract.deploy({
    data: bytecode,
    arguments: [name, '', metadataUrl],
  });
  return data;
}

export async function mintNft(
  toAddress,
  nftAddress,
  tokenId,
  baseurl,
  royaltyPercentage,
  amountValue,
) {
  try {
    const contract = new web3.eth.Contract(abi, nftAddress);
    const transferTx = contract.methods
      .mintByCreatorFee(
        toAddress,
        tokenId,
        amountValue,
        ethers.toUtf8Bytes(''),
        royaltyPercentage,
      )
      .encodeABI();

    return transferTx;
  } catch (error) {
    console.error('erc1155 error', error);
    throw error;
  }
}

export async function isApprovedForAll(
  accountAddress: string,
  nftAddress: string,
  plateFromAddress: string,
) {
  const contract = new web3.eth.Contract(abi, nftAddress);
  return contract.methods
    .isApprovedForAll(accountAddress, plateFromAddress)
    .call();
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
    console.error('erc1155 error', error);
    throw error;
  }
}

export function NftTransfer(from, to, tokenId, nftAddress, amount) {
  try {
    const contract = new web3.eth.Contract(abi, nftAddress);

    const transferTx = contract.methods
      .safeTransferFrom(from, to, tokenId, amount, ethers.toUtf8Bytes(''))
      .encodeABI();
    return transferTx;
  } catch (error) {
    console.error('erc1155 error', error);
    throw error;
  }
}
