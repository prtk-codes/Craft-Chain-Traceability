async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contract with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const CraftBatch721 = await ethers.getContractFactory("CraftBatch721");
  const contract = await CraftBatch721.deploy();
  
  // Get transaction hash immediately (before waiting for confirmation)
  const deployTx = contract.deploymentTransaction();
  console.log("\n📝 Deployment transaction sent!");
  console.log("Transaction hash:", deployTx.hash);
  console.log("Waiting for confirmation...");
  
  // Wait for deployment to be mined
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log("\n✅ Deployment confirmed!");
  console.log("CraftBatch721 deployed to:", contractAddress);
  console.log("\n🎉 SAVE THESE:");
  console.log("Contract Address:", contractAddress);
  console.log("Transaction Hash:", deployTx.hash);
  console.log("\n🔗 View on Etherscan:");
  console.log(`https://sepolia.etherscan.io/tx/${deployTx.hash}`);
  console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });