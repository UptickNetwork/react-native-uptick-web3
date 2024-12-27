import Web3 from 'web3';
import * as bip39 from 'bip39';
import {ethers} from 'ethers';
import {abi as ERC20ABI} from './abi/IERC20.json';
import {toWords0, encode0, bech32, fromWords0} from './bech32';
import {resolve} from 'url';

// TODO: change it on chain change (setProvider?)
const web3 = new Web3('https://json-rpc.uptick.network');

export const getWeb3Instance = () => {
  return web3;
};

export const setProvider = (provider: string) => {
  web3.setProvider(provider);
};

export const validateMnemonic = (mnemonic: string) => {
  return bip39.validateMnemonic(mnemonic);
};

export const importWallet = (mnemonic: string) => {
  try {
    const index = 0;
    const eth_path = `m/44'/60'/0'/0/${index}`;

    let wallet;

    if (mnemonic.length == 64 || mnemonic.length == 66) {
      if (mnemonic.length == 66) {
        mnemonic.slice(2);
      }
      wallet = web3.eth.accounts.privateKeyToAccount(mnemonic);
      wallet.publicKey = '';
      mnemonic = '';
    } else {
      wallet = ethers.HDNodeWallet.fromMnemonic(
        ethers.Mnemonic.fromPhrase(mnemonic),
        eth_path,
      );
    }
    if (!wallet.address) {
      return {};
    }

    const address = wallet.address.toLowerCase();
    let privateKey = wallet.privateKey;
    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.slice(2);
    }

    const publicKey = wallet.publicKey;
    let wordsbyte = web3.utils.hexToBytes(wallet.address);
    let words = toWords0(wordsbyte);

    let uptickAddress = encode0('uptick', words);

    return {
      address,
      uptickAddress,
      publicKey,
      privateKey,
      mnemonic,
    };
  } catch (error) {
    console.log(error);
  }
};
export const evmAddress2UptickAddress = (evmAddress: string) => {
  let wordsbyte = web3.utils.hexToBytes(evmAddress);
  let words = toWords0(wordsbyte);

  let uptickAddress = encode0('uptick', words);
  return uptickAddress;
};

export const getHDWallet = (index: number, mnemonic: string) => {
  try {
    const eth_path = `m/44'/60'/0'/0/${index}`;
    let wallet = ethers.HDNodeWallet.fromMnemonic(
      ethers.Mnemonic.fromPhrase(mnemonic),
      eth_path,
    );

    const address = wallet.address;
    let privateKey = wallet.privateKey;
    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.slice(2);
    }
    console.log('导入的privateKey', privateKey);
    const publicKey = wallet.publicKey;
    let wordsbyte = web3.utils.hexToBytes(wallet.address);
    let words = toWords0(wordsbyte);
    console.log(words);
    let uptickAddress = encode0('uptick', words);

    return {
      address,
      uptickAddress,
      publicKey,
      privateKey,
      mnemonic,
    };
  } catch (error) {
    console.log(error);
  }
};
export const getAddressFromPrivatekey = (privateKey: string) => {
  if (privateKey.length == 64 || privateKey.length == 66) {
    if (privateKey.length == 66) {
      privateKey.slice(2);
    }
    let wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
    return wallet.address;
  } else {
    return '';
  }
};

export const setDefaultAccount = (privateKey: any) => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  return web3;
};

export const getAccounts = () => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getAccounts()
      .then(accounts => {
        resolve(accounts);
      })
      .catch((error: any) => {
        reject(error);
        console.log('128error', error);
      });
  });
};

export const getBalance = (
  address: string,
  rpcUrl: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    setProvider(rpcUrl);
    web3.eth
      .getBalance(address)
      .then(balance => {
        console.log(address, '查询基础余额结果是' + balance);
        resolve(web3.utils.fromWei(balance, 'ether'));
      })
      .catch((error: any) => {
        reject(error);
        console.log('144error', error);
      });
  });
};
export const checkRpcAvalible = (rpc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('rpc', rpc);
    setProvider(rpc);
    web3.eth
      .getChainId()
      .then(chainId => {
        console.log('testRpcAvalible===', rpc, chainId);
        resolve(chainId);
      })
      .catch((error: any) => {
        console.log('160error', error);
        resolve('');
        reject(error);
      });
  });
};

