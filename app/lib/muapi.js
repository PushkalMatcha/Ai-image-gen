import axios from 'axios';

const POLL_INTERVAL = 1000; // 1 second
const MAX_POLL_TIME = 300000; // 5 minutes

// Generate image for LoRA models
export async function generateLoraImage({ prompt, model_id, width, height, num_images, apiKey, onLog }) {
  const proxyUrl = '/api/proxy';
  const apiUrl = 'https://api.muapi.ai/api/v1/flux_dev_lora_image';

  // Convert model_id string to the required array format
  let modelIdArray;
  if (typeof model_id === 'string' && model_id.startsWith('civitai:')) {
    modelIdArray = [{ model: model_id, weight: 1.0 }];
  } else if (Array.isArray(model_id)) {
    modelIdArray = model_id;
  } else {
    throw new Error('Invalid model_id format. Expected civitai:id@version string or array.');
  }

  const payload = {
    prompt,
    model_id: modelIdArray,
    width,
    height,
    num_images
  };

  // Note: LoRA requests should not include aspect_ratio parameter

  // Log payload to browser console for debugging
  console.log('🚀 LORA REQUEST PAYLOAD:', JSON.stringify(payload, null, 2));
  console.log('🔗 API URL:', apiUrl);
  console.log('🔑 API Key (first 8 chars):', apiKey.substring(0, 8) + '...');

  try {
    if (onLog) onLog('Submitting LoRA image generation task...');
    const response = await axios.post(proxyUrl, {
      url: apiUrl,
      method: 'POST',
      data: payload,
      apiKey
    });
    if (response.status === 200) {
      if (onLog) onLog('LoRA image generation task submitted. Request ID: ' + response.data.request_id);
      return response.data;
    } else {
      const errMsg = `Error: ${response.status}, ${response.statusText}`;
      if (onLog) onLog(errMsg);
      throw new Error(errMsg);
    }
  } catch (error) {
    let errMsg = 'Error submitting LoRA image generation task: ' + error.message;
    if (error.response) {
      errMsg += `\nStatus: ${error.response.status}`;
      errMsg += `\nResponse data: ${JSON.stringify(error.response.data, null, 2)}`;
    }
    if (onLog) onLog(errMsg);
    throw new Error(errMsg);
  }
}

// Map model name/id to endpoint

const modelEndpointMap = {
  'Flux Dev': 'https://api.muapi.ai/api/v1/flux_dev_image',
  'flux-dev': 'https://api.muapi.ai/api/v1/flux_dev_image',

  'HiDream I1 Fast': 'https://api.muapi.ai/api/v1/hidream_i1_fast_image',
  'HiDream I1 Dev': 'https://api.muapi.ai/api/v1/hidream_i1_dev_image',
  'HiDream I1 Full': 'https://api.muapi.ai/api/v1/hidream_i1_full_image',
  // Flux Kontext models (no width/height required)
  'Flux Kontext Dev T2I': 'https://api.muapi.ai/api/v1/flux_kontext_dev_text_to_image',
  'Flux Kontext Dev I2I': 'https://api.muapi.ai/api/v1/flux_kontext_dev_image_to_image',
  // Flux LoRA model (requires model_id array)
  'Flux LoRA': 'https://api.muapi.ai/api/v1/flux_dev_lora_image',
  
  'Flux Schnell': 'https://api.muapi.ai/api/v1/hidream_i1_fast_image', 
  'Flux LoRA': 'https://api.muapi.ai/api/v1/hidream_i1_fast_image',   
  'Flux Pro v1.1': 'https://api.muapi.ai/api/v1/hidream_i1_fast_image', 
  'Flux Pro Ultra v1.1': 'https://api.muapi.ai/api/v1/hidream_i1_fast_image', 
  'Seedream-v3': 'https://api.muapi.ai/api/v1/hidream_i1_fast_image', 
  'Flux Kontext': 'https://api.muapi.ai/api/v1/hidream_i1_fast_image', 
  'Recraft-v3': 'https://api.muapi.ai/api/v1/hidream_i1_fast_image', 
  'Minimax/Hailuoai': 'https://api.muapi.ai/api/v1/hidream_i1_fast_image', 
  'Google Imagen 3': 'https://api.muapi.ai/api/v1/hidream_i1_fast_image', 
};

// Models that don't require width/height parameters
const modelsWithoutDimensions = [
  'Flux Kontext Dev T2I',
  'Flux Kontext Dev I2I'
];

