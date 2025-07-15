// API endpoint to get available Flux Dev LoRA models dynamically
import fs from 'fs';
import path from 'path';

// Try to load from config file, fallback to hardcoded if not available
function loadLoRAModels() {
  try {
    const configPath = path.join(process.cwd(), 'config', 'flux-lora-models.json');
    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return configData.models || [];
    }
  } catch (error) {
    console.warn('Could not load LoRA models from config file, using fallback:', error.message);
  }

  // Fallback to hardcoded models
  return [
  {
    "name": null,
    "description": null,
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png",
    "model_id": ""
  },
  {
    "name": "Hands Fix for Flux",
    "description": "Improves hand generation quality in Flux models",
    "image_url": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3889d3d3-3af3-47b5-aa5c-0c9f699ba553/width=1024/27706512.jpeg",
    "model_id": "civitai:200255@804967"
  },
  {
    "name": "Mythic Fantasy Styles",
    "description": "Fantasy art style with dramatic lighting and mythical elements",
    "image_url": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/7f8cb19b-8a78-4486-998c-6d841437e72a/width=1664/85330411.jpeg",
    "model_id": "civitai:599757@1957771"
  },
  {
    "name": "Dramatic Lighting Style",
    "description": "Adds cinematic and dramatic lighting effects to images",
    "image_url": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d6940e26-7fa0-46d7-974c-0faabf1d4c4d/width=1216/51415635.jpeg",
    "model_id": "civitai:340248@1278791"
  },
  {
    "name": "Freckled Portrait Style",
    "description": "Natural portraits with freckles and realistic skin textures",
    "image_url": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c15b364d-873f-42c8-80a1-263350d97660/width=512/87830312.jpeg",
    "model_id": "civitai:1768322@2001239"
  },
  {
    "name": "Anime Style Flux",
    "description": "Anime-style character generation for Flux models",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png",
    "model_id": "civitai:1771835@2005301"
  }
  ];
}

export async function GET(req) {
  try {
    // Load LoRA models dynamically (from config file or fallback)
    const fluxLoraModels = loadLoRAModels();

    // In the future, this could also:
    // 1. Fetch from a database
    // 2. Query Civitai API for latest popular Flux Dev LoRAs
    // 3. Include user-specific LoRA collections
    // 4. Cache results for better performance

    return new Response(JSON.stringify({
      models: fluxLoraModels,
      count: fluxLoraModels.length,
      lastUpdated: new Date().toISOString(),
      source: 'config-file-with-fallback'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('Error fetching Flux LoRA models:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch LoRA models',
      models: [],
      count: 0
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
