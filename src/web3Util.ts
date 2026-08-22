import Web3 from 'web3';
import * as bip39 from 'bip39';
import { ethers } from 'ethers';
import { abi as ERC20ABI } from './abi/IERC20.json';
import { toWords0, encode0, bech32, fromWords0 } from './bech32';
import Web3Auth, {
  ChainNamespace,
  LOGIN_PROVIDER,
  WEB3AUTH_NETWORK,
} from '@web3auth/react-native-sdk';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import EncryptedStorage from 'react-native-encrypted-storage';

const web3 = new Web3('https://json-rpc.uptick.network');
let web3authObj;
let chainConfig = {
  chainNamespace: ChainNamespace.EIP155,
  chainId: '0x75',
  rpcTarget: 'https://json-rpc.uptick.network',
  displayName: 'Upward',
  blockExplorerUrl: 'https://evm-explorer.uptick.network',
  ticker: 'UPTICK',
  tickerName: 'Uptick',
  decimals: 18,
  logo: 'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/uptick_117/chain.png',
};

const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig,
  },
});
export const initWeb3Auth = (
  redirectUrl,
  clientId,
  appName,
  logoLight,
  logoDark,
) => {
  chainConfig.displayName = appName;
  chainConfig.logo = logoLight;
  const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
    clientId,
    redirectUrl,
    network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    privateKeyProvider: ethereumPrivateKeyProvider,
  });
  web3authObj = {
    web3auth: web3auth,
    resolvedRedirectUrl: redirectUrl,
  };
};

// google
export const GoogleLogin = async () => {
  let googleLoginResult;
  try {
    if (!web3authObj || !web3authObj.web3auth) {
      throw new Error('Web3Auth not initialized');
    }

    await web3authObj.web3auth.init();

    if (!web3authObj.web3auth.ready) {
      googleLoginResult = {
        msg: 'Web3auth not initialized',
        success: false,
      };
      return googleLoginResult;
    }
    let result = await checkGoogle();
    if (result) {
      let response = await web3authObj.web3auth.login({
        loginProvider: LOGIN_PROVIDER.GOOGLE,
        redirectUrl: web3authObj.resolvedRedirectUrl,
      });
      if (web3authObj.web3auth.state) {
        if (
          web3authObj.web3auth.state.userInfo &&
          web3authObj.web3auth.state.userInfo.name
        ) {
          googleLoginResult = {
            privateKey: web3authObj.web3auth.state.privKey,
            userInfo: web3authObj.web3auth.state.userInfo,
            success: true,
          };
        }
        // 一次性获取私钥：取到私钥后立即登出，避免会话长期驻留；登出失败不影响已返回的私钥
        web3authObj.web3auth.logout().catch(() => {});
        return googleLoginResult;
      }
    } else {
      googleLoginResult = {
        msg: 'create.errors.loginError',
        success: false,
      };
      return googleLoginResult;
    }
  } catch (e: any) {
    console.error('GoogleLogin error:', e.message);
    return {
      msg: e.message || 'Unknown error occurred',
      success: false,
    };
  }
};

// Email

export const EmailLogin = async (email) => {
  let googleLoginResult;
  try {
    if (!web3authObj || !web3authObj.web3auth) {
      throw new Error('Web3Auth not initialized');
    }
    await web3authObj.web3auth.init();

    if (!web3authObj.web3auth.ready) {
      googleLoginResult = {
        msg: 'Web3auth not initialized',
        success: false,
      };
      return googleLoginResult;
    }

    let response = await web3authObj.web3auth.login({
      loginProvider: LOGIN_PROVIDER.EMAIL_PASSWORDLESS,
      redirectUrl: web3authObj.resolvedRedirectUrl,
      extraLoginOptions: {
        login_hint: email,
      },
    });

    if (web3authObj.web3auth.connected) {
      // IMP END - SDK Initialization
      // setProvider(ethereumPrivateKeyProvider);
      if (web3authObj.web3auth.state) {
        if (
          web3authObj.web3auth.state.userInfo &&
          web3authObj.web3auth.state.userInfo.name
        ) {
          googleLoginResult = {
            privateKey: web3authObj.web3auth.state.privKey,
            userInfo: web3authObj.web3auth.state.userInfo,
            success: true,
          };
          return googleLoginResult;
        }
      }
    }
  } catch (e: any) {
    console.error('EmailLogin error:', e.message);
    return {
      msg: e.message || 'Unknown error occurred',
      success: false,
    };
  }
};
export const AppleLogin = async () => {
  let googleLoginResult;
  try {
    if (!web3authObj || !web3authObj.web3auth) {
      throw new Error('Web3Auth not initialized');
    }
    await web3authObj.web3auth.init();

    if (!web3authObj.web3auth.ready) {
      googleLoginResult = {
        msg: 'Web3auth not initialized',
        success: false,
      };
      return googleLoginResult;
    }

    let response = await web3authObj.web3auth.login({
      loginProvider: LOGIN_PROVIDER.APPLE,
      redirectUrl: web3authObj.resolvedRedirectUrl,
    });

    if (web3authObj.web3auth.connected) {
      // IMP END - SDK Initialization
      // setProvider(ethereumPrivateKeyProvider);
      if (web3authObj.web3auth.state) {
        if (
          web3authObj.web3auth.state.userInfo &&
          web3authObj.web3auth.state.userInfo.name
        ) {
          googleLoginResult = {
            privateKey: web3authObj.web3auth.state.privKey,
            userInfo: web3authObj.web3auth.state.userInfo,
            success: true,
          };
          return googleLoginResult;
        }
      }
    }
  } catch (e: any) {
    console.error('AppleLogin error:', e.message);
    return {
      msg: e.message || 'Unknown error occurred',
      success: false,
    };
  }
};

