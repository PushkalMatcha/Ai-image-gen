// app/api/proxy/route.js
import axios from 'axios';

const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds

async function makeRequest(config, retries = 0) {
  try {
    return await axios({ ...config, timeout: TIMEOUT });
  } catch (error) {
    if (error.code === 'ECONNABORTED' && retries < MAX_RETRIES) {
      console.log(`Request timeout, retrying (${retries + 1}/${MAX_RETRIES})...`);
      return makeRequest(config, retries + 1);
    }
    throw error;
  }
}

export async function POST(req) {
  try {
    const { url, method = 'POST', headers = {}, data = {}, apiKey } = await req.json();

    // Validate required fields
    if (!url) {
      throw new Error('URL is required');
    }
    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Log the API key format (first and last 4 characters for security)
    const maskedApiKey = apiKey.length > 8 ?
      `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` :
      '***masked***';
    console.log('API Key format:', maskedApiKey);

    const axiosConfig = {
      url,
      method,
      headers: {
        ...headers,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      data
    };

    console.log('=== MUAPI REQUEST DEBUG ===');
    console.log('Making request to:', url);
    console.log('Request method:', method);
    console.log('Request payload:', JSON.stringify(data, null, 2));
    console.log('Request headers:', JSON.stringify(axiosConfig.headers, null, 2));
    console.log('Full axios config:', JSON.stringify({
      url: axiosConfig.url,
      method: axiosConfig.method,
      headers: axiosConfig.headers,
      data: axiosConfig.data
    }, null, 2));

    const response = await makeRequest(axiosConfig);
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Proxy POST error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      code: error.code,
      requestData: error.config?.data
    });

    // Log the full error response for debugging
    if (error.response) {
      console.error('=== MUAPI ERROR RESPONSE ===');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Request URL:', error.config?.url);
      console.error('Request Method:', error.config?.method);
      console.error('Request Data:', JSON.stringify(error.config?.data, null, 2));
    } else if (error.request) {
      console.error('=== NETWORK ERROR ===');
      console.error('No response received from server');
      console.error('Request config:', JSON.stringify(error.config, null, 2));
    } else {
      console.error('=== REQUEST SETUP ERROR ===');
      console.error('Error setting up request:', error.message);
    }

    const errorResponse = {
      error: error.message,
      status: error.response?.status || 500,
      data: error.response?.data || 'Internal Server Error',
      code: error.code,
      statusText: error.response?.statusText
    };

    return new Response(JSON.stringify(errorResponse), {
      status: error.response?.status || 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const apiKey = searchParams.get('apiKey');

    // Validate required fields
    if (!url) {
      throw new Error('URL is required');
    }
    if (!apiKey) {
      throw new Error('API key is required');
    }

    const config = {
      url,
      method: 'GET',
      headers: { 
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    };

    console.log('Making GET request to:', url);
    const response = await makeRequest(config);
    console.log('Response status:', response.status);

    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Proxy GET error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      code: error.code
    });

    const errorResponse = {
      error: error.message,
      status: error.response?.status || 500,
      data: error.response?.data || null,
      code: error.code
    };

    return new Response(JSON.stringify(errorResponse), {
      status: error.response?.status || 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
