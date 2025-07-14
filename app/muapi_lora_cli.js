
require('dotenv').config();
const { generateImage, generateLoraImage, pollForResult } = require('./lib/muapi.js');

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
      submitResult = await generateLoraImage({
        prompt: promptText,
        model_id: "civitai:119351@317153",
        width: 1024,
        height: 1024,
        num_images: 1,
        apiKey: apiKey
      });
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
