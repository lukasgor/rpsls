import path from 'path';
import solc from 'solc';
import fs from 'fs-extra';

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const rpsPath = path.resolve(__dirname, 'contracts', 'RPS.sol');
const source = fs.readFileSync(rpsPath, 'utf8');
const output = solc.compile(source, 1).contracts;
fs.ensureDirSync(buildPath);

for (const contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract],
  );
}
