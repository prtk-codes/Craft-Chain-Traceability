import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
const PINATA_GATEWAY = 'https://gateway.pinata.cloud';

/**
 * Upload JSON metadata to IPFS
 */
export async function uploadJSON(jsonData) {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  
  try {
    const response = await axios.post(url, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET,
      },
    });
    
    const ipfsHash = response.data.IpfsHash;
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Upload file (image) to IPFS
 */
export async function uploadFile(file) {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET,
      },
    });
    
    const ipfsHash = response.data.IpfsHash;
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

/**
 * Fetch data from IPFS
 */
export async function fetchFromIPFS(ipfsUrl) {
  if (!ipfsUrl) return null;
  
  const hash = ipfsUrl.replace('ipfs://', '');
  const url = `${PINATA_GATEWAY}/ipfs/${hash}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch from IPFS');
  }
}

/**
 * Convert IPFS URL to HTTP URL
 */
export function ipfsToHttp(ipfsUrl, gateway = 'pinata') {
  if (!ipfsUrl) return '';
  
  const hash = ipfsUrl.replace('ipfs://', '');
  
  const gateways = {
    pinata: `https://gateway.pinata.cloud/ipfs/${hash}`,
    ipfs: `https://ipfs.io/ipfs/${hash}`,
    cloudflare: `https://cloudflare-ipfs.com/ipfs/${hash}`,
  };
  
  return gateways[gateway] || gateways.pinata;
}

/**
 * Test Pinata connection
 */
export async function testConnection() {
  try {
    const testData = {
      message: 'Test from CraftChain',
      timestamp: new Date().toISOString(),
    };
    
    const ipfsUrl = await uploadJSON(testData);
    console.log('✅ Pinata connection successful!');
    console.log('Test file:', ipfsUrl);
    return true;
  } catch (error) {
    console.error('❌ Pinata connection failed:', error);
    return false;
  }
}