// Generate image for Flux Dev and similar models
export async function generateImage({ prompt, width, height, num_images, apiKey, modelName, aspectRatio, onLog }) {
  const proxyUrl = '/api/proxy';
  const apiUrl = modelEndpointMap[modelName] || modelEndpointMap['Flux Dev'];

  // Create payload based on model requirements
  let payload = { prompt, num_images };

  // Add aspect ratio for all models
  if (aspectRatio) {
    payload.aspect_ratio = aspectRatio;
  }

  // Only add dimensions if the model requires them
  if (!modelsWithoutDimensions.includes(modelName)) {
    payload.width = width;
    payload.height = height;
  }

  // Log payload to browser console for debugging
  console.log('🚀 REGULAR REQUEST PAYLOAD:', JSON.stringify(payload, null, 2));
  console.log('🔗 API URL:', apiUrl);
  console.log('🔑 API Key (first 8 chars):', apiKey.substring(0, 8) + '...');
  console.log('📋 Model Name:', modelName);

  try {
    if (onLog) onLog(`Submitting image generation task for model: ${modelName}`);
    if (onLog) onLog(`Using API endpoint: ${apiUrl}`);
    if (onLog) onLog(`Payload: ${JSON.stringify(payload, null, 2)}`);

    const response = await axios.post(proxyUrl, {
      url: apiUrl,
      method: 'POST',
      data: payload,
      apiKey
    });

    if (response.status === 200) {
      if (onLog) onLog('Image generation task submitted. Request ID: ' + response.data.request_id);
      return response.data;
    } else {
      const errMsg = `Error: ${response.status}, ${response.statusText}`;
      if (onLog) onLog(errMsg);
      throw new Error(errMsg);
    }
  } catch (error) {
    let errMsg = 'Error submitting image generation task: ' + error.message;
    if (error.response) {
      errMsg += `\nStatus: ${error.response.status}`;
      errMsg += `\nStatus Text: ${error.response.statusText}`;
      errMsg += `\nResponse data: ${JSON.stringify(error.response.data, null, 2)}`;
    }
    if (onLog) onLog(errMsg);
    throw new Error(errMsg);
  }
}

// Poll for result by requestId
export async function pollForResult(requestId, apiKey, onLog) {
  const proxyUrl = '/api/proxy';
  const apiUrl = `https://api.muapi.ai/api/v1/predictions/${requestId}/result`;
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_POLL_TIME) {
    try {
      const url = `${proxyUrl}?url=${encodeURIComponent(apiUrl)}&apiKey=${encodeURIComponent(apiKey)}`;
      const pollResponse = await axios.get(url);

      if (pollResponse.status === 200) {
        const status = pollResponse.data.status;
        if (status === 'completed') {
          if (onLog) onLog('Image generation completed.');
          return pollResponse.data;
        } else if (status === 'failed') {
          const error = pollResponse.data.error || 'Generation failed';
          if (onLog) onLog('Image generation failed: ' + error);
          throw new Error(error);
        } else if (status === 'pending' || status === 'processing' || status === 'starting') {
          // These are valid processing states - continue polling
          if (onLog) onLog('Image generation status: ' + status);
        } else {
          // Unknown status - log it but continue polling
          if (onLog) onLog('Unknown status: ' + status + ' - continuing to poll...');
        }
      } else {
        const errMsg = `Error: ${pollResponse.status}, ${pollResponse.statusText}`;
        if (onLog) onLog(errMsg);
        throw new Error(errMsg);
      }

      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        if (onLog) onLog('Polling request timeout, retrying...');
        continue;
      }
      throw error;
    }
  }

  const timeoutError = 'Image generation timed out after ' + (MAX_POLL_TIME / 1000) + ' seconds';
  if (onLog) onLog(timeoutError);
  throw new Error(timeoutError);
}

// Image-to-image editing function using Flux Kontext
export async function editImage({ prompt, imageUrl, width, height, num_images, apiKey, aspectRatio, onLog }) {
  const proxyUrl = '/api/proxy';
  const apiUrl = 'https://api.muapi.ai/api/v1/flux_kontext_dev_image_to_image';

  const payload = {
    prompt,
    images_list: [imageUrl],
    num_images: num_images || 1
  };

  // Add aspect ratio if provided
  if (aspectRatio) {
    payload.aspect_ratio = aspectRatio;
  }

  // Add dimensions if provided (some models might need them)
  if (width && height) {
    payload.width = width;
    payload.height = height;
  }

  try {
    if (onLog) onLog('Submitting image editing task...');
    if (onLog) onLog(`Using API endpoint: ${apiUrl}`);
    if (onLog) onLog(`Payload: ${JSON.stringify(payload, null, 2)}`);

    const response = await axios.post(proxyUrl, {
      url: apiUrl,
      method: 'POST',
      data: payload,
      apiKey
    });

    if (response.status === 200) {
      if (onLog) onLog('Image editing task submitted. Request ID: ' + response.data.request_id);
      return response.data;
    } else {
      const errMsg = `Error: ${response.status}, ${response.statusText}`;
      if (onLog) onLog(errMsg);
      throw new Error(errMsg);
    }
  } catch (error) {
    let errMsg = 'Error submitting image editing task: ' + error.message;
    if (error.response) {
      errMsg += `\nStatus: ${error.response.status}`;
      errMsg += `\nStatus Text: ${error.response.statusText}`;
      errMsg += `\nResponse data: ${JSON.stringify(error.response.data, null, 2)}`;
    }
    if (onLog) onLog(errMsg);
    throw new Error(errMsg);
  }
}

// Download image function using proxy endpoint
export async function downloadImage(imageUrl, filename = 'generated-image') {
  try {
    // Use our proxy endpoint to download the image
    const downloadUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;

    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${filename}.png`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image: ' + error.message);
  }
}

