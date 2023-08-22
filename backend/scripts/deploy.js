const { ethers } = require('hardhat');

async function main() {
    const hre = require('hardhat');
    const { deployments, getNamedAccounts } = hre;

    // Obtenir les comptes nommés
    const { deployer } = await getNamedAccounts();
    // Déployer le premier contrat de token
  
    const arpatoken = await deployments.deploy('ArpaCoin', {
      from: deployer,
      args: [],
      log: true,
    });
    console.log(arpatoken.address);


    const arpa3 = await deployments.deploy('Arpa3', {
      from: deployer,
      args: [arpatoken.address],
      log: true,
    });
    console.log(arpa3.address);

    const Contract = await ethers.getContractFactory("Arpa3");
    const instance = await Contract.attach(arpa3.address);
    await instance.setWorkflowstatus(1);

    const instanceArpaToken = await ethers.getContractFactory("ArpaCoin");
    const instanceToken = await instanceArpaToken.attach(arpatoken.address);
    await instanceToken.mint(arpa3.address, 100000);
    await instanceToken.mint("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 5);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
