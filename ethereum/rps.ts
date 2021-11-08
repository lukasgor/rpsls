import web3 from './web3';
import RPS from './build/RPS.json';

const game = (address: string) => {
  return new web3.eth.Contract(JSON.parse(RPS.interface), address);
};

export default game;
