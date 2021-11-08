require('dotenv').config();
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import hasher from './build/Hasher.json';
import RPSFactory from './build/RPSFactory.json';

const provider = new HDWalletProvider(
  process.env.DEPLOY_ACC_MNEMONIC,
  process.env.RPC_URL,
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const [rpsFactoryResult, hasherResult] = await Promise.all([
    new web3.eth.Contract(JSON.parse(RPSFactory.interface))
      .deploy({ data: RPSFactory.bytecode })
      .send({ gas: 1000000, gasPrice: '5000000000', from: accounts[0] }),
    new web3.eth.Contract(JSON.parse(hasher.interface))
      .deploy({ data: hasher.bytecode })
      .send({ gas: 1000000, gasPrice: '5000000000', from: accounts[0] }),
  ]);

  console.log(
    'Rps factory contract deployed to',
    rpsFactoryResult.options.address,
  );
  console.log('Hasher contract deployed to', hasherResult.options.address);
};

deploy();
