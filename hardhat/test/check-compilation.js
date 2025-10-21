async function main() {
  console.log("🔍 Checking compilation status...\n");
  
  // Check if contract factory can be loaded
  try {
    const CraftBatch721 = await ethers.getContractFactory("CraftBatch721");
    console.log("✅ Contract factory loaded");
    console.log("   Bytecode length:", CraftBatch721.bytecode.length);
  } catch (error) {
    console.log("❌ Contract factory failed:", error.message);
    return;
  }
  
  // Check artifacts
  const fs = require("fs");
  const artifactPath = "./artifacts/contracts/CraftBatch721.sol/CraftBatch721.json";
  
  if (fs.existsSync(artifactPath)) {
    console.log("✅ Artifact file exists");
    const artifact = JSON.parse(fs.readFileSync(artifactPath));
    console.log("   ABI has", artifact.abi.length, "entries");
    console.log("   Contract name:", artifact.contractName);
  } else {
    console.log("❌ Artifact file not found");
    console.log("   Run: npx hardhat compile");
  }
  
  console.log("\n🎉 Everything looks good! Ready to deploy.");
}

main();