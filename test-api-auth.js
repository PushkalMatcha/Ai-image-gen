// Test API authentication with different endpoints

async function testAPIAuth() {
  console.log('🔍 Testing MuAPI authentication...\n');
  
  // You'll need to provide your API key
  const apiKey = 'your-api-key-here'; // Replace with your actual API key
  
  if (!apiKey || apiKey === 'your-api-key-here') {
    console.log('❌ Please update the script with your API key');
    return;
  }
  
  const proxyUrl = 'http://localhost:3001/api/proxy';
  
  // Test 1: Regular Flux Dev endpoint
  console.log('1️⃣ Testing regular Flux Dev endpoint...');
  try {
    const fluxDevUrl = 'https://api.muapi.ai/api/v1/flux_dev_image';
    const fluxDevPayload = {
      prompt: "test image",
      width: 1024,
      height: 1024,
      num_images: 1
    };
    
    const submitUrl = `${proxyUrl}?url=${encodeURIComponent(fluxDevUrl)}&apiKey=${encodeURIComponent(apiKey)}`;
    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fluxDevPayload)
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok && data.request_id) {
      console.log('✅ Regular Flux Dev: Authentication successful');
    } else {
      console.log('❌ Regular Flux Dev: Authentication failed');
    }
  } catch (error) {
    console.log('❌ Regular Flux Dev error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Flux Dev LoRA endpoint
  console.log('2️⃣ Testing Flux Dev LoRA endpoint...');
  try {
    const fluxLoraUrl = 'https://api.muapi.ai/api/v1/flux_dev_lora_image';
    const fluxLoraPayload = {
      prompt: "test image",
      model_id: [{ model: "civitai:200255@804967", weight: 1.0 }], // Hands Fix for Flux
      width: 1024,
      height: 1024,
      num_images: 1
    };
    
    const submitUrl = `${proxyUrl}?url=${encodeURIComponent(fluxLoraUrl)}&apiKey=${encodeURIComponent(apiKey)}`;
    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fluxLoraPayload)
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok && data.request_id) {
      console.log('✅ Flux Dev LoRA: Authentication successful');
    } else {
      console.log('❌ Flux Dev LoRA: Authentication failed');
    }
  } catch (error) {
    console.log('❌ Flux Dev LoRA error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Check API key format
  console.log('3️⃣ API Key Analysis:');
  console.log('Length:', apiKey.length);
  console.log('Starts with:', apiKey.substring(0, 8) + '...');
  console.log('Format looks valid:', /^[a-f0-9]{64}$/.test(apiKey) ? 'Yes' : 'No (might be different format)');
  
  console.log('\n🎯 RECOMMENDATIONS:');
  console.log('1. If regular Flux Dev works but LoRA fails: LoRA endpoint issue');
  console.log('2. If both fail: API key or authentication issue');
  console.log('3. Check MuAPI dashboard for API usage/limits');
  console.log('4. Verify API key has LoRA endpoint access');
}

// Run in browser console or with Node.js
if (typeof window !== 'undefined') {
  // Browser environment
  testAPIAuth();
} else {
  // Node.js environment
  console.log('Run this in browser console or update for Node.js with fetch polyfill');
}
