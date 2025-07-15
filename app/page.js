"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { X, Plus, Slash } from 'lucide-react';
import { generateImage, pollForResult, generateLoraImage, downloadImage, editImage as editImageAPI } from './lib/muapi';

export const fluxModels = [

	{
		id: "dev",
		name: "Flux Dev",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/325703928897/e3f3bcbc-c6ef-46de-9639-2fb7498eabad.jpg",
		description: "Development version of Flux model",
		duration: 10,
		credits: 6,
		num: 2
	},
	{
		id: "lora",
		name: "Flux LoRA",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/237134950854/773fa85c-71d1-4684-b423-bd5ab1f97ffa.jpg",
		description: "Enabling rapid and high-quality image generation",
		duration: 10,
		credits: 6,
		num: 2
	},
	{
		id: "hidream-i1-fast",
		name: "HiDream I1 Fast",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/230967527308/d65c9c50-3604-43fe-9255-92685a84c91d.jpg",
		description: "Fast AI image generation with HiDream I1 model",
		duration: 5,
		credits: 3,
		num: 1
	},
	{
		id: "hidream-i1-dev",
		name: "HiDream I1 Dev",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/958012868787/9ae11fa2-2ed6-412f-8834-e4e437bdfb04.jpg",
		description: "Development version of HiDream I1 model with enhanced features",
		duration: 10,
		credits: 5,
		num: 1
	},
	{
		id: "hidream-i1-full",
		name: "HiDream I1 Full",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/420959112663/960e8ada-f6d9-4894-9ca1-8cf2436e47c8.jpg",
		description: "Full-featured HiDream I1 model with maximum quality and capabilities",
		isPro: true,
		duration: 15,
		credits: 8,
		num: 1
	},
	{
		id: "flux-kontext-dev-t2i",
		name: "Flux Kontext Dev T2I",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/411267126627/fd2e347d-e308-45c5-abfe-c5e9ac49b99c.jpg",
		description: "Flux Kontext development model for text-to-image generation (auto dimensions)",
		duration: 12,
		credits: 6,
		num: 1
	},
	{
		id: "flux-kontext-dev-i2i",
		name: "Flux Kontext Dev I2I",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/411267126627/fd2e347d-e308-45c5-abfe-c5e9ac49b99c.jpg",
		description: "Flux Kontext development model for image-to-image editing (auto dimensions)",
		duration: 12,
		credits: 6,
		num: 1
	},
];

// LoRA models are now fetched dynamically from API
// This removes hardcoded LoRA IDs and makes the system more flexible




// Helper: Poll for image result
// async function pollForResult(requestId, apiKey) {
//   const resultUrl = `https://api.muapi.ai/api/v1/predictions/${requestId}/result`;
//   while (true) {
//     const res = await fetch(resultUrl, {
//       headers: { 'x-api-key': apiKey }
//     });
//     if (res.status === 200) {
//       const data = await res.json();
//       if (data.status === 'completed') {
//         return data.outputs;
//       } else if (data.status === 'failed') {
//         throw new Error(data.error || 'Generation failed');
//       }
//     }
//     await new Promise(r => setTimeout(r, 1000));
//   }
// }

