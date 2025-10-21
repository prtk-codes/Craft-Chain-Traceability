'use client';

import { useState, useEffect } from 'react';
import { getContract, getContractWithSigner } from '@/lib/ethers';
import { useWallet } from './usewallet';

export function useContract() {
  const { account, isConnected } = useWallet();
  const [contract, setContract] = useState(null);
  const [contractWithSigner, setContractWithSigner] = useState(null);

  useEffect(() => {
    // Always have read-only contract
    const readOnlyContract = getContract();
    setContract(readOnlyContract);

    // If wallet connected, get contract with signer
    if (isConnected) {
      getContractWithSigner()
        .then(setContractWithSigner)
        .catch(console.error);
    } else {
      setContractWithSigner(null);
    }
  }, [isConnected, account]);

  return {
    contract,              // Read-only
    contractWithSigner,    // Can send transactions
    isReady: !!contract,
  };
}