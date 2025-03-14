/* eslint-disable */
const {ethers} = require('hardhat');

async function verify(address, args, contractPath) {
  try {
    // verify the token contract code
    await hre.run('verify:verify', {
      address: address,
      constructorArguments: args,
      contract: contractPath
    });
  } catch (e) {
    console.log('error verifying contract', e);
  }
  await sleep(1000);
}

function getNonce() {
  return baseNonce + nonceOffset++;
}

async function deployContract(name = 'Contract', path, args) {
  const Contract = await ethers.getContractFactory(path);

  const Deployed = await Contract.deploy(...args, {nonce: getNonce()});
  console.log(name, ': ', Deployed.address);
  await sleep(5000);

  return Deployed;
}

async function fetchContract(path, address) {
  // Fetch Deployed Factory
  const Contract = await ethers.getContractAt(path, address);
  console.log('Fetched ', path, ': ', Contract.address, '  Verify Against: ', address, '\n');
  await sleep(100)
  return Contract;
}

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      return resolve();
    }, ms);
  });
}

async function main() {
    console.log('Starting Deploy');

    // addresses
    [owner] = await ethers.getSigners();

    // fetch data on deployer
    console.log('Deploying contracts with the account:', owner.address);
    console.log('Account balance:', (await owner.getBalance()).toString());

    // manage nonce
    baseNonce = await ethers.provider.getTransactionCount(owner.address);
    nonceOffset = 0;
    console.log('Account nonce: ', baseNonce);

    // const Bacarrat = await deployContract('Bacarrat', 'contracts/Baccarat/Baccarat.sol:Baccarat', BaccaratArgs);
    // await sleep(10000);
    // await verify(Bacarrat.address, BaccaratArgs, 'contracts/Baccarat/Baccarat.sol:Baccarat');

    const LunarDatabase = await deployContract('LunarDatabase', 'contracts/LunarDatabase.sol:LunarDatabase', []);
    await sleep(10_000);

    const LunarVolumeTracker = await deployContract('VolumeTracker', 'contracts/LunarVolumeTracker.sol:LunarVolumeTracker', [LunarDatabase.address])
    await sleep(5_000);

    const LiquidityLocker = await deployContract('LiquidityLocker', 'contracts/LiquidityLocker.sol:LiquidityLocker', []);
    await sleep(5_000);
    
    const LiquidityAdder = await deployContract('LiquidityAdder', 'contracts/LiquidityAdder.sol:LiquidityAdder', [LunarDatabase.address]);
    await sleep(5_000);

    const LunarGenerator = await deployContract('LunarGenerator', 'contracts/LunarGenerator.sol:LunarGenerator', [LunarDatabase.address]);
    await sleep(5_000);

    const LunarPumpToken = await deployContract('LunarPumpToken', 'contracts/LunarPumpToken.sol:LunarPumpToken', []);
    await sleep(5_000);

    const BondingCurve = await deployContract('BondingCurve', 'contracts/BondingCurve.sol:BondingCurve', []);
    await sleep(10_000);

    

    await verify(LunarDatabase.address, [], 'contracts/LunarDatabase.sol:LunarDatabase');
    await verify(LiquidityLocker.address, [], 'contracts/LiquidityLocker.sol:LiquidityLocker')
    await verify(LiquidityAdder.address, [LunarDatabase.address], 'contracts/LiquidityAdder.sol:LiquidityAdder')
    await verify(LunarGenerator.address, [LunarDatabase.address], 'contracts/LunarGenerator.sol:LunarGenerator')
    await verify(LunarPumpToken.address, [], 'contracts/LunarPumpToken.sol:LunarPumpToken')
    await verify(LunarVolumeTracker.address, [LunarDatabase.address], 'contracts/LunarVolumeTracker.sol:LunarVolumeTracker')
    await verify(BondingCurve.address, [], 'contracts/BondingCurve.sol:BondingCurve')

    // set master copies
    await LunarDatabase.setLunarPumpBondingCurveMasterCopy(BondingCurve.address, { nonce: getNonce() });
    await sleep(5000);
    console.log('Set Bonding Curve Master Copy');

    await LunarDatabase.setLunarPumpTokenMasterCopy(LunarPumpToken.address, { nonce: getNonce() });
    await sleep(5000);
    console.log('Set LunarPumpToken Master Copy');

    // set generator
    await LunarDatabase.setLunarPumpGenerator(LunarGenerator.address, { nonce: getNonce() });
    await sleep(5000);
    console.log('Set LunarGenerator');

    // set LiquidityAdder
    await LunarDatabase.setLiquidityAdder(LiquidityAdder.address, { nonce: getNonce() });
    await sleep(5000);
    console.log('Set LiquidityAdder');

    // set LiquidityPermaLocker
    await LunarDatabase.setLiquidityPermaLocker(LiquidityLocker.address, { nonce: getNonce() });
    await sleep(5000);
    console.log('Set LiquidityLocker');

    // set setLunarVolumeTracker
    await LunarDatabase.setLunarVolumeTracker(LunarVolumeTracker.address, { nonce: getNonce() });
    await sleep(5000);
    console.log('Set LunarVolumeTracker');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
