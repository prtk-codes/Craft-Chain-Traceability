import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, NETWORK_CONFIG } from './contract';

/**
 * Get provider (read-only connection to blockchain)
 */
export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  
  // Fallback to RPC provider
  return new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
}

/**
 * Get signer (wallet that can send transactions)
 */
export async function getSigner() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner();
}

/**
 * Get contract instance (read-only)
 */
export function getContract() {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

/**
 * Get contract instance with signer (can send transactions)
 */
export async function getContractWithSigner() {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

/**
 * Connect wallet (request account access)
 */
export async function connectWallet() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  
  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    
    // Check network
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    
    const expectedChainId = `0x${NETWORK_CONFIG.chainId.toString(16)}`;
    
    if (chainId !== expectedChainId) {
      await switchNetwork();
    }
    
    return accounts[0];
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

/**
 * Switch to correct network
 */
export async function switchNetwork() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  
  const chainId = `0x${NETWORK_CONFIG.chainId.toString(16)}`;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error) {
    // Chain not added, try adding it
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId,
            chainName: 'Sepolia Testnet',
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [NETWORK_CONFIG.rpcUrl],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });
    } else {
      throw error;
    }
  }
}

/**
 * Check if wallet is connected
 */
export async function isWalletConnected() {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }
  
  const accounts = await window.ethereum.request({
    method: 'eth_accounts',
  });
  
  return accounts.length > 0;
}

/**
 * Get current account
 */
export async function getCurrentAccount() {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }
  
  const accounts = await window.ethereum.request({
    method: 'eth_accounts',
  });
  
  return accounts[0] || null;
}

/**
 * Format address (0x1234...5678)
 */
export function formatAddress(address) {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(38)}`;
}

/**
 * Format token ID
 */
export function formatTokenId(tokenId) {
  return `#${tokenId.toString()}`;
}