'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/usewallet';
import { useContract } from '@/hooks/usecontract';
import { uploadJSON, uploadFile } from '@/lib/ipfs';
import { Loader2, CheckCircle, AlertCircle, Upload, FileText } from 'lucide-react';
import Image from 'next/image';

// ...existing code...

export default function RecordStepPage() {
  const { account, isConnected, connect } = useWallet();
  const { contract, contractWithSigner } = useContract();
  
  const [tokenId, setTokenId] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    stepType: '',
    description: '',
    location: '',
    notes: '',
  });
  
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerifyOwnership = async () => {
    if (!tokenId) {
      setError('Please enter a token ID');
      return;
    }

    if (!isConnected) {
      try {
        await connect();
      } catch (err) {
        setError('Please connect your wallet first');
        return;
      }
    }

    setChecking(true);
    setError('');
    setIsOwner(false);
    setVerified(false);

    try {
      const owner = await contract.ownerOf(tokenId);
      
      if (owner.toLowerCase() === account.toLowerCase()) {
        setIsOwner(true);
        setVerified(true);
      } else {
        setError(`You do not own token #${tokenId}. Current owner: ${owner.substring(0, 10)}...`);
      }
    } catch (err) {
      console.error('Error verifying ownership:', err);
      setError('Token not found or invalid token ID');
    } finally {
      setChecking(false);
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOwner) {
      setError('Please verify ownership first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setStatus('');

    try {
      // Step 1: Upload photos to IPFS (if any)
      let photoUris = [];
      if (photoFiles.length > 0) {
        setStatus(`📤 Uploading ${photoFiles.length} photo(s) to IPFS...`);
        photoUris = await Promise.all(
          photoFiles.map(file => uploadFile(file))
        );
        console.log('Photos uploaded:', photoUris);
      }

      // Step 2: Create step data
      const stepData = {
        stepType: formData.stepType,
        description: formData.description,
        location: formData.location,
        notes: formData.notes,
        actor: account,
        timestamp: new Date().toISOString(),
        photos: photoUris,
      };

      // Step 3: Upload step data to IPFS
      setStatus('📤 Uploading step data to IPFS...');
      const stepDataUri = await uploadJSON(stepData);
      console.log('Step data uploaded:', stepDataUri);

      // Step 4: Record step on blockchain
      setStatus('⛓️ Recording step on blockchain...');
      const tx = await contractWithSigner.recordStep(tokenId, stepDataUri);
      
      setStatus('⏳ Waiting for confirmation...');
      await tx.wait();

      setSuccess(true);
      setStatus('');
      
      // Reset form
      setFormData({
        stepType: '',
        description: '',
        location: '',
        notes: '',
      });
      setPhotoFiles([]);
      setPhotoPreviews([]);
      
    } catch (err) {
      console.error('Error recording step:', err);
      setError(err.message || 'Failed to record step. Please try again.');
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
            📝 Record Supply Chain Step
          </h1>
          <p className="text-xl text-white/70">
            Add updates to your batch&apos;s journey
          </p>
        </div>

        {/* Token ID Verification */}
        <div className="glass p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Step 1: Verify Ownership</h2>
          
          <div className="flex gap-3">
            <input
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter Token ID (e.g., 0, 1, 2...)"
              className="flex-1"
              disabled={verified}
            />
            <button
              onClick={handleVerifyOwnership}
              disabled={checking || verified}
              className="btn-primary whitespace-nowrap"
            >
              {checking ? (
                <Loader2 className="animate-spin" size={20} />
              ) : verified ? (
                <CheckCircle size={20} />
              ) : (
                'Verify'
              )}
            </button>
          </div>

          {verified && (
            <div className="mt-4 flex items-center gap-2 text-primary">
              <CheckCircle size={20} />
              <span className="text-sm font-medium">
                ✓ You own Token #{tokenId}
              </span>
            </div>
          )}
        </div>

        {!isConnected && (
          <div className="glass p-6 mb-6 border-primary/50">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-primary" />
              <div>
                <p className="font-medium">Wallet Not Connected</p>
                <p className="text-sm text-white/60">Connect wallet to verify ownership</p>
              </div>
            </div>
            <button onClick={connect} className="btn-primary w-full mt-4">
              Connect Wallet
            </button>
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

        {success && (
          <div className="glass p-6 mb-6 border-primary/50 bg-primary/10">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-bold text-lg mb-2">✅ Step Recorded Successfully!</p>
                <p className="text-sm text-white/80 mb-3">Your update has been added to the blockchain</p>
                <a 
                  href={`/view/${tokenId}`}
                  className="btn-primary text-sm"
                >
                  View Timeline
                </a>
              </div>
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

        {/* Step Form */}
        {verified && (
          <form onSubmit={handleSubmit} className="glass p-8 space-y-6">
            <h2 className="text-xl font-bold">Step 2: Add Step Details</h2>

            {/* Step Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Step Type *</label>
              <select
                value={formData.stepType}
                onChange={(e) => setFormData({...formData, stepType: e.target.value})}
                required
              >
                <option value="">Select step type...</option>
                <option value="quality-check">Quality Check</option>
                <option value="packaging">Packaging</option>
                <option value="shipped">Shipped</option>
                <option value="received">Received</option>
                <option value="inspection">Inspection</option>
                <option value="storage">Storage</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe what happened in this step..."
                rows={4}
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Mumbai Warehouse, Delhi Distribution Center"
                required
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any additional information..."
                rows={3}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Photos (Optional)</label>
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <label className="cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <p className="text-white/60 text-sm mb-1">Click to upload photos</p>
                  <p className="text-xs text-white/40">Multiple files allowed</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Photo Previews */}
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={400}
                        height={240}
                        unoptimized
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {status || 'Recording...'}
                </>
              ) : (
                <>
                  <FileText size={20} />
                  Record Step
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}