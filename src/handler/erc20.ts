import {abi, bytecode} from '../abi/IERC20.json';
import {getWeb3Instance} from '../web3Util';
const web3 = getWeb3Instance();

export async function deploy(privateKey, gasPrice, name, symbol,totalSupply,decimals) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  let proofContract = new web3.eth.Contract(abi);

  let proof = await proofContract
    .deploy({
      data: bytecode,
      arguments: [name, symbol,totalSupply,decimals],
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


