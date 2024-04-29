const { ethers, JsonRpcProvider, ContractFactory } = require("ethers");
const fs = require("fs");

//const provider = new ethers.JsonRpcProvider("http://127.0.0.1:32000")
const providerX = new ethers.JsonRpcProvider("http://localhost:22000")

const solFile = fs.readFileSync("./SimpleStorage.sol", "utf8");
const solc = require("solc");

let key = 'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f'
let wallet = new ethers.Wallet(key)
const signer = wallet.connect(providerX)

async function main() {

    
  const input = {
    language: "Solidity",
    sources: {
      "Test.sol": {
        content: solFile,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  //const bytecode = output.contracts["SimpleStorage.sol"]["SimpleStorage"].evm.bytecode.object;
  //const abi = output.contracts["SimpleStorage.sol"]["SimpleStorage"].abi;

  const abi = '[{"inputs":[{"internalType":"uint256","name":"storedData_","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"_storedData","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"storedData","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"storedData_","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
  const bin = '0x6080604052348015600e575f80fd5b5060405161020f38038061020f8339818101604052810190602e9190606b565b805f81905550506091565b5f80fd5b5f819050919050565b604d81603d565b81146056575f80fd5b50565b5f815190506065816046565b92915050565b5f60208284031215607d57607c6039565b5b5f6088848285016059565b91505092915050565b6101718061009e5f395ff3fe608060405234801561000f575f80fd5b506004361061003f575f3560e01c806360fe47b1146100435780636d4ce63c1461005f578063985a3a131461007d575b5f80fd5b61005d600480360381019061005891906100e8565b61009b565b005b6100676100a4565b6040516100749190610122565b60405180910390f35b6100856100ac565b6040516100929190610122565b60405180910390f35b805f8190555050565b5f8054905090565b5f5481565b5f80fd5b5f819050919050565b6100c7816100b5565b81146100d1575f80fd5b50565b5f813590506100e2816100be565b92915050565b5f602082840312156100fd576100fc6100b1565b5b5f61010a848285016100d4565b91505092915050565b61011c816100b5565b82525050565b5f6020820190506101355f830184610113565b9291505056fea2646970667358221220a642c16dcc687951cd6f610d5d353043044ae390caf7423c158625818e33cec564736f6c63430008190033'

  const bytecode = '0x6080604052348015600e575f80fd5b5060405161020f38038061020f8339818101604052810190602e9190606b565b805f81905550506091565b5f80fd5b5f819050919050565b604d81603d565b81146056575f80fd5b50565b5f815190506065816046565b92915050565b5f60208284031215607d57607c6039565b5b5f6088848285016059565b91505092915050565b6101718061009e5f395ff3fe608060405234801561000f575f80fd5b506004361061003f575f3560e01c806360fe47b1146100435780636d4ce63c1461005f578063985a3a131461007d575b5f80fd5b61005d600480360381019061005891906100e8565b61009b565b005b6100676100a4565b6040516100749190610122565b60405180910390f35b6100856100ac565b6040516100929190610122565b60405180910390f35b805f8190555050565b5f8054905090565b5f5481565b5f80fd5b5f819050919050565b6100c7816100b5565b81146100d1575f80fd5b50565b5f813590506100e2816100be565b92915050565b5f602082840312156100fd576100fc6100b1565b5b5f61010a848285016100d4565b91505092915050565b61011c816100b5565b82525050565b5f6020820190506101355f830184610113565b9291505056fea2646970667358221220a642c16dcc687951cd6f610d5d353043044ae390caf7423c158625818e33cec564736f6c63430008190033'


  // console.log('output => ' ,output)
  // console.log('bytecode => ' ,bytecode)
  // console.log('abi => ' ,abi)
  // console.log('address => ' ,wallet.address)

  const factory3 = new ethers.ContractFactory(abi, bytecode, wallet);
  const nonce = await providerX.getTransactionCount(wallet)
  const contractDeployed = await factory3.deploy(13, {
    gasLimit: "0x4e85c",
    gasPrice: "0x0",
    nonce: nonce
  });

  // ERROR IF I USE THE LINE BELLOW
  await contractDeployed.waitForDeployment();
  // -----------------------


    const factory = new ethers.ContractFactory(
        abi,
        bin,
        signer
    )

    let txn = await factory.getDeployTransaction(13, {gasLimit: "999999", gasPrice: "0"})

    let walletX = new ethers.Wallet(key, providerX)
    console.log(`Sending transaction...`)
    const transaction = await walletX.sendTransaction(txn)
    console.log('Transaction hash:', transaction.hash)

    await transaction.wait()

    //await factory.deploy()

    process.exit()
}


    
main();