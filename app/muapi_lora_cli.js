
require('dotenv').config();
const { generateImage, generateLoraImage, pollForResult } = require('./lib/muapi.js');

// Fetch available Flux Dev LoRA models dynamically
async function fetchFluxLoraModels() {
  try {
    const response = await fetch('http://localhost:3001/api/flux-lora-models');
    const data = await response.json();

    if (response.ok && data.models) {
      return data.models;
    } else {
      console.error('Failed to fetch LoRA models:', data.error);
      // Fallback to basic "None" option
      return [{
        name: "None",
        description: "No LoRA applied",
        model_id: ""
      }];
    }
  } catch (error) {
    console.error('Error fetching LoRA models:', error);
    // Fallback to basic "None" option
    return [{
      name: "None",
      description: "No LoRA applied",
      model_id: ""
    }];
  }
}

// Function to display and select LoRA model
async function selectLoRAModel() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n📋 Fetching available Flux Dev LoRA Models...');
  const fluxLoraModels = await fetchFluxLoraModels();

  console.log('\n📋 Available Flux Dev LoRA Models:');
  console.log('=' .repeat(50));

  fluxLoraModels.forEach((model, index) => {
    console.log(`${index}. ${model.name || 'None'}`);
    console.log(`   ${model.description || 'No description'}`);
    if (model.model_id) {
      console.log(`   ID: ${model.model_id}`);
    }
    console.log('');
  });

  return new Promise((resolve) => {
    rl.question('Select LoRA model (enter number): ', (answer) => {
      rl.close();
      const index = parseInt(answer);
      if (index >= 0 && index < fluxLoraModels.length) {
        const selectedModel = fluxLoraModels[index];
        console.log(`✅ Selected: ${selectedModel.name}`);
        resolve(selectedModel.model_id);
      } else {
        console.log('❌ Invalid selection, using no LoRA');
        resolve('');
      }
    });
  });
}

async function main() {
  console.log("Hello from MuApiApp!");

  // Get API key from command-line argument or prompt the user
  let apiKey = process.argv[2];
  if (!apiKey) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    apiKey = await new Promise(resolve => {
      rl.question('Enter your API key: ', answer => {
        rl.close();
        resolve(answer);
      });
    });
  }
  console.log(`API_KEY: ${apiKey}`);

  // Model selection from command-line or prompt
  let model = process.argv[4];
  if (!model) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    model = await new Promise(resolve => {
      rl.question('Enter the model (e.g., Flux Dev, Flux Dev LoRA): ', answer => {
        rl.close();
        resolve(answer);
      });
    });
  }

  // Get prompt from command-line argument or prompt the user
  let promptText = process.argv[3];
  if (!promptText) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    promptText = await new Promise(resolve => {
      rl.question('Enter the image prompt: ', answer => {
        rl.close();
        resolve(answer);
      });
    });
  }
  let result;
  try {
    let submitResult;
    if (model.toLowerCase().includes('lora')) {
      // Dynamic LoRA selection
      const selectedLoRAId = await selectLoRAModel();

      if (!selectedLoRAId) {
        console.log('⚠️  No LoRA selected, switching to regular Flux Dev model...');
        // Fall back to regular Flux Dev generation
        submitResult = await generateImage({
          prompt: promptText,
          width: 1024,
          height: 1024,
          num_images: 1,
          apiKey: apiKey,
          modelName: "Flux Dev"
        });
      } else {
        submitResult = await generateLoraImage({
          prompt: promptText,
          model_id: selectedLoRAId,
          width: 1024,
          height: 1024,
          num_images: 1,
          apiKey: apiKey
        });
      }
    } else {
      submitResult = await generateImage({
        prompt: promptText,
        width: 1024,
        height: 1024,
        num_images: 1,
        apiKey: apiKey,
        modelName: model
      });
    }
    const requestId = submitResult.request_id;
    console.log(`Task submitted successfully. Request ID: ${requestId}`);
    console.log('Polling for image generation result...');
    result = await pollForResult(requestId, apiKey);
    if (result.status === 'completed') {
      console.log('Image generation successful!');
      console.log(`Task completed. URL: ${result.outputs}`);
    } else {
      console.log('Image generation failed:', result.error);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }

}

main();
