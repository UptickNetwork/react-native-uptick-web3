/**
 * Uptick721 (ERC-721) 合约交互封装
 * 提供部署、铸造、授权与转移等链上操作的 Web3 调用
 */
import { abi, bytecode } from '../abi/Uptick721.json';
import { getWeb3Instance } from '../web3Util';
const web3 = getWeb3Instance();

/**
 * 部署 Uptick721 合约
 * @param privateKey 部署者私钥
 * @param gasPrice 交易 gas 价格
 * @param name 合约名称
 * @param metadataUrl 元数据基础 URL
 * @returns 部署后的合约地址
 */
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
        gasLimit: '0x3D0900', // 4,000,000 gas
      },
      function (e, transactionHash) {
        console.log(e);
      }
    )
    .on('receipt', function (receipt) {
      console.log('Deploy Result', receipt);

      return receipt.address;
    })
    .on('error', (error) => {
      console.error(error);
    });
  return proof._address;
}

/**
 * 铸造 NFT（创作者付费模式）
 * @returns 编码后的交易 calldata，需由钱包签名后发送
 */
export async function mintNft(
  toAddress,
  nftAddress,
  tokenId,
  baseurl,
  mintByCreatorFee
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

/**
 * 查询 operator 是否已被授权管理 owner 的全部 NFT
 * @param accountAddress NFT 持有者地址
 * @param nftAddress 合约地址
 * @param plateFromAddress 被查询的 operator 地址
 */
export async function isApprovedForAll(
  accountAddress: string,
  nftAddress: string,
  plateFromAddress: string
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

/**
 * 授权 operator 管理当前账户的全部 NFT
 * @returns 编码后的交易 calldata
 */
export function setApprovalForAll(
  accountAddress: string,
  plateFromAddress: string
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

/**
 * 转移指定 tokenId 的 NFT
 * @returns 编码后的交易 calldata
 */
export function NftTransfer(
  from: string,
  to: string,
  tokenId: string,
  nftAddress: string
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

/**
 * 授权指定地址操作单个 tokenId
 * @returns 编码后的交易 calldata
 */
export function setApprovTokenid(
  offerAddress: string,
  tokenId: string,
  nftAddress: string
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
