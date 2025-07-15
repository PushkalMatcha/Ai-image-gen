// Test to isolate the "Method Not Allowed" issue

async function testMethodIssue() {
  console.log('🔍 Testing Method Not Allowed issue...\n');
  
  // Replace with your actual API key
  const apiKey = 'your-api-key-here';
  
  if (!apiKey || apiKey === 'your-api-key-here') {
    console.log('❌ Please update the script with your API key');
    return;
  }
  
  // Test 1: Direct API call (bypass proxy)
  console.log('1️⃣ Testing direct API call...');
  try {
    const directResponse = await fetch('https://api.muapi.ai/api/v1/flux_dev_lora_image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        prompt: "test image",
        model_id: [{ model: "civitai:200255@804967", weight: 1.0 }],
        width: 1024,
        height: 1024,
        num_images: 1
      })
    });
    
    const directData = await directResponse.json();
    console.log('Direct API Status:', directResponse.status);
    console.log('Direct API Response:', directData);
    
    if (directResponse.ok) {
      console.log('✅ Direct API call successful');
    } else {
      console.log('❌ Direct API call failed');
    }
  } catch (error) {
    console.log('❌ Direct API error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Proxy call (current method)
  console.log('2️⃣ Testing proxy call...');
  try {
    const proxyResponse = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: 'https://api.muapi.ai/api/v1/flux_dev_lora_image',
        method: 'POST',
        data: {
          prompt: "test image",
          model_id: [{ model: "civitai:200255@804967", weight: 1.0 }],
          width: 1024,
          height: 1024,
          num_images: 1
        },
        apiKey: apiKey
      })
    });
    
    const proxyData = await proxyResponse.json();
    console.log('Proxy Status:', proxyResponse.status);
    console.log('Proxy Response:', proxyData);
    
    if (proxyResponse.ok) {
      console.log('✅ Proxy call successful');
    } else {
      console.log('❌ Proxy call failed');
    }
  } catch (error) {
    console.log('❌ Proxy error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Check if it's a CORS issue
  console.log('3️⃣ Testing CORS and endpoint availability...');
  try {
    const optionsResponse = await fetch('https://api.muapi.ai/api/v1/flux_dev_lora_image', {
      method: 'OPTIONS'
    });
    console.log('OPTIONS Status:', optionsResponse.status);
    console.log('CORS Headers:', Object.fromEntries(optionsResponse.headers.entries()));
  } catch (error) {
    console.log('❌ OPTIONS request failed:', error.message);
  }
  
  console.log('\n🎯 ANALYSIS:');
  console.log('1. If direct API works but proxy fails: Proxy configuration issue');
  console.log('2. If both fail with same error: API endpoint issue');
  console.log('3. If direct API blocked by CORS: Need to use proxy (expected)');
  console.log('4. If "Method Not Allowed": Wrong HTTP method or endpoint');
}

// Instructions for running
console.log('📋 INSTRUCTIONS:');
console.log('1. Replace "your-api-key-here" with your actual MuAPI key');
console.log('2. Open browser dev tools (F12)');
console.log('3. Paste this entire script in the console');
console.log('4. Run: testMethodIssue()');
console.log('');

// Auto-run if API key is provided
if (typeof window !== 'undefined') {
  window.testMethodIssue = testMethodIssue;
  console.log('✅ Function loaded. Run testMethodIssue() after updating API key.');
}
