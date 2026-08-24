import {abi} from '../abi/ERC3643Token.json';
import {getWeb3Instance} from '../web3Util';

const web3 = getWeb3Instance();

/** ERC3643Token.approve(spender, amount) → calldata */
export function approve(
  tokenAddress: string,
  spender: string,
  amount: string | number,
) {
  const contract = new web3.eth.Contract(abi as any, tokenAddress);
  return contract.methods.approve(spender, amount).encodeABI();
}

/** ERC3643Token.transfer(to, amount) → calldata */
export function transfer(
  tokenAddress: string,
  toAddress: string,
  amount: string | number,
) {
  const contract = new web3.eth.Contract(abi as any, tokenAddress);
  return contract.methods.transfer(toAddress, amount).encodeABI();
}

/** ERC3643Token.isWhitelisted(address) → bool */
export async function checkWhitelist(
  tokenAddress: string,
  whiteAddress: string,
) {
  const contract = new web3.eth.Contract(abi as any, tokenAddress);
  return contract.methods.isWhitelisted(whiteAddress).call();
}

/** ERC3643Token.paused() → bool */
export async function isPaused(tokenAddress: string) {
  const contract = new web3.eth.Contract(abi as any, tokenAddress);
  return contract.methods.paused().call();
}

/** ERC3643Token.allowance(owner, spender) → string */
export async function allowance(
  tokenAddress: string,
  owner: string,
  spender: string,
) {
  const contract = new web3.eth.Contract(abi as any, tokenAddress);
  return contract.methods.allowance(owner, spender).call();
}