export default function VadooAI() {
	const [prompt, setPrompt] = useState('');
	const [activeTab, setActiveTab] = useState('generate');
	const [selectedModel, setSelectedModel] = useState('Flux Dev');
	const [aspectRatio, setAspectRatio] = useState('1:1');
	const [enhancePrompt, setEnhancePrompt] = useState(true);
	const [showStyles, setShowStyles] = useState(false);
	const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);
	const [showModelModal, setShowModelModal] = useState(false);
	const [showAspectRatioPopup, setShowAspectRatioPopup] = useState(false);
	const [customWidth, setCustomWidth] = useState('1024');
	const [customHeight, setCustomHeight] = useState('1024');
	const [showLoRAPopup, setShowLoRAPopup] = useState(false);

	const [showStylesModal, setShowStylesModal] = useState(false);
	const [selectedStyle, setSelectedStyle] = useState('None');
	const [numImages, setNumImages] = useState(1); // NEW: state for number of images
	const [loading, setLoading] = useState(false);
	const [generationStatus, setGenerationStatus] = useState('');
	const [generatedImages, setGeneratedImages] = useState([]);
	const [showApiKeyModal, setShowApiKeyModal] = useState(false);
	const [apiKeyInput, setApiKeyInput] = useState('');
	const [userApiKey, setUserApiKey] = useState('');
	const [editImage, setEditImage] = useState(null);
	const [editPrompt, setEditPrompt] = useState('');
	const [showImageUrlModal, setShowImageUrlModal] = useState(false);
	const [imageUrlInput, setImageUrlInput] = useState('');


	// Add state for selected LoRA model ID
	const [selectedLoRAModelId, setSelectedLoRAModelId] = useState("");
	// Add state for selected LoRA model name
	const [selectedLoRAName, setSelectedLoRAName] = useState("");
	// Dynamic LoRA models state
	const [fluxLoraModels, setFluxLoraModels] = useState([]);
	const [isLoadingLoraModels, setIsLoadingLoraModels] = useState(true);

	// Fetch LoRA models dynamically on component mount
	useEffect(() => {
		const fetchLoraModels = async () => {
			try {
				setIsLoadingLoraModels(true);
				const response = await fetch('/api/flux-lora-models');
				const data = await response.json();

				if (response.ok && data.models) {
					setFluxLoraModels(data.models);

					// Clear any old cached LoRA selection to force user to select from new dynamic list
					// This prevents old SDXL LoRA IDs from being used
					if (selectedLoRAModelId && !data.models.some(model => model.model_id === selectedLoRAModelId)) {
						console.log('Clearing old LoRA selection:', selectedLoRAModelId);
						setSelectedLoRAModelId("");
						setSelectedLoRAName("");
					}
				} else {
					console.error('Failed to fetch LoRA models:', data.error);
					// Fallback to empty array with "None" option
					setFluxLoraModels([{
						name: null,
						description: null,
						image_url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png",
						model_id: ""
					}]);
				}
			} catch (error) {
				console.error('Error fetching LoRA models:', error);
				// Fallback to empty array with "None" option
				setFluxLoraModels([{
					name: null,
					description: null,
					image_url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png",
					model_id: ""
				}]);
			} finally {
				setIsLoadingLoraModels(false);
			}
		};

		fetchLoraModels();
	}, []); // Run once on component mount to fetch LoRA models and clear old selections

	// Auto-switch to Flux Kontext Dev I2I when switching to edit tab
	useEffect(() => {
		if (activeTab === 'edit') {
			setSelectedModel('Flux Kontext Dev I2I');
		}
	}, [activeTab]);

	// AspectRatioPopup component (inline, replaces old modal)
	function AspectRatioPopup({ isOpen, onClose, aspectRatio, setAspectRatio, customWidth, setCustomWidth, customHeight, setCustomHeight }) {
		// Switch SVG shapes for 1:1 and 3:4
		const aspectRatios = [
			{ ratio: '1:1', shape: 'portrait', width: 32, height: 40 }, // was square, now portrait
			{ ratio: '3:4', shape: 'landscape', width: 40, height: 32, rotate: true },   // switched with 4:3, keep rotate
			{ ratio: '9:16', shape: 'portrait', width: 24, height: 40 },
			{ ratio: '16:9', shape: 'landscape', width: 40, height: 24 },
			{ ratio: '4:3', shape: 'square', width: 40, height: 40 }, // switched with 3:4, remove rotate
		];

		if (!isOpen) return null;
		return (
			<div className="fixed inset-0 z-50 flex pointer-events-none">
				{/* Sidebar spacer to ensure popup appears to the right of sidebar */}
				<div className="flex-shrink-0 w-80" />
				<div className="flex-1 flex items-start justify-start pointer-events-auto">
					<div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-[420px] max-w-[95vw] p-6 relative mt-8 ml-4 animate-fadeInRight dark-scrollbar">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-white text-lg font-medium">Aspect Ratio</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-white transition-colors"
							aria-label="Close"
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M18 6L6 18M6 6l12 12"/>
							</svg>
						</button>
					</div>
					{/* Aspect Ratio Grid */}
					<div className="grid grid-cols-3 gap-3 mb-6">
						{aspectRatios.map((item, index) => (
							<button
								key={index}
								onClick={() => { setAspectRatio(item.ratio); onClose(); }}
								className={`relative bg-gray-800 rounded-lg p-4 h-24 flex flex-col items-center justify-center transition-all border-2 ${aspectRatio === item.ratio ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700 hover:border-gray-500'}`}
							>
								<div
									className="bg-transparent border-2 border-gray-300 mb-2"
									style={{
										width: `${item.width}px`,
										height: `${item.height}px`,
										...(item.rotate ? { transform: 'rotate(90deg)' } : {}) // rotate only 4:3
									}}
								/>
								<span className="text-gray-300 text-sm font-medium">{item.ratio}</span>
							</button>
						))}
					</div>
					{/* Custom Section */}
					<div className="grid grid-cols-3 gap-3">
						<button
							onClick={() => setAspectRatio('custom')}
							className={`bg-gray-800 rounded-lg p-4 h-24 flex items-center justify-center transition-all border-2 ${aspectRatio === 'custom' ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700 hover:border-gray-500'}`}
						>
							<span className="text-gray-300 text-sm font-medium">Custom</span>
						</button>
						<div className="col-span-2 space-y-3">
							<div className="flex items-center">
								<label className="text-gray-300 text-sm w-16">Width:</label>
								<input
									type="number"
									min="1"
									value={customWidth}
									onChange={e => setCustomWidth(e.target.value)}
									className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
									disabled={aspectRatio !== 'custom'}
								/>
							</div>
							<div className="flex items-center">
								<label className="text-gray-300 text-sm w-16">Height:</label>
								<input
									type="number"
									min="1"
									value={customHeight}
									onChange={e => setCustomHeight(e.target.value)}
									className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
									disabled={aspectRatio !== 'custom'}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

	// Aspect ratio SVGs for sidebar (compressed, match grid)
	const aspectRatioSvgs = {
		'1:1': { width: 22, height: 22, rotate: false }, // make square for 1:1
		'3:4': { width: 25, height: 20, rotate: true },
		'9:16': { width: 15, height: 24, rotate: false },
		'16:9': { width: 24, height: 15, rotate: false },
		'4:3': { width: 25, height: 25, rotate: false },
	};

	// LoRA Popup Component (search only)
	const LoRAPopup = ({ isOpen, onClose }) => {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  React.useEffect(() => {
	if (!search.trim()) {
	  setResults([]);
	  setError("");
	  setLoading(false);
	  return;
	}
	setLoading(true);
	setError("");
	fetch(`/api/search-lora?keyword=${encodeURIComponent(search)}`)
	  .then(res => res.json())
	  .then(data => {
		if (data && data.results) {
		  setResults(data.results.slice(0, 5));
		} else {
		  setResults([]);
		  setError("No results found");
		}
	  })
	  .catch(() => setError("Search failed"))
	  .finally(() => setLoading(false));
  }, [search]);
  if (!isOpen) return null;
  return (
	<div className="fixed inset-0 z-50 flex pointer-events-none">
	  <div className="flex-shrink-0 w-80" />
	  <div className="flex-1 flex items-start justify-start pointer-events-auto">
		<div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-[420px] max-w-[95vw] max-h-[70vh] overflow-y-auto p-6 relative mt-8 ml-4 animate-fadeInRight dark-scrollbar-lora">
		  <button
			className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
			onClick={onClose}
		  >
			<X size={20} />
		  </button>
		  <h2 className="text-lg font-medium text-white mb-4">LoRA</h2>
		  <input
			className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700 text-white"
			placeholder="Search Civitai for LoRA models..."
			value={search}
			onChange={e => setSearch(e.target.value)}
			autoFocus
		  />
		  {loading && <div className="text-gray-400 mb-2">Searching...</div>}
		  {error && <div className="text-red-400 mb-2">{error}</div>}
		  <div className="space-y-3">
			{search.trim() && results.length > 0 ? (
			  results.map((option, idx) => {
				// Use airId from API for selection
				const model_id = option.airId;
				return (
				  <button
					key={option.id || idx}
					onClick={() => {
					  setSelectedLoRAModelId(model_id);
					  setSelectedLoRAName(option.name);
					  // Automatically set model to Flux LoRA when a LoRA is selected
					  setSelectedModel('Flux LoRA');
					  // Log the automatic model change
					  setLogMessages(logs => [...logs, `[LoRA Selected] ${option.name} - Model automatically set to Flux LoRA`]);
					  onClose();
					}}
					className={`w-full bg-gray-800 rounded-lg p-3 flex items-center space-x-3 text-left transition-all ${
					  selectedLoRAModelId === model_id
						? 'border-2 border-purple-500 shadow-lg shadow-purple-500/20'
						: 'border border-gray-700 hover:border-gray-500'
					}`}
				  >
					<div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
					  {option.image ? (
						<img
						  src={option.image}
						  alt={option.name}
						  className="w-full h-full object-cover rounded-lg"
						  onError={e => { e.target.onerror = null; e.target.src = 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png'; }}
						/>
					  ) : (
						<div className="w-full h-full bg-gray-700 rounded-lg items-center justify-center text-gray-400 text-xs flex">IMG</div>
					  )}
					</div>
					<div className="flex-1">
					  <div className="text-white font-medium text-sm">{option.name}</div>
					  {option.baseModel && (
						<div className="text-xs text-green-400 mt-1">✓ {option.baseModel}</div>
					  )}
					</div>
				  </button>
				);
			  })
			) : search.trim() && results.length === 0 ? (
			  <div className="text-gray-400 text-center py-8">
				<div className="text-lg mb-2">No results found</div>
				<div className="text-sm">Try different keywords or check spelling</div>
			  </div>
			) : (
			  <div className="text-gray-400 text-center py-8">
				<div className="text-lg mb-2">Search for LoRA models</div>
				<div className="text-sm">Enter keywords to find LoRA models from Civitai</div>
			  </div>
			)}
		  </div>
		</div>
	  </div>
	</div>
  );
};

































	// Styles options (example data)
	const aiImageStyles = [
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png', name: null },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/3d.webp', name: '3D Render' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/cartoon.webp', name: 'Cartoon' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/comic.webp', name: 'Comic' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/dark-light-dreamscape.webp', name: 'Dark Light' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/dark-sci-fi.webp', name: 'Dark Sci-Fi' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/fantasy.webp', name: 'Fantasy' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/illustration.webp', name: 'Illustration' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/low-key-cinematic.webp', name: 'Cinematic' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/nature.webp', name: 'Nature' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/oil-painting.webp', name: 'Oil Painting' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/pixel.webp', name: 'Pixel Art' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/product.webp', name: 'Product' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/retro-wave.webp', name: 'Retro' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/sketch.webp', name: 'Sketch' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/vintage-japansese.webp', name: 'Japanese' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/water-colour.webp', name: 'Watercolor' },
];

// Lighting options for Styles modal (from user)
const aiImageLighting = [
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png', name: null, description: null},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/dramatic.webp', name: 'Dramatic', description: 'High-contrast spot light direction'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/high-flash.webp', name: 'High Flash', description: 'Instant sharp bold lighting'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/iridescent.webp', name: 'Iridescent', description: 'Soft rainbow magical highlights'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/long-exposure.webp', name: 'Long Exposure', description: 'Dreamy motion-blurred light trails'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/natural.webp', name: 'Natural', description: 'Warm sunlight with glow'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/neon.webp', name: 'Neon', description: 'Vibrant electric urban colors'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/silhouette.webp', name: 'Silhouette', description: 'Backlit figure against glow'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/studio-lighting.webp', name: 'Studio', description: 'Crisp controlled portrait lighting'},
];

// Camera options for Styles modal (from user)
const aiImageCamera = [
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png', name: null, description: null},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/aerial.webp', name: 'Aerial View', description: 'Overhead landscape perspective'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/close-up.webp', name: 'Close-up', description: 'Sharp details, blurred background'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/ground-view.webp', name: 'Ground View', description: 'Extreme low worm perspective'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/low-angle.webp', name: 'Low Angle', description: 'Powerful upward dramatic view'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/mid-shot.webp', name: 'Midshot', description: 'Balanced upper body framing'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/portrait.webp', name: 'Portrait', description: 'Professional headshot, soft focus'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/tilted.webp', name: 'Tiltshot', description: 'Diagonal skewed visual composition'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/wide-shot.webp', name: 'Wide Shot', description: 'Expansive scene with context'},
];

// Styles Modal (tabbed, grid, like screenshot)
const stylesTabData = [
	{
		key: 'Styles',
		options: aiImageStyles.map(option => ({
			image: option.image,
			name: option.name === null ? 'None' : option.name
		}))
	},
	{
		key: 'Lighting',
		options: aiImageLighting.map(option => ({
			image: option.image,
			name: option.name === null ? 'None' : option.name,
	  description: option.description || ''
		}))
	},
	{
		key: 'Camera',
		options: aiImageCamera.map(option => ({
			image: option.image,
			name: option.name === null ? 'None' : option.name,
			description: option.description || ''
		}))
	}
];

	const StylesModal = ({ isOpen, onClose, selectedStyle, setSelectedStyle }) => {
  const [activeTab, setActiveTab] = useState('Styles');

  if (!isOpen) return null;
  const tab = stylesTabData.find(t => t.key === activeTab);
  const isLightingTab = activeTab === 'Lighting';
  const isCameraTab = activeTab === 'Camera';
  return (
	<div className="fixed inset-0 z-50 flex pointer-events-none">
	  <div className="flex-shrink-0 w-80" />
	  <div className="flex-1 flex items-start justify-start pointer-events-auto">
		<div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-[420px] max-w-[95vw] max-h-[70vh] overflow-y-auto p-6 relative mt-8 ml-4 animate-fadeInRight dark-scrollbar">
		  <div className="flex items-center mb-3">
			{stylesTabData.map(t => (
			  <button
				key={t.key}
				className={`text-base font-semibold px-2 py-1 mr-3 border-b-2 transition-colors ${activeTab === t.key ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-white'}`}
				onClick={() => setActiveTab(t.key)}
			  >
				{t.key}
			  </button>
			))}
			<button className="ml-auto text-gray-400 hover:text-white" onClick={onClose}><X size={20} /></button>
		  </div>
		  <div className={`${isLightingTab || isCameraTab ? 'flex flex-col gap-3' : 'grid grid-cols-3 gap-3'} max-h-[340px] overflow-y-auto pr-1`}>
			{tab.options.map(option => (
			  (isLightingTab || isCameraTab) ? (
				<button
				  key={option.name}
				  className={`flex flex-row items-center rounded-lg border border-[#3a4250] bg-[#1b2230] p-4 transition-all duration-150 focus:outline-none w-full text-left mb-4 shadow-sm hover:border-blue-400 ${selectedStyle === option.name ? 'border-blue-400 shadow-lg shadow-blue-400/10' : ''}`}
				  onClick={() => { setSelectedStyle(option.name); onClose(); }}
				>
				  <div className="w-16 h-16 flex items-center justify-center rounded bg-black overflow-hidden mr-4 flex-shrink-0">
					{option.image.includes('none.svg') ? (
					  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="#888" strokeWidth="3" /><line x1="8" y1="8" x2="24" y2="24" stroke="#888" strokeWidth="3" /></svg>
					) : (
					  <img src={option.image} alt={option.name} className="object-cover w-full h-full" />
					)}
				  </div>
				  <div className="flex flex-col flex-1 min-w-0">
					<span className={`text-base font-semibold ${selectedStyle === option.name ? 'text-blue-400' : 'text-white'}`}>{option.name}</span>
					{option.description && (
					  <span className="text-sm text-gray-400 mt-1">{option.description}</span>
					)}
				  </div>
				</button>
			  ) : (
				<button
				  key={option.name}
				  className={`flex flex-col items-center justify-center rounded-lg border-2 p-2 transition-all duration-150 focus:outline-none ${selectedStyle === option.name ? 'border-blue-400 bg-[#23242a]' : 'border-gray-700 bg-[#23242a] hover:border-blue-400'}`}
				  onClick={() => { setSelectedStyle(option.name); onClose(); }}
				>
				  <div className="w-20 h-16 flex items-center justify-center mb-1 rounded bg-black overflow-hidden">
					{option.image.includes('none.svg') ? (
					  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="#888" strokeWidth="3" /><line x1="8" y1="8" x2="24" y2="24" stroke="#888" strokeWidth="3" /></svg>
					) : (
					  <img src={option.image} alt={option.name} className="object-cover w-full h-full" />
					)}
				  </div>
				  <span className={`text-xs font-semibold ${selectedStyle === option.name ? 'text-blue-400' : 'text-white'}`}>{option.name}</span>
				</button>
			  )
			))}
		  </div>
		</div>
	  </div>
	</div>
  );
}

	// Popup open/close logic: ensure only one is open at a time
	const handleOpenModelModal = () => {
		setShowModelModal(true);
		setShowAspectRatioPopup(false);
		setShowLoRAPopup(false);
		setShowStylesModal(false);
	};
	const handleOpenAspectRatioPopup = () => {
		setShowModelModal(false);
		setShowAspectRatioPopup(true);
		setShowLoRAPopup(false);
		setShowStylesModal(false);
	};
	const handleOpenLoRAPopup = () => {
		setShowModelModal(false);
		setShowAspectRatioPopup(false);
		setShowLoRAPopup(true);
		setShowStylesModal(false);
	};

	const handleOpenStylesModal = () => {
		setShowModelModal(false);
		setShowAspectRatioPopup(false);
		setShowLoRAPopup(false);
		setShowStylesModal(true);
	};

	// Function to apply style to prompt
	const applyStyleToPrompt = (basePrompt, style) => {
		if (!style || style === 'None') {
			return basePrompt;
		}

		// Style mapping for better prompt enhancement
		const stylePrompts = {
			'3D Render': '3D rendered, high quality 3D graphics, volumetric lighting',
			'Cartoon': 'cartoon style, animated, colorful, stylized',
			'Comic': 'comic book style, comic art, graphic novel illustration',
			'Dark Light': 'dark lighting, dramatic shadows, moody atmosphere, chiaroscuro',
			'Dark Sci-Fi': 'dark sci-fi, cyberpunk, futuristic, dystopian, neon lights',
			'Fantasy': 'fantasy art, magical, mystical, ethereal, enchanted',
			'Illustration': 'digital illustration, artistic, detailed artwork',
			'Cinematic': 'cinematic lighting, movie still, dramatic composition, film photography',
			'Nature': 'natural lighting, organic, earthy tones, landscape photography',
			'Oil Painting': 'oil painting style, classical art, painterly, brushstrokes',
			'Pixel Art': 'pixel art style, 8-bit, retro gaming, pixelated',
			'Product': 'product photography, clean background, professional lighting, commercial',
			'Retro': 'retro style, vintage, nostalgic, classic aesthetic',
			'Sketch': 'pencil sketch, hand-drawn, artistic sketch, line art',
			'Japanese': 'japanese art style, anime, manga, traditional japanese aesthetics',
			'Watercolor': 'watercolor painting, soft colors, artistic, painted texture',
			'Dramatic': 'dramatic lighting, high contrast, spotlight, theatrical',
			'High Flash': 'high flash photography, sharp lighting, bright, studio flash',
			'Iridescent': 'iridescent colors, rainbow reflections, holographic, prismatic',
			'Long Exposure': 'long exposure photography, motion blur, light trails, dreamy',
			'Natural': 'natural lighting, soft sunlight, golden hour, warm tones',
			'Neon': 'neon lighting, vibrant colors, electric, glowing',
			'Silhouette': 'silhouette photography, backlit, dramatic contrast',
			'Studio': 'studio lighting, professional photography, controlled lighting',
			'Aerial View': 'aerial view, bird\'s eye perspective, overhead shot',
			'Close-up': 'close-up shot, macro photography, detailed, intimate framing',
			'Ground View': 'ground level view, worm\'s eye view, low perspective',
			'Low Angle': 'low angle shot, dramatic perspective, powerful composition',
			'Midshot': 'medium shot, balanced framing, portrait composition',
			'Portrait': 'portrait photography, headshot, professional portrait',
			'Tiltshot': 'tilted angle, dynamic composition, diagonal framing',
			'Wide Shot': 'wide shot, establishing shot, expansive view, landscape'
		};

		const stylePrompt = stylePrompts[style] || `${style.toLowerCase()} style`;
		return `${basePrompt}, ${stylePrompt}`;
	};

	// Replace the prompt submit button handler:
const [logMessages, setLogMessages] = useState([]);

async function handleGenerate() {
	if (!prompt.trim()) return;
	if (!userApiKey) {
		setShowApiKeyModal(true);
		return;
	}
	setLoading(true);
	setGenerationStatus('');
	setGeneratedImages([]);
	try {
		// Aspect ratio logic
		let width, height;
		if (aspectRatio === 'custom') {
			width = parseInt(customWidth) || 1024;
			height = parseInt(customHeight) || 1024;
		} else {
			// Parse aspect ratio string (e.g., "16:9")
			const [w, h] = aspectRatio.split(':').map(Number);
			// Use a base size (e.g., 1024 for the largest dimension)
			const base = 1024;
			if (w >= h) {
				width = base;
				height = Math.round(base * h / w);
			} else {
				height = base;
				width = Math.round(base * w / h);
			}
		}
		// Apply style to prompt if selected
		const enhancedPrompt = applyStyleToPrompt(prompt, selectedStyle);

		// Log style application
		if (selectedStyle && selectedStyle !== 'None') {
			setLogMessages(logs => [...logs, `[Style Applied] ${selectedStyle} - Enhanced prompt: ${enhancedPrompt}`]);
		}

		const payload = {
			prompt: enhancedPrompt,
			width,
			height,
			num_images: numImages || 1,
			apiKey: userApiKey,
			modelName: selectedModel,
			aspectRatio: aspectRatio === 'custom' ? `${customWidth}:${customHeight}` : aspectRatio
		};
	setLogMessages(logs => [...logs, '[Request] ' + JSON.stringify(payload, null, 2)]);
	let data = null;
	try {
	// Check if Flux LoRA model is selected
	if (selectedModel === 'Flux LoRA') {
		// Validate LoRA model selection
		if (!selectedLoRAModelId) {
			setLogMessages(logs => [...logs, 'Please select a LoRA model first.']);
			setLoading(false);
			setGenerationStatus('');
			return;
		}
		// Use LoRA generation
		data = await generateLoraImage({
			prompt: enhancedPrompt, // Use the enhanced prompt with style
			model_id: selectedLoRAModelId,
			width,
			height,
			num_images: numImages || 1,
			apiKey: userApiKey,
			onLog: (msg) => {
				console.log('[onLog callback]', msg);
				setLogMessages(logs => [...logs, msg]);
			}
		});
	} else {
		// Use regular generation
		data = await generateImage({
		  ...payload,
		  onLog: (msg) => {
			console.log('[onLog callback]', msg);
			setLogMessages(logs => [...logs, msg]);
		  }
		});
	}
		setLogMessages(logs => [...logs, '[Response] ' + JSON.stringify(data, null, 2)]);
	} catch (err) {
		setLogMessages(logs => [...logs, '[Backend Error] ' + err.message]);
		throw err;
	}
	const requestId = data.request_id;
	let result = null;
	try {
		result = await pollForResult(requestId, userApiKey, (msg) => {
			setLogMessages(logs => [...logs, msg]);
			// Update generation status for user feedback
			if (msg.includes('status:')) {
				const status = msg.split('status:')[1].trim();
				setGenerationStatus(`Status: ${status}`);
			}
		});
		setLogMessages(logs => [...logs, '[Result] ' + JSON.stringify(result, null, 2)]);
	} catch (err) {
		setLogMessages(logs => [...logs, '[Polling Error] ' + err.message]);
		throw err;
	}
	setGeneratedImages(result.outputs);
} catch (err) {
	let errorMessage = 'Image generation failed: ' + err.message;

	// Add helpful error messages for common issues
	if (err.message.includes('500')) {
		errorMessage += '\n\n💡 Common causes of 500 errors:';
		errorMessage += '\n• Invalid or missing API key';
		errorMessage += '\n• MuAPI service temporarily unavailable';
		errorMessage += '\n• Incorrect API endpoint';
		errorMessage += '\n\n🔧 Try:';
		errorMessage += '\n• Verify your API key is correct';
		errorMessage += '\n• Check MuAPI service status';
		errorMessage += '\n• Try again in a few minutes';
	}

	setLogMessages(logs => [...logs, errorMessage]);
} finally {
	setLoading(false);
	setGenerationStatus('');
}
}

	// Add a handleEditImage function with API key check
async function handleEditImage() {
	if (!prompt.trim() || !editImage) return;
	if (!userApiKey) {
		setShowApiKeyModal(true);
		return;
	}
	setLoading(true);
	setGenerationStatus('');
	setGeneratedImages([]);
	try {
		// Aspect ratio logic
		let width, height;
		if (aspectRatio === 'custom') {
			width = parseInt(customWidth) || 1024;
			height = parseInt(customHeight) || 1024;
		} else {
			// Parse aspect ratio string (e.g., "16:9")
			const [w, h] = aspectRatio.split(':').map(Number);
			// Use a base size (e.g., 1024 for the largest dimension)
			const base = 1024;
			if (w >= h) {
				width = base;
				height = Math.round(base * h / w);
			} else {
				height = base;
				width = Math.round(base * w / h);
			}
		}

		// Apply style to prompt if selected
		const enhancedPrompt = applyStyleToPrompt(prompt, selectedStyle);

		// Log style application
		if (selectedStyle && selectedStyle !== 'None') {
			setLogMessages(logs => [...logs, `[Style Applied] ${selectedStyle} - Enhanced prompt: ${enhancedPrompt}`]);
		}

		const payload = {
			prompt: enhancedPrompt,
			imageUrl: editImage,
			width,
			height,
			num_images: numImages || 1,
			apiKey: userApiKey,
			aspectRatio: aspectRatio === 'custom' ? `${customWidth}:${customHeight}` : aspectRatio
		};

		setLogMessages(logs => [...logs, '[Edit Request] ' + JSON.stringify(payload, null, 2)]);
		let data = null;
		try {
			data = await editImageAPI({
				...payload,
				onLog: (msg) => {
					console.log('[onLog callback]', msg);
					setLogMessages(logs => [...logs, msg]);
				}
			});
			setLogMessages(logs => [...logs, '[Response] ' + JSON.stringify(data, null, 2)]);
		} catch (err) {
			setLogMessages(logs => [...logs, '[Backend Error] ' + err.message]);
			throw err;
		}

		const requestId = data.request_id;
		let result = null;
		try {
			result = await pollForResult(requestId, userApiKey, (msg) => {
				console.log('[onLog callback]', msg);
				setLogMessages(logs => [...logs, msg]);
				// Update generation status for user feedback
				if (msg.includes('status:')) {
					const status = msg.split('status:')[1].trim();
					setGenerationStatus(`Status: ${status}`);
				}
			});
			setLogMessages(logs => [...logs, '[Result] ' + JSON.stringify(result, null, 2)]);
		} catch (err) {
			setLogMessages(logs => [...logs, '[Polling Error] ' + err.message]);
			throw err;
		}

		setGeneratedImages(result.outputs);
	} catch (err) {
		let errorMessage = 'Image editing failed: ' + err.message;

		// Add helpful error messages for common issues
		if (err.message.includes('500')) {
			errorMessage += '\n\n💡 Common causes of 500 errors:';
			errorMessage += '\n• Invalid or missing API key';
			errorMessage += '\n• Invalid image URL or format';
			errorMessage += '\n• MuAPI service temporarily unavailable';
			errorMessage += '\n\n🔧 Try:';
			errorMessage += '\n• Verify your API key is correct';
			errorMessage += '\n• Check that the image URL is accessible';
			errorMessage += '\n• Try again in a few minutes';
		}

		setLogMessages(logs => [...logs, errorMessage]);
	} finally {
		setLoading(false);
		setGenerationStatus('');
	}
}

	// Handle image download
	const [downloadingIndex, setDownloadingIndex] = useState(null);

	const handleDownloadImage = async (imageUrl, index) => {
		try {
			setDownloadingIndex(index);
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const filename = `ai-generated-image-${index + 1}-${timestamp}`;
			await downloadImage(imageUrl, filename);
			setLogMessages(logs => [...logs, `Image ${index + 1} downloaded successfully`]);
		} catch (error) {
			console.error('Download failed:', error);
			setLogMessages(logs => [...logs, `Download failed: ${error.message}`]);
		} finally {
			setDownloadingIndex(null);
		}
	};

	return (
		<>
	   <Head>
	   {/* Log panel at the bottom of the page */}
	   <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: '#222', color: '#fff', padding: '8px', zIndex: 1000, fontFamily: 'monospace', fontSize: '12px', maxHeight: '200px', overflowY: 'auto' }}>
		 {logMessages.map((msg, idx) => (
		   <div key={idx} style={{ whiteSpace: 'pre-wrap' }}>{msg}</div>
		 ))}
	   </div>
				<title>Vadoo AI - Image Generation</title>
				<meta name="description" content="Generate amazing images with AI" />
				<link rel="icon" href="/favicon.ico" />
			</Head>



			{/* Model Selection Modal */}
			{showModelModal && (
				<div className="fixed inset-0 z-50 flex pointer-events-none">
					{/* Sidebar spacer to ensure popup appears to the right of sidebar */}
					<div className="flex-shrink-0 w-80" />
					<div className="flex-1 flex items-start justify-start pointer-events-auto">
						<div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-[900px] max-w-[85vw] max-h-[80vh] overflow-y-auto p-8 relative mt-8 ml-4 animate-fadeInRight dark-scrollbar">
							<button
								className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
								onClick={() => setShowModelModal(false)}
							>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M18 6L6 18M6 6l12 12"/>
								</svg>
							</button>
							<div className="mb-8">
							  <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Select Model</h2>
							  <p className="text-slate-400">Choose the AI model that best fits your creative vision</p>
							</div>
							<div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
								{fluxModels.filter(model => model.name !== 'Flux Kontext Dev I2I').map((model) => (
									<div
										key={model.id}
										className={`rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
											selectedModel === model.name
												? 'border-purple-400 bg-purple-500/10 shadow-xl shadow-purple-500/25'
												: 'border-white/20 bg-white/5 hover:border-purple-400 hover:bg-white/10'
										}`}
										onClick={() => {
											if (selectedModel !== model.name) {
												setSelectedModel(model.name);
											}
											setShowModelModal(false);
										}}
									>
										<div className="h-40 w-full relative rounded-t-2xl overflow-hidden">
											<img src={model.image} alt={model.name} className="object-cover w-full h-full" />
											<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
											{selectedModel === model.name && (
											  <div className="absolute top-3 right-3 bg-purple-500 text-white p-2 rounded-full shadow-lg">
												<svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
												  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
											  </div>
											)}
										</div>
										<div className="p-4">
											<h3 className="font-bold text-lg mb-2 text-white">{model.name}</h3>
											<p className="text-sm text-slate-400 leading-relaxed">{model.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* API Key Modal */}
	{showApiKeyModal && (
	  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeInScale">
		<div className="glass-strong border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fadeInUp">
		  <div className="text-center mb-6">
			<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center">
			  <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
			  </svg>
			</div>
			<h2 className="text-2xl font-bold text-white mb-2">Enter API Key</h2>
			<p className="text-slate-400">Secure access to AI image generation</p>
		  </div>

		  <input
			type="password"
			className="w-full p-4 rounded-xl glass border border-white/20 text-white mb-4 placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
			placeholder="Enter your API key..."
			value={apiKeyInput}
			onChange={e => setApiKeyInput(e.target.value)}
			onKeyDown={(e) => {
			  if (e.key === 'Enter' && apiKeyInput.trim()) {
				setUserApiKey(apiKeyInput);
				setShowApiKeyModal(false);
			  }
			}}
		  />

		  <div className="glass border border-white/10 rounded-xl p-4 mb-6">
			<p className="text-sm text-slate-300 mb-2 flex items-center">
			  <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			  </svg>
			  Don't have an API key?
			</p>
			<a
			  href="https://muapi.ai/"
			  target="_blank"
			  rel="noopener noreferrer"
			  className="text-purple-400 hover:text-purple-300 underline text-sm font-medium"
			>
			  Get it from https://muapi.ai/ →
			</a>
		  </div>

		  <div className="flex gap-3">
			<button
			  className="flex-1 px-6 py-3 rounded-xl glass border border-white/20 text-white hover:bg-white/10 transition-all font-medium"
			  onClick={() => setShowApiKeyModal(false)}
			>
			  Cancel
			</button>
			<button
			  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all font-semibold shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
			  onClick={() => {
				setUserApiKey(apiKeyInput);
				setShowApiKeyModal(false);
			  }}
			  disabled={!apiKeyInput.trim()}
			>
			  Continue
			</button>
		  </div>
		</div>
	  </div>
	)}

			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white flex relative overflow-hidden">
				{/* Background Effects */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

				{/* Sidebar - scrollable */}
				<div className="w-80 glass-strong p-6 space-y-6 border-r border-white/10 min-h-screen max-h-screen overflow-y-auto overflow-x-hidden sidebar-scrollbar relative z-10">
					{/* Sidebar Header */}
	<div className="flex items-center justify-center mb-8">
	  <div className="p-3 rounded-2xl glass border border-white/10">
		<img
		  src="/vadoo-logo-white.png"
		  alt="Vadoo AI"
		  className="h-8 w-auto"
		/>
	  </div>
	</div>
	{/* General Settings */}
	<div className="space-y-6">
	  <div className="flex items-center justify-between">
		<h3 className="text-sm font-semibold text-purple-200 uppercase tracking-wider flex items-center">
		  <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
		  </svg>
		  General Settings
		</h3>
	  </div>
	  {/* Model Selection */}
	  <div className="space-y-3">
		<label className="text-sm text-slate-300 font-medium flex items-center">
		  <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
		  </svg>
		  Model
		</label>
		<button
		  type="button"
		  onClick={activeTab === 'edit' ? undefined : handleOpenModelModal}
		  disabled={activeTab === 'edit'}
		  className={`w-full glass border border-white/20 rounded-xl px-4 py-3 text-white text-left flex items-center justify-between transition-all duration-200 group ${
			activeTab === 'edit'
			  ? 'cursor-not-allowed opacity-60'
			  : 'cursor-pointer hover:bg-white/10'
		  } ${showModelModal ? 'ring-2 ring-purple-400 bg-white/10' : ''}`}
		  aria-pressed={showModelModal}
		>
		  <div className="flex items-center gap-3">
			<div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/30">
			  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-300">
				<polygon points="12,3 21,8.25 21,15.75 12,21 3,15.75 3,8.25" stroke="currentColor" strokeWidth="2" fill="none"/>
				<line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
				<line x1="3" y1="8.25" x2="12" y2="13.5" stroke="currentColor" strokeWidth="2"/>
				<line x1="21" y1="8.25" x2="12" y2="13.5" stroke="currentColor" strokeWidth="2"/>
			  </svg>
			</div>
			<div className="flex items-center gap-2">
			  <span className="font-medium">{selectedModel}</span>
			  {activeTab === 'edit' && (
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400">
				  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
				  <circle cx="12" cy="16" r="1"/>
				  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
				</svg>
			  )}
			</div>
		  </div>
		  {activeTab !== 'edit' && (
			<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-slate-400 group-hover:text-white transition-all duration-200" style={{ transform: showModelModal ? 'rotate(90deg)' : 'rotate(0deg)' }}>
			  <path d="M10 8L6 4v8l4-4z" />
			</svg>
		  )}
		</button>
	  </div>
	  {/* Aspect Ratio */}
	  <div className="space-y-3">
		<label className="text-sm text-slate-300 font-medium flex items-center">
		  <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
		  </svg>
		  Aspect Ratio
		</label>
		<button
		  type="button"
		  onClick={handleOpenAspectRatioPopup}
		  className="w-full glass border border-white/20 rounded-xl px-4 py-3 text-white text-left flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all duration-200 group"
		>
		  <div className="flex items-center gap-3">
			<div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
			  <svg
				width={Math.min(aspectRatioSvgs[aspectRatio]?.width || 16, 16)}
				height={Math.min(aspectRatioSvgs[aspectRatio]?.height || 16, 16)}
				viewBox={`0 0 ${aspectRatioSvgs[aspectRatio]?.width || 16} ${aspectRatioSvgs[aspectRatio]?.height || 16}`}
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-blue-300"
				style={aspectRatioSvgs[aspectRatio]?.rotate ? { transform: 'rotate(90deg)' } : {}}
			  >
				<rect
				  x="1"
				  y="1"
				  width={(aspectRatioSvgs[aspectRatio]?.width || 16) - 2}
				  height={(aspectRatioSvgs[aspectRatio]?.height || 16) - 2}
				  rx="2"
				  stroke="currentColor"
				  strokeWidth="2"
				/>
			  </svg>
			</div>
			<span className="font-medium">
			  {aspectRatio === 'custom' && customWidth && customHeight ? `${customWidth}:${customHeight}` : aspectRatio}
			</span>
		  </div>
		  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-slate-400 group-hover:text-white transition-all duration-200" style={{ transform: showAspectRatioPopup ? 'rotate(90deg)' : 'rotate(0deg)' }}>
			<path d="M10 8L6 4v8l4-4z" />
		  </svg>
		</button>
	  </div>
	  {/* LoRA */}
	  <div className="space-y-3">
		<label className="text-sm text-slate-300 font-medium flex items-center">
		  <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
		  </svg>
		  LoRA
		</label>
		<div className="w-full glass border border-white/20 rounded-xl px-4 py-3 text-white hover:bg-white/10 transition-all duration-200 group flex items-center justify-between">
		  <div
			className="flex items-center gap-3 flex-1 cursor-pointer"
			onClick={handleOpenLoRAPopup}
		  >
			<div className="p-2 rounded-lg bg-green-500/20 border border-green-400/30">
			  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-300">
				<rect x="3" y="3" width="18" height="6" rx="2"/>
				<rect x="3" y="9" width="18" height="6" rx="2"/>
				<rect x="3" y="15" width="18" height="6" rx="2"/>
			  </svg>
			</div>
			<span className="font-medium flex-1">{selectedLoRAName || 'Add LoRA'}</span>
		  </div>
		  <div className="flex items-center gap-2">
			{selectedLoRAName && (
			  <button
				onClick={() => {
				  setSelectedLoRAModelId("");
				  setSelectedLoRAName("");
				  setSelectedModel('Flux Dev'); // Reset to default model
				}}
				className="p-1 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
				title="Remove LoRA"
			  >
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				  <path d="M18 6L6 18M6 6l12 12"/>
				</svg>
			  </button>
			)}
			<div
			  className="cursor-pointer p-1"
			  onClick={handleOpenLoRAPopup}
			>
			  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-slate-400 group-hover:text-white transition-all duration-200" style={{ transform: showLoRAPopup ? 'rotate(90deg)' : 'rotate(0deg)' }}>
				<path d="M10 8L6 4v8l4-4z" />
			  </svg>
			</div>
		  </div>
		</div>
	  </div>

	</div>
	{/* Styles Section */}
	<div className="space-y-3">
	  <label className="text-sm text-slate-300 font-medium flex items-center">
		<svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z"></path>
		</svg>
		Styles
	  </label>
	  <button
		className="w-full glass border border-white/20 rounded-xl px-4 py-3 text-left text-white hover:bg-white/10 transition-all duration-200 group"
		onClick={handleOpenStylesModal}
	  >
		<div className="flex items-center justify-between">
		  <div className="flex items-center gap-3">
			<div className="p-2 rounded-lg bg-pink-500/20 border border-pink-400/30">
			  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="16" width="16" className="text-pink-300">
				<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
				<circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
				<circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
				<circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
				<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
			  </svg>
			</div>
			<span className="font-medium">{selectedStyle}</span>
		  </div>
		  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-slate-400 group-hover:text-white transition-all duration-200" style={{ transform: showStylesModal ? 'rotate(90deg)' : 'rotate(0deg)' }}>
			<path d="M10 8L6 4v8l4-4z" />
		  </svg>
		</div>
	  </button>
	</div>
	{/* Additional Settings */}
	<div className="space-y-3">
	  <button 
		onClick={() => setShowAdditionalSettings(!showAdditionalSettings)}
		className="flex items-center justify-between w-full text-left group"
	  >
		<span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Additional Settings</span>
		<svg 
		  width="16" 
		  height="16" 
		  viewBox="0 0 16 16" 
		  fill="currentColor" 
		  className={`text-gray-400 group-hover:text-white transition-all duration-200 ${showAdditionalSettings ? 'rotate-90' : ''}`}
		>
		  <path d="M6 4l4 4-4 4V4z"/>
		</svg>
	  </button>
	  {showAdditionalSettings && (
		<div className="pl-6 space-y-4 animate-fadeIn">
		  {/* Number of Images Dropdown */}
		  <div>
			<label className="block text-sm text-gray-300 font-medium mb-2">Number of Images</label>
			<div className="flex gap-2">
			  {[1,2,3,4].map(num => (
				<button
				  key={num}
				  className={`w-12 h-10 rounded-md border bg-[#181A20] text-white text-lg font-semibold transition-all duration-150 focus:outline-none ${numImages === num ? 'border-blue-400 ring-2 ring-blue-400' : 'border-[#23242a] hover:border-blue-400'}`}
				  onClick={() => setNumImages(num)}
				  type="button"
				>
				  {num}
				</button>
			  ))}
			</div>
		  </div>
		  {/* ...other additional settings... */}
		</div>
	  )}
	</div>
  </div>
  {/* Main Content - fixed, does not scroll */}
  <div className="flex-1 p-8 min-h-screen overflow-hidden relative z-10">
	{/* Tab Navigation */}
	<div className="flex space-x-1 mb-8 glass-strong p-1 rounded-2xl w-fit border border-white/10">
	  <button
		onClick={() => setActiveTab('generate')}
		className={`px-4 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2 overflow-hidden ${
		  activeTab === 'generate'
			? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/20'
			: 'text-slate-300 hover:text-white hover:bg-white/10'
		}`}
	  >
		<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
		</svg>
		Generate Image
	  </button>
	  <button
		onClick={() => setActiveTab('edit')}
		className={`px-4 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2 overflow-hidden ${
		  activeTab === 'edit'
			? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/20'
			: 'text-slate-300 hover:text-white hover:bg-white/10'
		}`}
	  >
		<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
		</svg>
		Edit Image
	  </button>
	</div>

	{/* Main Generation Area */}
	<div className="max-w-5xl mx-auto">
	  {/* Image Preview Area */}
	  <div className="glass-strong rounded-3xl p-12 mb-8 min-h-96 flex items-center justify-center border border-white/10 relative overflow-hidden shadow-2xl">
		<div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-pink-600/10"></div>
		<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
		<div className="text-center text-slate-400 relative z-10 w-full">
		  {loading ? (
			<div className="flex flex-col items-center justify-center space-y-6 animate-fadeInUp">
			  {/* Enhanced animated spinner */}
			  <div className="relative">
				{/* Outer ring */}
				<div className="w-20 h-20 border-4 border-purple-200/30 rounded-full"></div>
				{/* Spinning gradient ring */}
				<div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin"></div>
				{/* Inner pulsing circle */}
				<div className="absolute inset-3 w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full animate-pulse border border-purple-400/30"></div>
				{/* Center icon */}
				<div className="absolute inset-0 flex items-center justify-center">
				  <svg className="w-8 h-8 text-purple-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
				  </svg>
				</div>
			  </div>

			  {/* Loading text with gradient */}
			  <div className="text-center">
				<div className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
				  Generating image...
				</div>
				<div className="text-slate-300 mb-4">
				  {generationStatus || 'This may take a few moments'}
				</div>
			  </div>

			  {/* Enhanced animated dots */}
			  <div className="flex space-x-2">
				<div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50" style={{ animationDelay: '0ms' }}></div>
				<div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50" style={{ animationDelay: '150ms' }}></div>
				<div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50" style={{ animationDelay: '300ms' }}></div>
			  </div>

			  {/* Progress bar */}
			  <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
				<div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
			  </div>
			</div>
		  ) : generatedImages.length > 0 ? (
			<div className="flex flex-wrap justify-center gap-8 animate-fadeInUp">
			  {generatedImages.map((url, i) => (
				<div key={i} className="relative group">
				  {/* Card container with shadow and border */}
				  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
					{/* Image */}
					<div className="relative overflow-hidden">
					  <img
						src={url}
						alt={`Generated image ${i + 1}`}
						className="max-h-96 object-cover w-full"
					  />

					  {/* Image number badge */}
					  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-full border border-white/20">
						#{i + 1}
					  </div>
					</div>

					{/* Action buttons */}
					<div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4">
					  {/* Download button */}
					  <button
						onClick={() => handleDownloadImage(url, i)}
						disabled={downloadingIndex === i}
						className="glass-strong hover:bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-200 flex items-center gap-2 font-medium border border-white/20 shadow-lg"
						title={downloadingIndex === i ? "Downloading..." : "Download image"}
					  >
						{downloadingIndex === i ? (
						  <>
							<svg
							  width="16"
							  height="16"
							  viewBox="0 0 24 24"
							  fill="none"
							  stroke="currentColor"
							  strokeWidth="2"
							  className="animate-spin"
							>
							  <path d="M21 12a9 9 0 11-6.219-8.56"/>
							</svg>
							<span>Saving...</span>
						  </>
						) : (
						  <>
							<svg
							  width="16"
							  height="16"
							  viewBox="0 0 24 24"
							  fill="none"
							  stroke="currentColor"
							  strokeWidth="2"
							  strokeLinecap="round"
							  strokeLinejoin="round"
							>
							  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
							  <polyline points="7,10 12,15 17,10"/>
							  <line x1="12" y1="15" x2="12" y2="3"/>
							</svg>
							<span>Download</span>
						  </>
						)}
					  </button>

					  {/* Use as base for edit button (only show if in generate tab) */}
					  {activeTab === 'generate' && (
						<button
						  onClick={() => {
							setEditImage(url);
							setActiveTab('edit');
						  }}
						  className="glass-strong hover:bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-200 flex items-center gap-2 font-medium border border-white/20 shadow-lg"
						>
						  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
						  </svg>
						  <span>Edit</span>
						</button>
					  )}
					</div>
				  </div>
				</div>
			  ))}
			</div>
		  ) : (
			<div className="animate-fadeInUp">
			  <div className="mb-6">
				<svg className="w-20 h-20 mx-auto mb-4 text-purple-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
				</svg>
			  </div>
			  <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Create Amazing Images</h3>
			  <p className="text-slate-300 mb-2 text-lg">Your AI-generated masterpiece will appear here</p>
			  <p className="text-sm text-slate-400">Enter a detailed prompt below to get started</p>
			</div>
		  )}
		</div>
	  </div>

	  {/* Prompt Input with Upload Button (only in Edit tab) */}
	  <div className="relative mb-4">
		{activeTab === 'edit' && (
		  <div className="flex items-center mb-4">
			{/* Enhanced upload button */}
			<button
			  type="button"
			  className="cursor-pointer glass-strong border border-white/20 rounded-xl px-6 py-3 text-white font-semibold transition-all duration-200 hover:bg-white/10 hover:border-white/30 mr-4 shadow-lg flex items-center gap-2 hover:scale-105"
			  onClick={() => setShowImageUrlModal(true)}
			>
			  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
			  </svg>
			  {editImage ? 'Change Image' : 'Upload Image'}
			</button>
			{editImage && (
			  <div className="relative group">
				<img src={editImage} alt="To Edit" className="rounded-xl h-12 w-12 object-cover border border-white/20 shadow-lg transition-transform duration-200 group-hover:scale-110" />
				<div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
				  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
				  </svg>
				</div>
			  </div>
			)}
		  </div>
		)}

		{/* Enhanced Image URL Modal */}
		{showImageUrlModal && (
		  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeInScale">
			<div className="glass-strong border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fadeInUp">
			  <div className="text-center mb-6">
				<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center">
				  <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
				  </svg>
				</div>
				<h2 className="text-2xl font-bold text-white mb-2">Add Image URL</h2>
				<p className="text-slate-400">Provide a direct link to the image you want to edit</p>
			  </div>

			  <input
				type="text"
				className="w-full p-4 rounded-xl glass border border-white/20 text-white mb-6 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
				placeholder="https://example.com/image.jpg"
				value={imageUrlInput}
				onChange={e => setImageUrlInput(e.target.value)}
				onKeyDown={(e) => {
				  if (e.key === 'Enter' && imageUrlInput.trim()) {
					setEditImage(imageUrlInput);
					setShowImageUrlModal(false);
					setImageUrlInput("");
				  }
				}}
			  />

			  <div className="flex gap-3">
				<button
				  className="flex-1 px-6 py-3 rounded-xl glass border border-white/20 text-white hover:bg-white/10 transition-all font-medium"
				  onClick={() => setShowImageUrlModal(false)}
				>
				  Cancel
				</button>
				<button
				  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
				  onClick={() => {
					setEditImage(imageUrlInput);
					setShowImageUrlModal(false);
					setImageUrlInput("");
				  }}
				  disabled={!imageUrlInput.trim()}
				>
				  Add Image
				</button>
			  </div>
			</div>
		  </div>
		)}

		<div className="flex flex-col w-full">
			{/* Indicators for active settings */}
			<div className="flex flex-wrap gap-2 mb-2">
				{/* Style indicator */}
				{selectedStyle && selectedStyle !== 'None' && (
					<div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs inline-flex items-center gap-2">
						<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14">
							<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
							<circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
							<circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
							<circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
							<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
						</svg>
						<span>Style: {selectedStyle}</span>
						<button
							onClick={() => setSelectedStyle('None')}
							className="ml-1 hover:bg-red-500/20 rounded-full p-0.5 text-blue-400 hover:text-red-400 transition-colors"
							title="Remove style"
						>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M18 6L6 18M6 6l12 12"/>
							</svg>
						</button>
					</div>
				)}

				{/* LoRA indicator */}
				{selectedLoRAModelId && selectedLoRAName && (
					<div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 text-xs inline-flex items-center gap-2">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<rect x="3" y="3" width="18" height="6" rx="2"/>
							<rect x="3" y="9" width="18" height="6" rx="2"/>
							<rect x="3" y="15" width="18" height="6" rx="2"/>
						</svg>
						<span>LoRA: {selectedLoRAName}</span>
						<button
							onClick={() => {
								setSelectedLoRAModelId("");
								setSelectedLoRAName("");
								setSelectedModel('Flux Dev'); // Reset to default model
							}}
							className="ml-1 hover:bg-red-500/20 rounded-full p-0.5 text-purple-400 hover:text-red-400 transition-colors"
							title="Remove LoRA"
						>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M18 6L6 18M6 6l12 12"/>
							</svg>
						</button>
					</div>
				)}
			</div>

			<div className="flex items-center space-x-4 glass-strong rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 shadow-lg">
				<div className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30">
					<svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
					</svg>
				</div>
				<input
					type="text"
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder={activeTab === 'edit' && editImage ? "Describe how you want to edit the image..." : "Describe your creative vision in detail..."}
					className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg font-medium"
					onKeyDown={(e) => {
					  if (e.key === 'Enter' && !loading && prompt.trim() && (activeTab !== 'edit' || editImage)) {
						activeTab === 'edit' ? handleEditImage() : handleGenerate();
					  }
					}}
				/>
				<button
			type="button"
			className={`flex items-center justify-center gap-2 ${
			  loading
				? 'bg-gradient-to-r from-purple-600 to-purple-700 cursor-not-allowed'
				: prompt.trim() && (activeTab !== 'edit' || editImage)
				  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:scale-105 shadow-lg shadow-purple-500/25'
				  : 'bg-slate-600 cursor-not-allowed'
			} text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200`}
			onClick={activeTab === 'edit' ? handleEditImage : handleGenerate}
			disabled={loading || !prompt.trim() || (activeTab === 'edit' && !editImage)}
		  >
			{loading ? (
			  <>
				<svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				  <path d="M21 12a9 9 0 11-6.219-8.56" />
				</svg>
				<span>Generating...</span>
			  </>
			) : (
			  <>
				<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="18" width="18">
				  <path d="M1 1.91L1.78 1.5L15 7.44899V8.3999L1.78 14.33L1 13.91L2.58311 8L1 1.91ZM3.6118 8.5L2.33037 13.1295L13.5 7.8999L2.33037 2.83859L3.6118 7.43874L9 7.5V8.5H3.6118Z"></path>
				</svg>
				<span>{activeTab === 'edit' ? 'Edit' : 'Generate'}</span>
			  </>
			)}
				</button>
			</div>
		</div>
	  </div>
	</div>
  </div>
</div>

{/* Remove scrollbar from homepage (main background) */}
<style jsx global>{`
  /* Remove homepage scrollbar hiding rules */
  html,
  body,
  .min-h-screen.bg-gray-900\/50 {
	scrollbar-width: auto !important;
	-ms-overflow-style: auto !important;
  }
  html::-webkit-scrollbar,
  body::-webkit-scrollbar,
  .min-h-screen.bg-gray-900\/50::-webkit-scrollbar {
	display: initial !important;
	width: initial !important;
	background: initial !important;
  }

  /* Sidebar dark scrollbar */
  .sidebar-scrollbar {
	scrollbar-width: thin !important;
	scrollbar-color: #23242a #181A20 !important;
	-ms-overflow-style: auto !important;
	overflow-y: auto !important;
  }
  .sidebar-scrollbar::-webkit-scrollbar {
	width: 8px !important;
	background: #181A20 !important;
	display: block !important;
  }
  .sidebar-scrollbar::-webkit-scrollbar-thumb {
	background: #23242a !important;
	border-radius: 8px !important;
	border: 2px solid #181A20 !important;
	transition: background 0.2s;
  }
  .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #7c3aed !important;
  }
  .sidebar-scrollbar::-webkit-scrollbar-corner {
	background: #181A20 !important;
  }

  /* Keep dark scrollbars for popups only */
  .dark-scrollbar,
  .dark-scrollbar-lora {
	scrollbar-width: thin !important;
	scrollbar-color: #23242a #181A20 !important;
	-ms-overflow-style: auto !important;
	overflow: auto !important;
  }
  .dark-scrollbar::-webkit-scrollbar,
  .dark-scrollbar-lora::-webkit-scrollbar {
	width: 8px !important;
	background: #181A20 !important;
	display: block !important;
  }
  .dark-scrollbar::-webkit-scrollbar-thumb,
  .dark-scrollbar-lora::-webkit-scrollbar-thumb {
	background: #23242a !important;
	border-radius: 8px !important;
	border: 2px solid #181A20 !important;
	transition: background 0.2s;
  }
  .dark-scrollbar::-webkit-scrollbar-thumb:hover,
  .dark-scrollbar-lora::-webkit-scrollbar-thumb:hover {
	background: #7c3aed !important;
  }
  .dark-scrollbar::-webkit-scrollbar-corner,
  .dark-scrollbar-lora::-webkit-scrollbar-corner {
	background: #181A20 !important;
  }
`}</style>

			{/* Aspect Ratio Popup */}
			<AspectRatioPopup
				isOpen={showAspectRatioPopup}
				onClose={() => setShowAspectRatioPopup(false)}
				aspectRatio={aspectRatio}
				setAspectRatio={setAspectRatio}
				customWidth={customWidth}
				setCustomWidth={setCustomWidth}
				customHeight={customHeight}
				setCustomHeight={setCustomHeight}
			/>

		
			{/* LoRA Popup */}
			<LoRAPopup isOpen={showLoRAPopup} onClose={() => setShowLoRAPopup(false)} />



			{/* Styles Modal */}
			<StylesModal isOpen={showStylesModal} onClose={() => setShowStylesModal(false)} selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} />
		</>
	);
}