export const getERC20Balance = (
  address: string,
  contractAddress: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const contract = new web3.eth.Contract(ERC20ABI, contractAddress);
    contract.methods
      .balanceOf(address)
      .call()
      .then((balance: any) => {
        resolve(balance);
      })
      .catch((error: any) => {
        reject(error);
        console.log('180error getERC20Balance---', error);
      });
  });
};
export const Token20Transfer = (
  from: string,
  to: string,
  contractAddress: string,
  amount: number,
) => {
  const contract = new web3.eth.Contract(ERC20ABI, contractAddress);
  const transferTx = contract.methods
    .transfer(to, amount * 1000000)
    .encodeABI();

  return transferTx;
};
// 多币种下单 授权
export const token20ApprovalForAll = (
  platFromAddress: string,
  contractAddress: string,
  amount: number,
) => {
  const contract = new web3.eth.Contract(ERC20ABI, contractAddress);
  const transferTx = contract.methods
    .approve(platFromAddress, amount)
    .encodeABI();

  return transferTx;
};
// 多币种下单 检测是否授权成功
export const check20ApprovalForAll = (
  from: string,
  platFromAddress: string,
  contractAddress: string,
  amount: number,
) => {
  const contract = new web3.eth.Contract(ERC20ABI, contractAddress);
  const transferTx = contract.methods
    .allowance(from, platFromAddress)
    .call()
    .then((balance: any) => {
      resolve(balance);
    })
    .catch((error: any) => {
      reject(error);
      console.log('check20ApprovalForAll---', error);
    });

  return transferTx;
};

export const signTransaction = (transaction: any, privateKey: string) => {
  return new Promise((resolve, reject) => {
    web3.eth.accounts
      .signTransaction(transaction, privateKey)
      .then((signedTransaction: any) => {
        resolve(signedTransaction);
      })
      .catch((error: any) => {
        reject(error);
        console.log('error', error);
      });
  });
};

export const signMessage = (message: string, privateKey: string) => {
  return new Promise((resolve, reject) => {
    console.log('web3====', web3);
    let httpProvider = new ethers.JsonRpcProvider(web3.host);
    const wallet = new ethers.Wallet(privateKey, httpProvider);
    wallet
      .signMessage(message)
      .then((signature: any) => {
        resolve(signature);
      })
      .catch((error: any) => {
        reject(error);
        console.log('error', error);
      });
  });
};

export const signTypedDataMessage = (
  domain: TypedDataDomain,
  types: Record<string, Array<TypedDataField>>,
  value: Record<string, any>,
  privateKey: string,
  rpcUrl: string,
) => {
  return new Promise((resolve, reject) => {
    let httpProvider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, httpProvider);

    wallet
      .signTypedData(domain, types, value)

      .then((signedMessage: any) => {
        console.log('signTypedDataMessage', signedMessage);
        resolve(signedMessage);
      })
      .catch((error: any) => {
        reject(error);
        console.log('300error', error);
      });
  });
};

export const sendSignedTransaction = (signedTransaction: any) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .sendSignedTransaction(signedTransaction.rawTransaction)
      .then((receipt: any) => {
        console.log('sendSignedTransactionreceipt', receipt);
        resolve(receipt);
      })
      .catch((error: any) => {
        resolve(error);
        console.log('error', error);
      });
  });
};

export const signAndSendransaction = (transaction: any, privateKey: string) => {
  // signTransaction(transaction,privateKey).then()
  // 暂时不写
};

export const getTransactionReceipt = (transactionHash: string) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getTransactionReceipt(transactionHash)
      .then((receipt: any) => {
        resolve(receipt);
      })
      .catch((error: any) => {
        reject(error);
        console.log('error', error);
      });
  });
};

export const getTransaction = (transactionHash: string) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getTransaction(transactionHash)
      .then((transaction: any) => {
        resolve(transaction);
      })
      .catch((error: any) => {
        reject(error);
        console.log('error', error);
      });
  });
};

export const getGasPrice = (rpc: string) => {
  setProvider(rpc);

  return new Promise((resolve, reject) => {
    web3.eth
      .getGasPrice()
      .then((gasPrice: any) => {
        resolve(gasPrice);
      })
      .catch((error: any) => {
        reject(error);
        console.log('getGasPrice,', error);
      });
  });
};

export const getNonce = (address: string) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getTransactionCount(address)
      .then((gasPrice: any) => {
        resolve(gasPrice);
      })
      .catch((error: any) => {
        reject(error);
        console.log('getTransactionCount,', error);
      });
  });
};

export const getBlock = (
  blockNumber: any,
  returnTransactionObjects: boolean,
) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getBlock(blockNumber, returnTransactionObjects as any)
      .then((block: any) => {
        resolve(block);
      })
      .catch((error: any) => {
        reject(error);
        console.log('error', error);
      });
  });
};

