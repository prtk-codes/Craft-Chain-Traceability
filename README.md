# 🪡 Craft-Chain Traceability  
A decentralized batch traceability system built on Ethereum that assigns each artisanal batch a unique on-chain NFT ID (ERC-721), ensuring end-to-end transparency from creation to final buyer.  

---

## 🌟 Features  

- **End-to-End Transparency:** Every hand-off (artisan → co-op → retailer → buyer) is recorded on-chain.  
- **Tamper-Proof History:** Each product journey step is permanently auditable on Ethereum.  
- **Authenticity Proof:** NFTs act as verifiable certificates of origin.  
- **Privacy-Friendly:** Only minimal metadata fingerprints and IPFS CIDs are stored on-chain.  
- **Decentralized Storage:** Batch metadata and images are stored on **Pinata (IPFS)** instead of centralized servers.  
- **User-Friendly Interface:** Frontend built with **Next.js 14**, styled using **Tailwind CSS** and **shadcn/ui**.  
- **Secure Wallet Integration:** **MetaMask** used for user authentication and transaction signing.  

---

## 🏗️ Architecture  

```

┌────────────────┐
│   Browser      │ (Next.js + ethers.js)
│  Frontend UI   │
└──────┬─────────┘
        │
        ▼
┌────────────────┐
│   MetaMask     │ (Wallet connection & txn signing)
└──────┬─────────┘
        │
        ▼
┌────────────────┐
│   RPC Node     │ (Alchemy / Infura)
└──────┬─────────┘
        │
        ▼
┌────────────────────────────┐
│ Ethereum Sepolia Testnet   │ (Smart Contract)
└────────────────────────────┘
        │
        ▼
┌────────────────┐
│    Pinata      │ (IPFS for metadata & images)
└────────────────┘

````

---

## 🎭 Roles  

### 🧵 Artisan / Producer  
- Creates (mints) a new batch NFT.  
- Uploads metadata (origin, material, date, description) to **Pinata (IPFS)**.  
- Starts the chain of custody.  

### 🏪 Co-op / Distributor / Retailer  
- Takes custody through standard ERC-721 transfers.  
- Records additional steps like processing, packaging, or transport.  

### 👤 Buyer  
- Final holder of the NFT.  
- Can view the full traceability timeline and verify authenticity on-chain.  

---

## 📋 Smart Contract  

**Contract Address (Sepolia):** `0x8b2Dbb287d3426c0a85b7f6C22c7109E86c89c88`  
**View on Etherscan:** [https://sepolia.etherscan.io/address/0x8b2Dbb287d3426c0a85b7f6C22c7109E86c89c88](https://sepolia.etherscan.io/address/0x8b2Dbb287d3426c0a85b7f6C22c7109E86c89c88)

### Key Functions  

| Function | Description |
|-----------|-------------|
| `mintBatch(string metadataURI)` | Mint a new ERC-721 token with IPFS metadata. |
| `recordStep(uint256 tokenId, string stepURI)` | Add new process/transport steps to the token’s trace. |
| `getBatchHistory(uint256 tokenId)` | Retrieve on-chain trace and metadata. |
| `tokenURI(uint256 tokenId)` | Fetch IPFS link for metadata. |

---

## 🚀 Getting Started  

### Prerequisites  
- Node.js 18+  
- **MetaMask** wallet extension  
- Sepolia test ETH (get from faucet)  
- **Pinata** account for IPFS uploads  

### Installation  

```bash
# Clone repository
git clone https://github.com/prtk-codes/Craft-Chain-Traceability.git
cd Craft-Chain-Traceability

# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install
````

### Running Locally

Frontend:

```bash
cd frontend
npm run dev
```

Visit 👉 **[http://localhost:3000](http://localhost:3000)**

### Deploying Contract

```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🔐 How It Works

### 1. Batch Creation (Minting)

* Artisan uploads metadata JSON + image to **Pinata (IPFS)**.
* Smart contract mints a unique ERC-721 NFT linked to the IPFS CID.
* The batch receives a unique `tokenId`, starting its traceability journey.

### 2. Recording Steps

* Each new stage or hand-off adds a small JSON file (step details) to IPFS.
* The on-chain contract records the hash (step URI) to preserve integrity.
* Builds a transparent timeline of every supply-chain step.

### 3. Viewing Traceability

* Any user can enter or scan a batch’s `tokenId`.
* The DApp fetches metadata and steps from IPFS + blockchain.
* Displays ownership history, events, and detailed journey in UI.

---

## 🧪 Testing

### Manual Testing Flow

1️⃣ **Setup (3 MetaMask Accounts):**

* Account A: Artisan
* Account B: Distributor / Retailer
* Account C: Buyer

2️⃣ **Mint Batch (Account A):**

* Go to *Artisan Tab*
* Upload metadata to **Pinata (IPFS)**
* Click **“Mint Batch”**

3️⃣ **Record Step (Account B):**

* Switch to Account B
* Record a processing/shipping step
* Upload JSON → Pinata → Add Step

4️⃣ **View Trace (Account C):**

* Enter batch ID to view history
* Check owner and metadata via **MetaMask** + blockchain

---

## 📱 Tech Stack

### Smart Contract

* Solidity 0.8.19
* OpenZeppelin ERC-721
* Hardhat

### Frontend

* **Next.js 14 (React Framework)**
* TypeScript
* Tailwind CSS
* shadcn/ui
* ethers.js v6

### Wallet

* **MetaMask** (Ethereum wallet for browser)

### Storage & Deployment

* **Pinata (IPFS)** for decentralized file storage
* Ethereum Sepolia Testnet
* Vercel (Frontend hosting)
* Alchemy / Infura RPC Provider

---

## 🔒 Security Considerations

* Never commit `.env` or private keys to Git.
* Only IPFS CIDs (not raw files) are stored on-chain.
* Access control ensures only authorized minters can create batches.
* Decentralized metadata via **Pinata (IPFS)**.
* Demo-only (Sepolia testnet). Not for production.

---

## 📊 Data Design

### On-Chain (Public, Small)

```solidity
struct Batch {
    uint256 tokenId;
    string metadataURI;
    address artisan;
    uint64 createdAt;
    bool active;
}
```

### Off-Chain (Private, Large)

* Metadata JSON (image, description, attributes) stored on **Pinata (IPFS)**.
* Step history files stored off-chain, referenced by CID.

---

## 🎯 Future Enhancements

* QR-code generator for real-world traceability labels.
* Dashboard for multi-batch management.
* IPFS auto-pinning service integration.
* Zero-knowledge proofs for private verification.
* Multi-chain deployment (Polygon, Base, Avalanche).

---

## 📄 License

**MIT License**

---

## 🔗 Links

- **Live Demo:** [https://Craft-Chain-Traceability.vercel.app/](https://Craft-Chain-Traceability.vercel.app/)
- **Contract:** [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x8b2Dbb287d3426c0a85b7f6C22c7109E86c89c88)
- **GitHub:** [https://github.com/prtk-codes/Craft-Chain-Traceability](https://github.com/prtk-codes/Craft-Chain-Traceability)

---

⚠️ **Disclaimer:** This is a demonstration project deployed on the Sepolia Testnet. Do not use with real data or in production environments without thorough security audits.
