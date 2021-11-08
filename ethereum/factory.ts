import web3 from './web3';
import RPSFactory from './build/RPSFactory.json';

const ropsten_factory_address = '0xC7840072b5caCfEa73Acab0b4aE255B83483EAF4';

const instance = new web3.eth.Contract(
  JSON.parse(RPSFactory.interface),
  process.env.FACTORY_ADDRESS || ropsten_factory_address,
);

export default instance;
