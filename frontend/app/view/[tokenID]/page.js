'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function ViewPage() {
  const router = useRouter();
  const [tokenId, setTokenId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tokenId) {
      router.push(`/view/${tokenId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🔍 Track Your Batch</h1>
          <p className="text-xl text-white/70">Enter a token ID to view its complete journey</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-8">
          <label className="block text-sm font-medium mb-3">Token ID</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="e.g. 12345"
              className="flex-1"
            />
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Search size={16} />
              Search
            </button>
          </div>
        </form>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">How to Find Token ID</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass p-6 text-center">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="font-bold mb-2">Email Confirmation</h3>
              <p className="text-sm text-white/60">Check your email after minting for the token ID</p>
            </div>
            <div className="glass p-6 text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold mb-2">QR Code</h3>
              <p className="text-sm text-white/60">Scan the QR code printed on product packaging</p>
            </div>
            <div className="glass p-6 text-center">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="font-bold mb-2">Etherscan</h3>
              <p className="text-sm text-white/60">View your wallet&apos;s NFTs on Sepolia Etherscan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}