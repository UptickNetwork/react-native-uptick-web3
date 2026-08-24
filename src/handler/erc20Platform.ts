import {abi} from '../abi/ERC20Platform.json';
import {getWeb3Instance} from '../web3Util';

const web3 = getWeb3Instance();

/** ERC20Platform.onSale(token, amount, price, paymentToken) → calldata */
export function onSale(
  platformAddress: string,
  nftAddress: string,
  amount: string | number,
  price: string | number,
  payAddress: string,
) {
  const contract = new web3.eth.Contract(abi as any, platformAddress);
  return contract.methods
    .onSale(nftAddress, amount, price, payAddress)
    .encodeABI();
}

/** ERC20Platform.offSale(orderId) → calldata */
export function offSale(platformAddress: string, orderId: string | number) {
  const contract = new web3.eth.Contract(abi as any, platformAddress);
  return contract.methods.offSale(orderId).encodeABI();
}

/** ERC20Platform.placeOrder(orderId, to, amount) → calldata */
export function placeOrder(
  platformAddress: string,
  orderId: string | number,
  toAddress: string,
  amount: string | number,
) {
  const contract = new web3.eth.Contract(abi as any, platformAddress);
  return contract.methods.placeOrder(orderId, toAddress, amount).encodeABI();
}
