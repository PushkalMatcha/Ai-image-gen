// Test script to validate MuAPI endpoints
import axios from 'axios';

const API_KEY = 'your-api-key-here'; // Replace with actual API key

const endpoints = {
  'Flux Schnell': 'https://api.muapi.ai/api/v1/flux_schnell_image',
  'Flux Dev': 'https://api.muapi.ai/api/v1/flux_dev_image',
  'Flux Pro v1.1': 'https://api.muapi.ai/api/v1/flux_pro_image',
  'Flux Pro Ultra v1.1': 'https://api.muapi.ai/api/v1/flux_pro_ultra_image',
};

async function testEndpoint(name, url) {
  try {
    console.log(`\nTesting ${name}:`);
    console.log(`URL: ${url}`);
    
    const response = await axios.post(url, {
      prompt: "A simple test image",
      width: 512,
      height: 512,
      num_images: 1
    }, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log(`✅ ${name}: Success (${response.status})`);
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log(`❌ ${name}: Failed`);
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Error Data:', error.response?.data);
    console.log('Error Message:', error.message);
  }
}

async function testAllEndpoints() {
  console.log('Testing MuAPI endpoints...');
  
  for (const [name, url] of Object.entries(endpoints)) {
    await testEndpoint(name, url);
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Uncomment to run the test (after adding your API key)
// testAllEndpoints();

export { testEndpoint, testAllEndpoints };
