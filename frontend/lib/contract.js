import contractData from '../public/contract-abi.json';

// Contract address from environment
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// Extract ABI
export const CONTRACT_ABI = contractData.abi;

// Network config
export const NETWORK_CONFIG = {
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID),
  name: process.env.NEXT_PUBLIC_NETWORK,
  rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_RPC,
};

// Export for easy import
export default {
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
};