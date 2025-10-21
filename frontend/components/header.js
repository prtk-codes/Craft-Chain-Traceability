'use client';

import Link from 'next/link';
import { useWallet } from '@/hooks/usewallet';
import { formatAddress } from '@/lib/ethers';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { account, isConnected, connect, disconnect, loading } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      alert('Failed to connect wallet: ' + error.message);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-xl border-b border-primary/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-3xl">🧵</span>
            <span className="text-white">Craft-Chain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/mint" 
              className="text-white/80 hover:text-primary transition-colors font-medium"
            >
              Mint Batch
            </Link>
            <Link 
              href="/record-step" 
              className="text-white/80 hover:text-primary transition-colors font-medium"
            >
              Record Step
            </Link>
            <Link 
              href="/view" 
              className="text-white/80 hover:text-primary transition-colors font-medium"
            >
              Track Batch
            </Link>
          </div>

          {/* Wallet Connect Button */}
          <div className="hidden md:block">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="glass px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-primary">
                    {formatAddress(account)}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="btn-secondary text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link 
              href="/mint" 
              className="block text-white/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mint Batch
            </Link>
            <Link 
              href="/record-step" 
              className="block text-white/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Record Step
            </Link>
            <Link 
              href="/view" 
              className="block text-white/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Track Batch
            </Link>
            
            <div className="pt-3 border-t border-primary/20">
              {isConnected ? (
                <div className="space-y-2">
                  <div className="glass px-4 py-2 rounded-lg text-center">
                    <span className="text-sm font-medium text-primary">
                      {formatAddress(account)}
                    </span>
                  </div>
                  <button
                    onClick={disconnect}
                    className="btn-secondary w-full"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}