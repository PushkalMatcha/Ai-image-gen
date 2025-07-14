import axios from 'axios';

async function testMuApi() {
  const API_KEY = process.env.MUAPIAPP_API_KEY || '<YOUR_API_KEY_HERE>';
  const url = 'https://api.muapi.ai/api/v1/flux_dev_image';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };
  const payload = {
    prompt: "Test prompt for MuAPI image generation.",
    width: 1024,
    height: 1024,
    num_images: 1
  };
  try {
    console.log('Submitting test image generation task...');
    const response = await axios.post(url, payload, { headers });
    if (response.status === 200) {
      console.log('Task submitted. Request ID:', response.data.request_id);
      const requestId = response.data.request_id;
      const resultUrl = `https://api.muapi.ai/api/v1/predictions/${requestId}/result`;
      while (true) {
        const pollResponse = await axios.get(resultUrl, { headers: { 'x-api-key': API_KEY } });
        if (pollResponse.status === 200) {
          const status = pollResponse.data.status;
          if (status === 'completed') {
            console.log('Image generation completed. URLs:', pollResponse.data.outputs);
            break;
          } else if (status === 'failed') {
            console.error('Image generation failed:', pollResponse.data.error);
            break;
          } else {
            console.log('Image generation status:', status);
          }
        } else {
          console.error('Polling error:', pollResponse.status, pollResponse.statusText);
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } else {
      console.error('Submission error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testMuApi();
import axios from 'axios';

async function testMuApi() {
  const API_KEY = process.env.MUAPIAPP_API_KEY || '<YOUR_API_KEY_HERE>';
  const url = 'https://api.muapi.ai/api/v1/flux_dev_image';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };
  const payload = {
    prompt: "Test prompt for MuAPI image generation.",
    width: 1024,
    height: 1024,
    num_images: 1
  };
  try {
    console.log('Submitting test image generation task...');
    const response = await axios.post(url, payload, { headers });
    if (response.status === 200) {
      console.log('Task submitted. Request ID:', response.data.request_id);
      const requestId = response.data.request_id;
      const resultUrl = `https://api.muapi.ai/api/v1/predictions/${requestId}/result`;
      while (true) {
        const pollResponse = await axios.get(resultUrl, { headers: { 'x-api-key': API_KEY } });
        if (pollResponse.status === 200) {
          const status = pollResponse.data.status;
          if (status === 'completed') {
            console.log('Image generation completed. URLs:', pollResponse.data.outputs);
            break;
          } else if (status === 'failed') {
            console.error('Image generation failed:', pollResponse.data.error);
            break;
          } else {
            console.log('Image generation status:', status);
          }
        } else {
          console.error('Polling error:', pollResponse.status, pollResponse.statusText);
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } else {
      console.error('Submission error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testMuApi();
