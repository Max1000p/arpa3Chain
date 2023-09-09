const { ethers } = require('hardhat');

async function main() {
    const hre = require('hardhat');
    const { deployments, getNamedAccounts } = hre;

    // Obtenir les comptes nommés
    const { deployer } = await getNamedAccounts();
    // Déployer le premier contrat de token
    const instanceArpaToken = await ethers.getContractFactory("ArpaCoin");
    const instanceToken = await instanceArpaToken.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    /*
    await instanceToken.mint(arpa3.address, 100000);
    */
    await instanceToken.mint("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 5);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});