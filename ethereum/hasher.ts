import web3 from './web3';
import Hasher from './build/Hasher.json';

const ropsten_hasher_address = '0x65090D94DB89aca327748531675f660c9Db35430';

const instance = new web3.eth.Contract(
  JSON.parse(Hasher.interface),
  process.env.HASHER_ADDRESS || ropsten_hasher_address,
);

export default instance;
