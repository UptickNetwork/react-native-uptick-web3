import {abi, bytecode} from '../abi/LazyNFT.json';
import {getWeb3Instance} from '../web3';

export async function deploy(
  privateKey,
  gasPrice,
  name,
  metadataUrl,
  lazySignAddress,
) {
  let web3 = getWeb3Instance();
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
    });
  return proof._address;
}

export async function lazyMint(
  toAddress,
  tokenId,
  baseurl,
  payAddress,
  payAmount,
  creatorFee,
  signature,
  data,
  fee,
) {
  const account = await base.getAccounts();
  const fromAddress = await account.getAddress();

  let contract;
  if (!contract) {
    contract = await connect(contractAddress, abi, account);
  }

  let hasWalletConnect = isWalletConnect();
  if (!hasWalletConnect) {
    let gasSetting = await base.getGasPriceAndGasLimit();
    console.log('gasSetting 1155', gasSetting);

    let result = await contract.lazyMint(
      toAddress,
      tokenId,
      baseurl,
      payAddress,
      payAmount,
      creatorFee,
      signature,
      stringToBytes32(data),
      {
        value: fee,
        gasPrice: gasSetting.gasPrice,
        gasLimit: gasSetting.gasLimit,
      },
    );
    return result;
  } else {
    let data = contract.methods
      .lazyMint(
        toAddress,
        tokenId,
        baseurl,
        payAddress,
        payAmount,
        creatorFee,
        signature,
        stringToBytes32(data),
      )
      .encodeABI();
    let result = await wallectConnectSendTransaction(
      fromAddress,
      contractAddress,
      data,
      payAmount,
    );
    return result;
  }
}