export const getBlockTransactionCount = (blockNumber: number) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getBlockTransactionCount(blockNumber)
      .then((count: any) => {
        resolve(count);
      })
      .catch((error: any) => {
        reject(error);
        console.log('error', error);
      });
  });
};

export const getTransactionFromBlock = (blockNumber: number, index: number) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getTransactionFromBlock(blockNumber, index)
      .then((transaction: any) => {
        resolve(transaction);
      })
      .catch((error: any) => {
        reject(error);
        console.log('error', error);
      });
  });
};

export const getTransactionInBlock = (blockNumber: number, index: number) => {
  return new Promise((resolve, reject) => {
    web3.eth
      .getTransactionFromBlock(blockNumber, index)
      .then((transaction: any) => {
        resolve(transaction);
      })
      .catch((error: any) => {
        reject(error);
        console.log('error', error);
      });
  });
};

export const recoverPersonalSignature = (
  message: string,
  signature: string,
) => {
  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    console.log(recoveredAddress);
    return recoveredAddress;
  } catch (error) {
    console.log(error);
  }
};

export const createAccount = async (
  name: string,
  index: number,
  mnemonic: string,
) => {
  try {
    let HDWallet = getHDWallet(index, mnemonic);
    let web3 = setDefaultAccount(HDWallet?.privateKey);
    const balance = await web3.eth.getBalance(HDWallet?.address as string);

    let wordsbyte = web3.utils.hexToBytes(HDWallet.address);
    let words = toWords0(wordsbyte);
    let uptickAddress = encode0('uptick', words);

    const account = {
      index: index,
      balance: `${web3.utils.fromWei(balance, 'ether')}`,
      // @ts-ignore
      address: HDWallet?.address,
      uptickAddress: uptickAddress,
      // @ts-ignore
      privateKey: HDWallet?.privateKey,
      name: name,
      tokens: [],
      nfts: [],
      transactions: {
        uptick: [],
        ethereum: [],
        bsc: [],
        arbitrum: [],
        polygon: [],
        avalanche: [],
        optimism: [],
        fantom: [],
        cronos: [],
      },
    };
    return account;
  } catch (error) {
    console.log(error);
  }
};
export const uptickAddress2EVM = (uptickAddess: string) => {
  let u = bech32.decode(uptickAddess);
  let words = fromWords0(u.words);
  let evmAddress = web3.utils.bytesToHex(words);
  return evmAddress;
};

// NON-WEB3
export const toAscii = (hex: string) => {
  return web3.utils.toAscii(hex);
};

// TODO: ENS ethereum name service
export const addressAbbreviate = (address: string) => {
  if (address) {
    if (address.length > 12) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    } else {
      return address;
    }
  } else {
    return '';
  }
};
export const addressSlice = (address: string) => {
  if (address) {
    return `${address.slice(0, 12)}...${address.slice(-12)}`;
  } else {
    return '';
  }
};
export const addressSliceto10 = (address: string) => {
  if (address) {
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
  } else {
    return '';
  }
};

export const abbreviateTokenID = (tokenID: string) => {
  return tokenID.length > 8
    ? `${tokenID.slice(0, 5)}...${tokenID.slice(-4)}`
    : tokenID;
};

export const renderBalance = (balance: string, symbol: string) => {
  const _balance = parseFloat(balance);
  if (_balance === 0) {
    return `0 ${symbol}`;
  }
  return `${_balance.toFixed(4)} ${symbol}`;
};
export const token2fromwei = (tokenNum: string, demical: number) => {
  if (tokenNum) {
    if (demical == 6) {
      if (tokenNum.includes('.')) {
        tokenNum = Math.round(Number(tokenNum)).toString();
      }
      let a = web3.utils.fromWei(tokenNum, 'mwei');
      return a;
    } else {
      if (tokenNum.includes('.')) {
        tokenNum = Math.round(Number(tokenNum)).toString();
      }
      return parseFloat(
        Number(web3.utils.fromWei(tokenNum, 'ether')).toFixed(6),
      );
    }
  } else {
    return 0;
  }
};

export const token2towei = (tokenNum: string, demical: number) => {
  if (tokenNum) {
    if (demical == 6) {
      return web3.utils.toWei(tokenNum, 'mwei');
    } else {
      return web3.utils.toWei(tokenNum, 'ether');
    }
  } else {
    return 0;
  }
};

export const utils = web3.utils;
