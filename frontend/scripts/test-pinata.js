require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testPinata() {
  console.log('🧪 Testing Pinata Connection...\n');

  const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const PINATA_SECRET = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

  if (!PINATA_API_KEY || !PINATA_SECRET) {
    console.error('❌ Pinata credentials not found in .env.local');
    return;
  }

  console.log('✅ API Key found:', PINATA_API_KEY.substring(0, 10) + '...');
  console.log('✅ Secret found:', PINATA_SECRET.substring(0, 10) + '...\n');

  try {
    // Test JSON upload
    const testData = {
      message: 'Test from CraftChain',
      timestamp: new Date().toISOString(),
      test: true
    };

    console.log('📤 Uploading test JSON to IPFS...');
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      testData,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    console.log('✅ Upload successful!');
    console.log('📦 IPFS Hash:', ipfsHash);
    console.log('🔗 View at:', `https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    console.log('\n✨ Pinata is working correctly!');

  } catch (error) {
    console.error('❌ Pinata test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testPinata();