const timeout = 10000; // 10秒
const checkGoogle = () => {
  return Promise.race([
    fetch('https://www.google.com'),
    new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout),
    ),
  ])
    .then((response) => {
      if (!response.ok) {
        return false;
      }

      return true;
    })
    .catch((error) => {
      return false;
    });
};

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
    let publicKey = '';

    if (mnemonic.length == 64 || mnemonic.length == 66) {
      if (mnemonic.length == 66) {
        mnemonic = mnemonic.slice(2);
      }
      wallet = web3.eth.accounts.privateKeyToAccount(mnemonic);
      // 私钥导入：无助记词，公钥由 ethers 从私钥推导
      publicKey = new ethers.Wallet(wallet.privateKey).publicKey;
      mnemonic = '';
    } else {
      wallet = ethers.HDNodeWallet.fromMnemonic(
        ethers.Mnemonic.fromPhrase(mnemonic),
        eth_path,
      );
      publicKey = wallet.publicKey;
    }
    if (!wallet.address) {
      return {};
    }

    const address = wallet.address.toLowerCase();
    let privateKey = wallet.privateKey;
    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.slice(2);
    }
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
    console.error(error);
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
    console.error(error);
  }
};
export const getAddressFromPrivatekey = (privateKey: string) => {
  if (privateKey.length == 64 || privateKey.length == 66) {
    if (privateKey.length == 66) {
      privateKey = privateKey.slice(2);
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
      .then((accounts) => {
        resolve(accounts);
      })
      .catch((error: any) => {
        reject(error);
        console.error('getAccounts error', error);
      });
  });
};

export const getBalance = (
  address: string,
  rpcUrl: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 使用独立实例查询，避免修改模块级 web3 的全局 provider
    const _web3 = new Web3(rpcUrl);
    _web3.eth
      .getBalance(address)
      .then((balance) => {
        resolve(_web3.utils.fromWei(balance, 'ether'));
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};
export const checkRpcAvalible = (rpc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const _web3 = new Web3(rpc);
    _web3.eth
      .getChainId()
      .then((chainId) => {
        resolve(String(chainId));
      })
      .catch((error: any) => {
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
        console.error('getERC20Balance error', error);
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
    .transfer(to, web3.utils.toWei(String(amount), 'mwei'))
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
  return contract.methods.allowance(from, platFromAddress).call();
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
        console.error('error', error);
      });
  });
};

export const signMessage = (message: string, privateKey: string) => {
  return new Promise((resolve, reject) => {
    const rpcHost =
      (web3 as any).host ||
      ((web3 as any).currentProvider && (web3 as any).currentProvider.host) ||
      'https://json-rpc.uptick.network';
    let httpProvider = new ethers.JsonRpcProvider(rpcHost);
    const wallet = new ethers.Wallet(privateKey, httpProvider);
    wallet
      .signMessage(message)
      .then((signature: any) => {
        resolve(signature);
      })
      .catch((error: any) => {
        reject(error);
        console.error('error', error);
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
        console.error('signTypedDataMessage error', error);
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
        reject(error);
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
        console.error('error', error);
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
        console.error('error', error);
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
        console.error('error', error);
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
        console.error('error', error);
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
        console.error('error', error);
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
        console.error('error', error);
      });
  });
};

export const recoverPersonalSignature = (
  message: string,
  signature: string,
) => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress;
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
