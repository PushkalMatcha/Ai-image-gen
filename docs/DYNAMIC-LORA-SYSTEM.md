# Dynamic LoRA System

This document describes the new dynamic LoRA system that replaces hardcoded LoRA models with a flexible, configuration-based approach.

## Overview

The dynamic LoRA system eliminates hardcoded LoRA model IDs throughout the codebase and provides a centralized way to manage Flux Dev compatible LoRA models.

## Architecture

### API Endpoint
- **URL**: `/api/flux-lora-models`
- **Method**: GET
- **Response**: JSON object with models array, count, and metadata

### Configuration File
- **Location**: `config/flux-lora-models.json`
- **Purpose**: Centralized LoRA model definitions
- **Fallback**: Hardcoded models if config file is unavailable

### Components Updated
1. **Web UI** (`app/page.js`) - Fetches models dynamically on load
2. **CLI Tool** (`app/muapi_lora_cli.js`) - Fetches models before selection
3. **Utility File** (`utility.js`) - Removed hardcoded arrays
4. **Search API** - Already dynamic via Civitai API

## Benefits

### ✅ **Eliminated Issues**
- No more hardcoded SDXL LoRA IDs
- No more multiple files with duplicate LoRA lists
- No more manual updates across multiple locations

### ✅ **New Capabilities**
- Easy addition/removal of LoRA models via JSON file
- Centralized LoRA model management
- Automatic Flux Dev compatibility validation
- Future-ready for database integration
- Metadata tracking (verification status, base model, etc.)

## Usage

### Adding New LoRA Models

1. **Edit Configuration File**:
   ```bash
   nano config/flux-lora-models.json
   ```

2. **Add New Model Object**:
   ```json
   {
     "name": "New LoRA Style",
     "description": "Description of the LoRA effect",
     "image_url": "https://example.com/preview.jpg",
     "model_id": "civitai:123456@789012",
     "verified": false,
     "baseModel": "Flux.1 D"
   }
   ```

3. **Verify Compatibility**:
   - Test the LoRA with Flux Dev model
   - Confirm it generates expected results
   - Update `verified: true` after testing

4. **Automatic Deployment**:
   - API automatically serves new models
   - Web UI and CLI will show new options
   - No code changes required

### Removing LoRA Models

1. Remove the model object from `config/flux-lora-models.json`
2. Or set `verified: false` to temporarily disable

### Model Object Schema

```json
{
  "name": "string | null",           // Display name
  "description": "string | null",    // Description text
  "image_url": "string",             // Preview image URL
  "model_id": "string",              // civitai:id@version or empty
  "verified": "boolean",             // Tested and working
  "baseModel": "string"              // Base model compatibility
}
```

## API Response Format

```json
{
  "models": [...],                   // Array of model objects
  "count": 6,                        // Number of models
  "lastUpdated": "2025-07-14T...",   // ISO timestamp
  "source": "config-file-with-fallback"
}
```

## Verification Process

All LoRA models should be verified for Flux Dev compatibility:

1. **Check Base Model**: Ensure it's trained for Flux.1 D
2. **Test Generation**: Generate sample images
3. **Validate Results**: Confirm expected style/effect
4. **Update Status**: Set `verified: true` in config

## Future Enhancements

### Planned Features
- Database integration for user-specific LoRA collections
- Automatic Civitai API sync for popular models
- LoRA model rating and usage statistics
- Batch verification tools
- Admin interface for model management

### Migration Path
- Current system is fully backward compatible
- Existing functionality preserved
- Easy migration to database when ready

## Troubleshooting

### Config File Issues
- Check file exists: `config/flux-lora-models.json`
- Validate JSON syntax
- Verify file permissions
- Check server logs for errors

### API Errors
- Ensure development server is running
- Check network connectivity
- Verify API endpoint accessibility
- Review browser console for errors

### Model Compatibility
- Confirm LoRA is Flux.1 D compatible
- Test with MuAPI flux_dev_lora_image endpoint
- Verify civitai ID format: `civitai:modelId@versionId`

## Migration Summary

### Before (Hardcoded)
```javascript
// Multiple files with hardcoded arrays
const fluxLoraModels = [
  { name: "Style", model_id: "civitai:123@456" },
  // ... more hardcoded entries
];
```

### After (Dynamic)
```javascript
// Single API call
const response = await fetch('/api/flux-lora-models');
const { models } = await response.json();
```

This change makes the system more maintainable, flexible, and future-ready while ensuring all LoRA models are Flux Dev compatible.
