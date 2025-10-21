'use client';

import Link from 'next/link';
import { ArrowRight, Package, FileText, Eye, Shield, Sparkles, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block glass px-4 py-2 rounded-full mb-6 animate-pulse">
            <span className="text-sm font-medium text-primary">🔗 Blockchain-Powered Transparency</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Every Thread<br />
            <span className="text-primary">Tells a Story</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto">
            Track your handcrafted products from artisan to buyer. Build trust with complete transparency using blockchain technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mint" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
              Create Batch
              <ArrowRight size={20} />
            </Link>
            <Link href="/view" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
              Track Batch
              <Eye size={20} />
            </Link>
          </div>
        </div>

        {/* Visual Chain */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🎨', label: 'Artisan Creates' },
              { icon: '🏢', label: 'Co-op Receives' },
              { icon: '🏪', label: 'Retailer Stocks' },
              { icon: '🛍️', label: 'Buyer Owns' },
            ].map((step, i) => (
              <div key={i} className="glass p-6 text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">{step.icon}</div>
                <div className="text-sm font-medium">{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Craft-Chain?</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Empower artisans with technology that builds trust and transparency
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Shield,
              title: 'Immutable Records',
              description: 'Every transaction permanently recorded on blockchain, ensuring authenticity and preventing fraud.',
            },
            {
              icon: Eye,
              title: 'Full Transparency',
              description: 'Buyers scan QR codes to see complete product journey from creation to purchase.',
            },
            {
              icon: Sparkles,
              title: 'NFT Certificates',
              description: 'Each batch receives unique digital certificate proving ownership and authenticity.',
            },
            {
              icon: Users,
              title: 'Global Reach',
              description: 'Connect with buyers worldwide while maintaining complete control over your story.',
            },
            {
              icon: Package,
              title: 'Fair Pricing',
              description: 'Transparency helps artisans get fair value by showcasing craftsmanship and materials.',
            },
            {
              icon: FileText,
              title: 'Easy to Use',
              description: 'Simple interface for minting, tracking, and transferring—no blockchain expertise required.',
            },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="glass p-6 hover:border-primary/50 transition-all group hover:-translate-y-2"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-white/70">Three simple steps to complete transparency</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              num: '1',
              title: 'Create Batch',
              desc: 'Artisans mint an NFT for their product batch, uploading details and images to IPFS.',
            },
            {
              num: '2',
              title: 'Record Journey',
              desc: 'Each handler records steps like quality checks, packaging, and shipping on blockchain.',
            },
            {
              num: '3',
              title: 'Verify Authenticity',
              desc: 'Buyers scan QR code to view complete timeline, verifying authenticity and supporting artisans.',
            },
          ].map((step, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-black text-dark shadow-lg">
                {step.num}
              </div>
              <div className="flex-1 glass p-6">
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-white/70 text-lg">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="glass p-12 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build Trust?</h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join artisans using blockchain to showcase their craftsmanship and connect with conscious buyers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/mint" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <a 
                href="https://github.com/yourusername/craft-chain" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg px-8 py-4"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="text-2xl">🧵</span>
              <span>Craft-Chain</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-white/60">
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Sepolia Testnet
              </a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="text-center mt-8 text-white/40 text-sm">
            <p>&copy; 2025 Craft-Chain. Built on Ethereum Sepolia. Empowering artisans with blockchain.</p>
            <p className="mt-2">Contract: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.substring(0, 10)}...</p>
          </div>
        </div>
      </footer>
    </div>
  );
}