'use client';

import { useState, useEffect } from 'react';
import { connectWallet, getCurrentAccount, isWalletConnected } from '@/lib/ethers';

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if already connected on mount
  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  async function checkConnection() {
    try {
      const connected = await isWalletConnected();
      if (connected) {
        const currentAccount = await getCurrentAccount();
        setAccount(currentAccount);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  }

  async function connect() {
    setLoading(true);
    setError(null);
    
    try {
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
      return connectedAccount;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function disconnect() {
    setAccount(null);
  }

  return {
    account,
    loading,
    error,
    isConnected: !!account,
    connect,
    disconnect,
  };
}