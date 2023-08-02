const { ethers } = require('hardhat');

async function main() {
    const hre = require('hardhat');
    const { deployments, getNamedAccounts } = hre;

    // Obtenir les comptes nommés
    const { deployer } = await getNamedAccounts();
    // Déployer le premier contrat de token
    /*
    const arpatoken = await deployments.deploy('ArpaToken', {
      from: deployer,
      args: [],
      log: true,
    });
    console.log(arpatoken.address);
    */

    const arpa3 = await deployments.deploy('Arpa3', {
      from: deployer,
      args: [],
      log: true,
    });
    console.log(arpa3.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
