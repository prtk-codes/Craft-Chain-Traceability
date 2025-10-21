'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/usewallet';
import { useContract } from '@/hooks/usecontract';
import { uploadFile, uploadJSON } from '@/lib/ipfs';
import { Upload, Loader2, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
// ...existing code...

export default function MintPage() {
  const { account, isConnected, connect } = useWallet();
  const { contractWithSigner } = useContract();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    origin: '',
    material: '',
    quantity: '',
    category: 'textiles',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenId, setTokenId] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      try {
        await connect();
      } catch (err) {
        setError('Please connect your wallet first');
        return;
      }
    }

    if (!contractWithSigner) {
      setError('Contract not loaded. Please refresh the page.');
      return;
    }

    if (!imageFile) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setStatus('');

    try {
      // Step 1: Upload image to IPFS
      setStatus('📤 Uploading image to IPFS...');
      const imageUri = await uploadFile(imageFile);
      console.log('Image uploaded:', imageUri);

      // Step 2: Create metadata
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUri,
        attributes: [
          { trait_type: 'Origin', value: formData.origin },
          { trait_type: 'Material', value: formData.material },
          { trait_type: 'Category', value: formData.category },
          { trait_type: 'Quantity', value: formData.quantity },
          { trait_type: 'Creator', value: account },
          { trait_type: 'Production Date', value: new Date().toISOString().split('T')[0] },
        ],
      };

      // Step 3: Upload metadata to IPFS
      setStatus('📤 Uploading metadata to IPFS...');
      const metadataUri = await uploadJSON(metadata);
      console.log('Metadata uploaded:', metadataUri);

      // Step 4: Mint NFT
      setStatus('⛓️ Minting NFT on blockchain...');
      const tx = await contractWithSigner.mint(account, metadataUri);
      
      setStatus('⏳ Waiting for confirmation...');
      const receipt = await tx.wait();
      
      // Get token ID from Transfer event
      const transferEvent = receipt.logs.find(
        log => log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      );
      const newTokenId = parseInt(transferEvent.topics[3], 16);
      
      setTokenId(newTokenId);
      setSuccess(true);
      setStatus('');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        origin: '',
        material: '',
        quantity: '',
        category: 'textiles',
      });
      setImageFile(null);
      setImagePreview(null);
      
    } catch (err) {
      console.error('Error minting:', err);
      setError(err.message || 'Failed to mint batch. Please try again.');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎨 Mint New Batch
          </h1>
          <p className="text-xl text-white/70">
            Create a new batch NFT with product details and images
          </p>
        </div>

        {!isConnected && (
          <div className="glass p-6 mb-6 border-primary/50">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-primary" />
              <div>
                <p className="font-medium">Wallet Not Connected</p>
                <p className="text-sm text-white/60">Please connect your wallet to mint batches</p>
              </div>
            </div>
            <button onClick={connect} className="btn-primary w-full mt-4">
              Connect Wallet
            </button>
          </div>
        )}

        {success && (
          <div className="glass p-6 mb-6 border-primary/50 bg-primary/10">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-bold text-lg mb-2">✅ Batch Minted Successfully!</p>
                <p className="text-sm text-white/80 mb-3">Token ID: #{tokenId}</p>
                <div className="flex gap-2">
                  <a 
                    href={`/view/${tokenId}`}
                    className="btn-primary text-sm"
                  >
                    View Batch
                  </a>
                  <a 
                    href={`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm"
                  >
                    View on Etherscan
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="glass p-4 mb-6 border-red-500/50 bg-red-500/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {status && (
          <div className="glass p-4 mb-6 border-primary/50">
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin text-primary" size={20} />
              <p className="text-sm">{status}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass p-8 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Images *</label>
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={600}
                    height={384}
                    unoptimized
                    className="mx-auto rounded-lg object-contain max-h-64"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="btn-secondary text-sm"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <p className="text-white/60 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-white/40">PNG, JPG, GIF up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>
          </div>

          {/* Batch Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Batch Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Handwoven Silk Scarves - Batch #42"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your product, craftsmanship, and story..."
              rows={4}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              <option value="textiles">Textiles</option>
              <option value="pottery">Pottery</option>
              <option value="jewelry">Jewelry</option>
              <option value="woodwork">Woodwork</option>
              <option value="metalwork">Metalwork</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Origin */}
            <div>
              <label className="block text-sm font-medium mb-2">Origin Location *</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({...formData, origin: e.target.value})}
                placeholder="e.g., Varanasi, India"
                required
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-sm font-medium mb-2">Materials Used *</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                placeholder="e.g., Pure Silk, Cotton"
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity *</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              placeholder="e.g., 50"
              min="1"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isConnected}
            className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {status || 'Minting...'}
              </>
            ) : (
              <>
                <Upload size={20} />
                Mint Batch
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}