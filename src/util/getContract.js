import contract from 'truffle-contract';
import codexTitleJson from './constants/CodexTitle.json';

const getContract = new Promise(((resolve) => {
  const codexTitle = contract(codexTitleJson);
  codexTitle.setProvider(window.web3.currentProvider);
  resolve(codexTitle);
}));

export default getContract;
