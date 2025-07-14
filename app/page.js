"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import { X, Plus, Slash } from 'lucide-react';
import { generateImage, pollForResult, generateLoraImage, downloadImage } from './lib/muapi';

export const fluxModels = [
	{
		id: "schnell",
		name: "Flux Schnell",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/230967527308/d65c9c50-3604-43fe-9255-92685a84c91d.jpg",
		description: "High-quality images from text in 1 to 4 steps",
		duration: 5,
		credits: 2,
		num: 4
	},
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
		id: "pro",
		name: "Flux Pro v1.1",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/420959112663/960e8ada-f6d9-4894-9ca1-8cf2436e47c8.jpg",
		description: "Professional version with enhanced capabilities",
		isPro: true,
		duration: 25,
		credits: 12,
		num: 1
	},
	{
		id: "ultra",
		name: "Flux Pro Ultra v1.1",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/411267126627/fd2e347d-e308-45c5-abfe-c5e9ac49b99c.jpg",
		description: "Ultimate version with maximum quality",
		isPro: true,
		duration: 30,
		credits: 18,
		num: 1
	},
	{
		id: "bytedance",
		name: "Seedream-v3",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/958012868787/9ae11fa2-2ed6-412f-8834-e4e437bdfb04.jpg",
		description: "It transforms text into vivid images with remarkable details.",
		duration: 10,
		credits: 5,
		num: 1
	},
	{
		id: "kontext",
		name: "Flux Kontext",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/379496223892/f81495f7-de22-4579-bc46-91fd8f90f3f3.jpg",
		description: "It delivers state-of-the-art image generation results",
		isPro: true,
		duration: 10,
		credits: 8,
		num: 1
	},
	{
		id: "recraft",
		name: "Recraft-v3",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/profile_images/186/699675542299/phYdzaZKutHgEIdAqguSd_image.webp",
		description: "Recraft-v3 generate vector art, images in brand style and more",
		duration: 10,
		credits: 15,
		num: 1
	},
	{
		id: "minimax",
		name: "Minimax/Hailuoai",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/304342023192/b9b55144-03de-424a-918b-d6dcd12fa0a4.jpg",
		description: "Longer text prompts will result in better quality images.",
		isPro: true,
		duration: 10,
		credits: 12,
		num: 2
	},
	{
		id: "imagen3",
		name: "Google Imagen 3",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/781515889759/1647c937-a447-40e1-9d16-365d6bfe0c4b.jpg",
		description: "Google's advanced AI image generation model",
		isPro: true,
		duration: 10,
		credits: 6,
		num: 2
	},
	{
		id: "imagen4",
		name: "Google Imagen 4",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/153202992159/a9ce2d81-ffd3-41b4-9742-93a497c2e105.jpg",
		description: "Google’s highest quality image generation model",
		isPro: true,
		duration: 10,
		credits: 10,
		num: 2
	},
	{
		id: "midjourney",
		name: "Midjourney v7",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/403104061561/77e7a150-d68d-4c03-b18e-bcb177c93f1b.jpg",
		description: "Midjorney v7 generates 4 unique images",
		duration: 10,
		credits: 6,
		num: 4
	},
	{
		id: "ideogram",
		name: "Ideogram v3",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/495423469201/b7c44c4a-c6c5-4a39-93f2-663047f9bed5.jpg",
		description: "High quality images with accurate text rendering",
		isPro: true,
		duration: 30,
		credits: 12,
		num: 1
	},
	{
		id: "gpt",
		name: "GPT-Image-1",
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/166725730729/e2fc912f-9394-44b7-a9c2-eaac178f7c27.jpg",
		description: "This multimodal AI that seamlessly understands and generates images.",
		isPro: true,
		duration: 30,
		credits: 12,
		num: 1
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
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/325703928897/e3f3bcbc-c6ef-46de-9639-2fb7498eabad.jpg",
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
		image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/528394751829/b4c8e9f2-7a3d-4e8b-9f6c-1d2e3f4a5b6c.jpg",
		description: "Flux Kontext development model for text-to-image generation (auto dimensions)",
		duration: 12,
		credits: 6,
		num: 1
	},
];

export const fluxLoraModels = [
	{
		"name": null,
		"description": null,
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png",
		"model_id": ""
	},
	{
		"name": "Midjourney V6.1 meets FLUX",
		"description": "This Lora was trained with 34 Midjourney V6.1 images. Use aidmaMJ6.1 to trigger the Lora.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/99c13c70-da0e-11ef-9691-99c5509aa859.jpg",
		"model_id": "civitai:119351@317153"
	},
	{
		"name": "Flux Realism",
		"description": "Photorealistic model for hyper-realistic images.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/b30725e0-da00-11ef-9691-99c5509aa859.jpg",
		"model_id": "civitai:119352@317153"
	},
	{
		"name": "60s Psychedelic Movie",
		"description": "Mimics 60s psychedelic movie stills. Trigger: ArsMovieStill, movie still from a 60s psychedelic movie.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/2bee9f10-d7d1-11ef-86d4-957396b21e70.jpg",
		"model_id": "civitai:119353@317153"
	},
	{
		"name": "Organic Sauce",
		"description": "Blends charcoal sketches, watercolor, and hand-drawn styles for a non-anime aesthetic.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/793f1780-d778-11ef-b1af-3332a68f86bd.jpg",
		"model_id": "civitai:119354@317153"
	},
	{
		"name": "Amateur Photography",
		"description": "Simulates casual iPhone/low-quality camera photos.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/a6bcb8a0-d70c-11ef-8fd6-9bd833a3e0c8.jpg",
		"model_id": "civitai:119355@317153"
	},
	{
		"name": "Vintage Anime",
		"description": "Retro anime style from the 1970s-1990s with muted colors and bold outlines.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/23d16660-d6c2-11ef-a2c8-4334694e75d5.jpg",
		"model_id": "civitai:119356@317153"
	},
	{
		"name": "Retro Anime Flux",
		"description": "Captures Midjourney-generated retro anime. No trigger word required.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/62377130-d779-11ef-818d-81383a410a43.jpg",
		"model_id": "civitai:119357@317153"
	},
	{
		"name": "ILLUSTRATION",
		"description": "Cartoonish/illustration style for artistic fictional looks.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/79bd6fc0-d3c9-11ef-bdec-fb6822ccf241.jpg",
		"model_id": "civitai:119358@317153"
	},
	{
		"name": "Claymation",
		"description": "Creates clay animation stills. Trigger: claymation.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/40a86310-d3c5-11ef-bdec-fb6822ccf241.jpg",
		"model_id": "civitai:119359@317153"
	},
	{
		"name": "Convenience store CCTV",
		"description": "Trained on 450+ CCTV frames. Trigger: StoreCCTV (strength ≥1.5).",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/ef8f4499-811c-6672-a314-8ee0a1faf72d.jpeg",
		"model_id": "civitai:119360@317153"
	},
	{
		"name": "80s Fantasy Movie",
		"description": "Emulates early 80s fantasy movies. Trigger: ArsMovieStill, 80s Fantasy Movie Still.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/78017490-d49d-11ef-a125-37bcaa0f7ea4.jpg",
		"model_id": "civitai:119361@317153"
	},
	{
		"name": "LET ME SEE YOUR GRILLZ FLUX",
		"description": "Trained on 'iced out' jewelry. Trigger: GR!LLZ, SMILE (strength 0.7-0.9).",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/3de68800-d546-11ef-b428-6f2a79e2fb35.jpg",
		"model_id": "civitai:119362@317153"
	},
	{
		"name": "Boss Battle",
		"description": "Inspired by Dark Souls, Elden Ring, and COD Zombies.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/8e5def60-7247-11ef-b942-c3ed7e429df5.mp4",
		"model_id": "civitai:119363@317153"
	},
	{
		"name": "Boring Reality",
		"description": "No description provided.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/d1c14f60-7efc-11ef-80c5-5554da8c130d.mp4",
		"model_id": "civitai:119364@317153"
	},
	{
		"name": "1999 Camera Style",
		"description": "Emulates the Olympus D-450 Zoom (1999) for nostalgic, retro visuals.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/cad3f800-db5f-11ef-84be-7d58ca7aafd5.jpg",
		"model_id": "civitai:119365@317153"
	},
	{
		"name": "Vintage Photo",
		"description": "Recreates old photos with washed-out colors or B&W.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/bbad3780-716d-11ef-9671-67bd79b65756.mp4",
		"model_id": "civitai:119366@317153"
	},
	{
		"name": "Dark Comic",
		"description": "Combines graphic novels and horror aesthetics.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/0dbb57c0-72c5-11ef-a7f6-43bf4b58bf5d.mp4",
		"model_id": "civitai:119367@317153"
	},
	{
		"name": "Hard Edge Pixel Art",
		"description": "Pixel art style. Trigger: pixel art.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/ecce8b70-7131-11ef-8d4f-a3a50b8763ad.mp4",
		"model_id": "civitai:119368@317153"
	},
	{
		"name": "VHS Style",
		"description": "Retro 90s VHS effect.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/ac8d91f0-da2c-11ef-8b06-63fc00fa1e69.jpg",
		"model_id": "civitai:119369@317153"
	},
	{
		"name": "3D Render",
		"description": "High-quality 3D renderings.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/fbcd02f0-70f5-11ef-91b1-1358266f04dc.mp4",
		"model_id": "civitai:119370@317153"
	},
	{
		"name": "Moody Photo Style",
		"description": "Analog 35mm film for moody realism.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/6d6e6940-718b-11ef-b7b6-85558717b410.mp4",
		"model_id": "civitai:119371@317153"
	},
	{
		"name": "Cyberpunk Anime",
		"description": "Cyberpunk anime aesthetics.",
		"image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/eb6cff40-70e7-11ef-a9ab-fb8d2d74ead2.mp4",
		"model_id": "civitai:119372@317153"
	}
];

// AI Effects options (updated data)
export const aiEffects = [
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/ai_animal.webp', name: 'AI Baby Animals' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/ai_hug.webp', name: 'AI Hug' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/catwalk-effect.webp', name: 'AI Baby Catwalk' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/cooking-effect.webp', name: 'AI Cooking Animal' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/dancing-illusion-effect.webp', name: 'AI Dancing Illusion' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/giant-sea-animal-effect.webp', name: 'AI Giant Sea Animal' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/miniature-fantasy-scene.webp', name: 'Miniature Scenes' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/POV-Niche.webp', name: 'POV-Niche' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/pov-history.webp', name: 'POV-History' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/country-animal.webp', name: 'Country Animal' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/country-human-with-beast.webp', name: 'Country Human Beast' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/country-towering.webp', name: 'Country Towering Giant' },
];


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
	const [selectedModel, setSelectedModel] = useState('HiDream I1 Fast');
	const [aspectRatio, setAspectRatio] = useState('1:1');
	const [enhancePrompt, setEnhancePrompt] = useState(true);
	const [showStyles, setShowStyles] = useState(false);
	const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);
	const [showModelModal, setShowModelModal] = useState(false);
	const [showAspectRatioPopup, setShowAspectRatioPopup] = useState(false);
	const [customWidth, setCustomWidth] = useState('1024');
	const [customHeight, setCustomHeight] = useState('1024');
	const [showLoRAPopup, setShowLoRAPopup] = useState(false);
	const [showAIEffectsModal, setShowAIEffectsModal] = useState(false);
	const [selectedAIEffect, setSelectedAIEffect] = useState(aiEffects[0].name);
	const [showStylesModal, setShowStylesModal] = useState(false);
	const [selectedStyle, setSelectedStyle] = useState('Cinematic');
	const [numImages, setNumImages] = useState(1); // NEW: state for number of images
	const [loading, setLoading] = useState(false);
	const [generatedImages, setGeneratedImages] = useState([]);
	const [showApiKeyModal, setShowApiKeyModal] = useState(false);
	const [apiKeyInput, setApiKeyInput] = useState('');
	const [userApiKey, setUserApiKey] = useState('');
	const [editImage, setEditImage] = useState(null);
	const [editPrompt, setEditPrompt] = useState('');
	const [showImageUrlModal, setShowImageUrlModal] = useState(false);
	const [imageUrlInput, setImageUrlInput] = useState('');
	const aspectRatioBtnRef = React.useRef(null);
	const stylesBtnRef = React.useRef(null); // NEW: ref for Styles button

	// Add state for selected LoRA model ID
	const [selectedLoRAModelId, setSelectedLoRAModelId] = useState("");
	// Add state for selected LoRA model name
	const [selectedLoRAName, setSelectedLoRAName] = useState("");

	// AspectRatioPopup component (inline, replaces old modal)
	function AspectRatioPopup({ isOpen, onClose, selectedRatio, setSelectedRatio, customWidth, setCustomWidth, customHeight, setCustomHeight, anchorRef }) {
		// Switch SVG shapes for 1:1 and 3:4
		const aspectRatios = [
			{ ratio: '1:1', shape: 'portrait', width: 32, height: 40 }, // was square, now portrait
			{ ratio: '3:4', shape: 'landscape', width: 40, height: 32, rotate: true },   // switched with 4:3, keep rotate
			{ ratio: '9:16', shape: 'portrait', width: 24, height: 40 },
			{ ratio: '16:9', shape: 'landscape', width: 40, height: 24 },
			{ ratio: '4:3', shape: 'square', width: 40, height: 40 }, // switched with 3:4, remove rotate
		];
		const [popupStyle, setPopupStyle] = useState({});
		React.useLayoutEffect(() => {
			if (typeof window === 'undefined') return;
			function updatePopupPosition() {
				if (isOpen && anchorRef && anchorRef.current) {
					const rect = anchorRef.current.getBoundingClientRect();
					const popupWidth = 420; // match w-[420px]
					const margin = 16;
					let left = rect.right + margin;
					let top = rect.top + window.scrollY - 100; // Move up by 100px
					// Flip to left if not enough space
					if (left + popupWidth > window.innerWidth) {
						left = rect.left - popupWidth - margin;
					}
					// Ensure popup is not off the top of viewport
					if (top < 24) top = 24;
					setPopupStyle({
						position: 'fixed',
						top,
						left,
						zIndex: 100,
					});
				}
			}
			updatePopupPosition();
			window.addEventListener('resize', updatePopupPosition);
			return () => window.removeEventListener('resize', updatePopupPosition);
		}, [isOpen, anchorRef]);
		if (!isOpen) return null;
		return (
			<div style={popupStyle} className="pointer-events-auto">
				<div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-[420px] max-w-[95vw] p-6 relative animate-fadeInRight dark-scrollbar">
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

	// LoRA Popup Component (now with search)
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
		<div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-[420px] max-w-[95vw] max-h-[70vh] overflow-y-auto p-6 relative mt-8 ml-0 animate-fadeInRight dark-scrollbar-lora">
		  <button
			className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
			onClick={onClose}
		  >
			<X size={20} />
		  </button>
		  <h2 className="text-lg font-medium text-white mb-4">LoRA</h2>
		  <input
			className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700 text-white"
			placeholder="Search Civitai or browse presets..."
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
					  onClose();
					}}
					className={`w-full bg-gray-800 rounded-lg p-4 flex items-start space-x-4 text-left transition-all ${
					  selectedLoRAModelId === model_id
						? 'border-2 border-purple-500 shadow-lg shadow-purple-500/20'
						: 'border border-gray-700 hover:border-gray-500'
					}`}
				  >
					<div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
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
					<div className="flex-1 min-w-0">
					  <h3 className="text-white font-medium text-sm mb-1">{option.name}</h3>
					  <p className="text-gray-400 text-xs leading-relaxed">{option.description || 'No description'}</p>
					  <div className="text-xs text-gray-500 mt-1">ID: {model_id}</div>
					</div>
				  </button>
				);
			  })
			) : !search.trim() ? (
			  fluxLoraModels.map((option, idx) => (
				<button
				  key={option.name || idx}
				  onClick={() => {
					setSelectedLoRAModelId(option.model_id || "");
					setSelectedLoRAName(option.name || "None");
					onClose();
				  }}
				  className={`w-full bg-gray-800 rounded-lg p-4 flex items-start space-x-4 text-left transition-all ${
					selectedLoRAModelId === (option.model_id || "")
					  ? 'border-2 border-purple-500 shadow-lg shadow-purple-500/20'
					  : 'border border-gray-700 hover:border-gray-500'
				  }`}
				>
				  <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
					{option.image_url && !option.image_url.endsWith('.mp4') ? (
					  <img
						src={option.image_url}
						alt={option.name || 'None'}
						className="w-full h-full object-cover rounded-lg"
						onError={e => { e.target.onerror = null; e.target.src = 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png'; }}
					  />
					) : option.image_url && option.image_url.endsWith('.mp4') ? (
					  <video src={option.image_url} className="w-full h-full object-cover rounded-lg" autoPlay loop muted playsInline />
					) : (
					  <div className="w-full h-full bg-gray-700 rounded-lg items-center justify-center text-gray-400 text-xs flex">IMG</div>
					)}
				  </div>





				  
				  <div className="flex-1 min-w-0">
					<h3 className="text-white font-medium text-sm mb-1">{option.name || 'None'}</h3>
					<p className="text-gray-400 text-xs leading-relaxed">{option.description || 'Select None if you do not want to use LoRA'}</p>
					{option.model_id && (
					  <div className="text-xs text-gray-500 mt-1">ID: {option.model_id}</div>
					)}
				  </div>
				</button>
			  ))
			) : null}
		  </div>
		</div>
	  </div>
	</div>
  );
	}

	// AI Effects Modal
	const AIEffectsModal = ({ isOpen, onClose }) => {
		if (!isOpen) return null;
		return (
			<div className="fixed inset-0 z-50 flex pointer-events-none">
				<div className="flex-shrink-0 w-80" />
				<div className="flex-1 flex items-start justify-start pointer-events-auto">
					<div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-[420px] max-w-[95vw] max-h-[70vh] overflow-y-auto p-6 relative mt-8 ml-0 animate-fadeInRight dark-scrollbar">
						<button
							className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
							onClick={onClose}
						>
							<X size={20} />
						</button>
						<h2 className="text-lg font-bold text-white mb-6">Select AI Effect</h2>
						<div className="grid grid-cols-2 gap-3">
							{aiEffects.map((effect) => (
								<div
									key={effect.name}
									className={`rounded-xl border-2 cursor-pointer transition-all duration-200 hover:transform hover:scale-105 ${
										selectedAIEffect === effect.name
											? 'border-purple-500 bg-purple-500/5 shadow-lg shadow-purple-500/20'
											: 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
									}`}
									onClick={() => {
										if (selectedAIEffect !== effect.name) {
											setSelectedAIEffect(effect.name);
										}
										setShowAIEffectsModal(false);
									}}
								>
									<div className="h-24 w-full relative rounded-t-xl overflow-hidden bg-gray-900 flex items-center justify-center">
										<img src={effect.effect} alt={effect.name} className="object-cover w-20 h-20 rounded-xl" />
									</div>
									<div className="p-2">
										<h3 className="font-semibold text-sm mb-1 text-white">{effect.name}</h3>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

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

	const StylesModal = ({ isOpen, onClose, selectedStyle, setSelectedStyle, anchorRef }) => {
  const [activeTab, setActiveTab] = useState('Styles');
  const [popupStyle, setPopupStyle] = useState({});
  React.useLayoutEffect(() => {
	if (typeof window === 'undefined') return;
	function updatePopupPosition() {
	  if (isOpen && anchorRef && anchorRef.current) {
		const rect = anchorRef.current.getBoundingClientRect();
		const popupWidth = 420; // match w-[420px]
		const margin = 16;
		let left = rect.right + margin;
		let top = rect.top + window.scrollY - 400; // Move up by 400px
		// Flip to left if not enough space
		if (left + popupWidth > window.innerWidth) {
		  left = rect.left - popupWidth - margin;
		}
		// Ensure popup is not off the top of viewport
		if (top < 24) top = 24;
		setPopupStyle({
		  position: 'fixed',
		  top,
		  left,
		  zIndex: 1000,
		});
	  }
	}
	updatePopupPosition();
	window.addEventListener('resize', updatePopupPosition);
	return () => window.removeEventListener('resize', updatePopupPosition);
  }, [isOpen, anchorRef]);
  if (!isOpen) return null;
  const tab = stylesTabData.find(t => t.key === activeTab);
  const isLightingTab = activeTab === 'Lighting';
  const isCameraTab = activeTab === 'Camera';
  return (
	<div className="fixed inset-0 z-50 flex pointer-events-none">
	  <div className="flex-shrink-0 w-80" />
	  <div className="flex-1 flex items-start justify-start pointer-events-auto">
		<div style={popupStyle} className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-[420px] max-w-[95vw] max-h-[70vh] overflow-y-auto p-6 relative mt-8 ml-0 animate-fadeInRight dark-scrollbar">
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
		setShowAIEffectsModal(false);
		setShowStylesModal(false);
	};
	const handleOpenAspectRatioPopup = () => {
		setShowModelModal(false);
		setShowAspectRatioPopup(true);
		setShowLoRAPopup(false);
		setShowAIEffectsModal(false);
		setShowStylesModal(false);
	};
	const handleOpenLoRAPopup = () => {
		setShowModelModal(false);
		setShowAspectRatioPopup(false);
		setShowLoRAPopup(true);
		setShowAIEffectsModal(false);
		setShowStylesModal(false);
	};
	const handleOpenAIEffectsModal = () => {
		setShowModelModal(false);
		setShowAspectRatioPopup(false);
		setShowLoRAPopup(false);
		setShowAIEffectsModal(true);
		setShowStylesModal(false);
	};
	const handleOpenStylesModal = () => {
		setShowModelModal(false);
		setShowAspectRatioPopup(false);
		setShowLoRAPopup(false);
		setShowAIEffectsModal(false);
		setShowStylesModal(true);
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
		const payload = {
			prompt,
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
			return;
		}
		// Use LoRA generation
		data = await generateLoraImage({
			prompt,
			model_id: selectedLoRAModelId,
			width,
			height,
			num_images: numImages || 1,
			apiKey: userApiKey,
			aspectRatio: aspectRatio === 'custom' ? `${customWidth}:${customHeight}` : aspectRatio,
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
		result = await pollForResult(requestId, userApiKey, (msg) => setLogMessages(logs => [...logs, msg]));
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
}
}

	// Add a handleEditImage function with API key check
async function handleEditImage() {
	if (!prompt.trim() || !editImage) return;
	if (!userApiKey) {
		setShowApiKeyModal(true);
		return;
	}
	if (!selectedLoRAModelId) {
		setLogMessages(logs => [...logs, 'Please select a LoRA model first.']);
		return;
	}
	setLoading(true);
	setGeneratedImages([]);
	try {
		const width = 1024;
		const height = 1024;
		const num_images = 1;
		const payload = {
			prompt,
			model_id: selectedLoRAModelId,
			width,
			height,
			num_images,
			apiKey: userApiKey,
			aspectRatio: aspectRatio === 'custom' ? `${customWidth}:${customHeight}` : aspectRatio
		};
	setLogMessages(logs => [...logs, '[Request] ' + JSON.stringify(payload, null, 2)]);
	let data = null;
	try {
	data = await generateLoraImage({
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
	});
		setLogMessages(logs => [...logs, '[Result] ' + JSON.stringify(result, null, 2)]);
	} catch (err) {
		setLogMessages(logs => [...logs, '[Polling Error] ' + err.message]);
		throw err;
	}
	setGeneratedImages(result.outputs);
} catch (err) {
	setLogMessages(logs => [...logs, 'Image editing failed: ' + err.message]);
} finally {
	setLoading(false);
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
					{/* Sidebar overlay for click-outside (optional, can be removed if not needed) */}
					<div className="flex-shrink-0 w-80" />
					<div className="flex-1 flex items-start justify-start pointer-events-auto">
						<div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-[800px] max-w-[70vw] max-h-[70vh] overflow-y-auto p-6 relative mt-8 ml-0 animate-fadeInRight dark-scrollbar">
							<button
								className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
								onClick={() => setShowModelModal(false)}
							>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M18 6L6 18M6 6l12 12"/>
								</svg>
							</button>
							<h2 className="text-2xl font-bold text-white mb-8">Select Model</h2>
							<div className="grid grid-cols-3 gap-5">
								{fluxModels.map((model) => (
									<div
										key={model.id}
										className={`rounded-xl border-2 cursor-pointer transition-all duration-200 hover:transform hover:scale-105 ${
											selectedModel === model.name 
												? 'border-purple-500 bg-purple-500/5 shadow-lg shadow-purple-500/20' 
												: 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
										}`}
										onClick={() => {
											if (selectedModel !== model.name) {
												setSelectedModel(model.name);
											}
											setShowModelModal(false);
										}}
									>
										<div className="h-32 w-full relative rounded-t-xl overflow-hidden bg-gray-900">
											<img src={model.image} alt={model.name} className="object-cover w-full h-full rounded-t-xl" />
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
										</div>
										<div className="p-3">
											<h3 className="font-semibold text-base mb-1 text-white">{model.name}</h3>
											<p className="text-xs text-gray-400 mb-3 min-h-[32px] leading-relaxed">{model.description}</p>
											<div className="flex items-center gap-3 text-xs text-gray-500">
												<span className="flex items-center gap-1">
													<span>🖼️</span>
													{model.num} Images
												</span>
												<span className="flex items-center gap-1">
													<span>💎</span>
													{model.credits} credits
												</span>
												<span className="flex items-center gap-1">
													<span>⚡</span>
													{model.duration}s
												</span>
											</div>
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
	  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
		<div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
		  <h2 className="text-lg font-semibold text-white mb-4">Enter your API Key</h2>
		  <input
			type="password"
			className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white mb-4"
			placeholder="API Key"
			value={apiKeyInput}
			onChange={e => setApiKeyInput(e.target.value)}
		  />
		  <div className="flex justify-end gap-2">
			<button
			  className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
			  onClick={() => setShowApiKeyModal(false)}
			>Cancel</button>
			<button
			  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
			  onClick={() => {
				setUserApiKey(apiKeyInput);
				setShowApiKeyModal(false);
				setTimeout(() => {
				  if (activeTab === 'edit') {
					handleEditImage();
				  } else {
					handleGenerate();
				  }
				}, 0);
			  }}
			  disabled={!apiKeyInput.trim()}
			>Submit</button>
		  </div>
		</div>
	  </div>
	)}

			<div className="min-h-screen bg-black text-white flex">
				{/* Sidebar - scrollable */}
				<div className="w-80 bg-gray-900/50 p-6 space-y-6 border-r border-gray-800 min-h-screen max-h-screen overflow-y-auto backdrop-blur-sm sidebar-scrollbar">
					{/* Sidebar Header */}
	<div className="flex items-center space-x-3">
	  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
		V
	  </div>
	  <span className="text-xl font-semibold">vadoo AI</span>
	</div>
	{/* General Settings */}
	<div className="space-y-5">
	  <div className="flex items-center justify-between">
		<h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">General Settings</h3>
		<button className="text-gray-500 hover:text-white transition-colors">
		  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
			<path d="M8 4l-4 4 4 4V4z"/>
		  </svg>
		</button>
	  </div>
	  {/* Model Selection */}
	  <div className="space-y-3">
		<label className="text-sm text-gray-400 font-medium">Model</label>
		<button
		  type="button"
		  onClick={handleOpenModelModal}
		  className={`w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-left flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors group ${showModelModal ? 'ring-2 ring-purple-500' : ''}`}
		  aria-pressed={showModelModal}
		>
		  <div className="flex items-center gap-3">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
			  <g>
				<polygon points="12,3 21,8.25 21,15.75 12,21 3,15.75 3,8.25" stroke="currentColor" strokeWidth="2" fill="none"/>
				<line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
				<line x1="3" y1="8.25" x2="12" y2="13.5" stroke="currentColor" strokeWidth="2"/>
				<line x1="21" y1="8.25" x2="12" y2="13.5" stroke="currentColor" strokeWidth="2"/>
			  </g>
			</svg>
			<span className="font-medium">{selectedModel}</span>
		  </div>
		  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400 group-hover:text-white transition-colors transform duration-200" style={{ transform: showModelModal ? 'rotate(0deg)' : 'rotate(180deg)' }}>
	  <path d="M10 8L6 4v8l4-4z" />
	</svg>
		</button>
	  </div>
	  {/* Aspect Ratio */}
	  <div className="space-y-3">
		<label className="text-sm text-gray-400 font-medium">Aspect Ratio</label>
		<button
		  type="button"
		  ref={aspectRatioBtnRef}
		  onClick={handleOpenAspectRatioPopup}
		  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-left flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors group"
		>
		  <div className="flex items-center gap-3">
			{/* Dynamic SVG for selected aspect ratio */}
			<svg
			  width={aspectRatioSvgs[aspectRatio]?.width || 24}
			  height={aspectRatioSvgs[aspectRatio]?.height || 24}
			  viewBox={`0 0 ${aspectRatioSvgs[aspectRatio]?.width || 24} ${aspectRatioSvgs[aspectRatio]?.height || 24}`}
			  fill="none"
			  stroke="currentColor"
			  strokeWidth="2"
			  className="text-white"
			  style={aspectRatioSvgs[aspectRatio]?.rotate ? { transform: 'rotate(90deg)' } : {}}
			>
			  <rect
				x="1"
				y="1"
				width={(aspectRatioSvgs[aspectRatio]?.width || 24) - 2}
				height={(aspectRatioSvgs[aspectRatio]?.height || 24) - 2}
				rx="0"
				stroke="#fff"
				strokeWidth="2"
			  />
			</svg>
			<span className="font-medium">
			  {aspectRatio === 'custom' && customWidth && customHeight ? `${customWidth}:${customHeight}` : aspectRatio}
			</span>
		  </div>
		  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400 group-hover:text-white transition-colors transform duration-200" style={{ transform: showAspectRatioPopup ? 'rotate(0deg)' : 'rotate(180deg)' }}>
	  <path d="M10 8L6 4v8l4-4z" />
	</svg>
		</button>
	  </div>
	  {/* LoRA */}
	  <div className="space-y-3">
		<label className="text-sm text-gray-400 font-medium">LoRA</label>
		<button
		  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors group flex items-center justify-between"
		  onClick={handleOpenLoRAPopup}
		>
		  <div className="flex items-center">
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-white"><rect x="3" y="3" width="18" height="6" rx="2"/><rect x="3" y="9" width="18" height="6" rx="2"/><rect x="3" y="15" width="18" height="6" rx="2"/></svg>
			<span className="font-medium">{selectedLoRAName || 'Add LoRA'}</span>
		  </div>
		  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400 group-hover:text-white transition-colors transform duration-200" style={{ transform: showLoRAPopup ? 'rotate(0deg)' : 'rotate(180deg)' }}>
			<path d="M10 8L6 4v8l4-4z" />
		  </svg>
		</button>
	  </div>
	  {/* AI Effects */}
	  <div className="space-y-3">
		<label className="text-sm text-gray-400 font-medium">AI Effects</label>
		<button
		  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors group"
		  onClick={handleOpenAIEffectsModal}
		>
		  <div className="flex items-center justify-between">
			<div className="flex items-center space-x-3">
			  {/* White line star SVG icon */}
			  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="10,2 12.472,7.236 18,7.764 13.5,11.618 14.944,17 10,14.1 5.056,17 6.5,11.618 2,7.764 7.528,7.236 10,2"/></svg>
			  <span className="font-medium">{selectedAIEffect}</span>
			</div>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400 group-hover:text-white transition-colors transform duration-200" style={{ transform: showAIEffectsModal ? 'rotate(0deg)' : 'rotate(180deg)' }}>
			  <path d="M10 8L6 4v8l4-4z" />
			</svg>
		  </div>
		</button>
	  </div>
	</div>
	{/* Styles Section */}
	<div className="space-y-3">
	  <label className="text-sm text-gray-400 font-medium">Styles</label>
	  <button
		className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors group"
		onClick={handleOpenStylesModal}
		ref={stylesBtnRef}
	  >
		<div className="flex items-center justify-between">
		  <div className="flex items-center space-x-3">
			{/* SVG palette icon provided by user */}
			<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
			  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
			  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
			  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
			  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
			  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
			</svg>
			<span className="font-medium">{selectedStyle}</span>
		  </div>
		  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400 group-hover:text-white transition-colors transform duration-200" style={{ transform: showStylesModal ? 'rotate(0deg)' : 'rotate(180deg)' }}>
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
  <div className="flex-1 p-8 bg-black min-h-screen overflow-hidden">
	{/* Tab Navigation */}
	<div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-xl w-fit">
	  <button
		onClick={() => setActiveTab('generate')}
		className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
		  activeTab === 'generate' 
			? 'bg-purple-600 text-white shadow-lg' 
			: 'text-gray-400 hover:text-white hover:bg-gray-800'
		}`}
	  >
		Generate Image
	  </button>
	  <button
		onClick={() => setActiveTab('edit')}
		className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
		  activeTab === 'edit' 
			? 'bg-purple-600 text-white shadow-lg' 
			: 'text-gray-400 hover:text-white hover:bg-gray-800'
		}`}
	  >
		Edit Image
	  </button>
	</div>

	{/* Main Generation Area */}
	<div className="max-w-4xl mx-auto">
	  {/* Image Preview Area */}
	  <div className="bg-gray-900 rounded-2xl p-12 mb-8 min-h-96 flex items-center justify-center border border-gray-800 relative overflow-hidden">
		<div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5"></div>
		<div className="text-center text-gray-500 relative z-10 w-full">
		  {loading ? (
			<div className="text-lg text-white">Generating image...</div>
		  ) : generatedImages.length > 0 ? (
			<div className="flex flex-wrap justify-center gap-6">
			  {generatedImages.map((url, i) => (
				<div key={i} className="relative group">
				  <img
					src={url}
					alt={`Generated image ${i + 1}`}
					className="rounded-xl max-h-96 border border-gray-700"
				  />
				  {/* Download button overlay */}
				  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<button
					  onClick={() => handleDownloadImage(url, i)}
					  disabled={downloadingIndex === i}
					  className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
					  title={downloadingIndex === i ? "Downloading..." : "Download image"}
					>
					  {downloadingIndex === i ? (
						<svg
						  width="20"
						  height="20"
						  viewBox="0 0 24 24"
						  fill="none"
						  stroke="currentColor"
						  strokeWidth="2"
						  className="animate-spin"
						>
						  <path d="M21 12a9 9 0 11-6.219-8.56"/>
						</svg>
					  ) : (
						<svg
						  width="20"
						  height="20"
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
					  )}
					</button>
				  </div>
				</div>
			  ))}
			</div>
		  ) : (
			<>
			  <h3 className="text-xl font-semibold mb-2 text-white">Create Amazing Images</h3>
			  <p className="text-gray-400 mb-1">Your AI-generated masterpiece will appear here</p>
			  <p className="text-sm text-gray-500">Enter a detailed prompt below to get started</p>
			</>
		  )}
		</div>
	  </div>

	  {/* Prompt Input with Upload Button (only in Edit tab) */}
	  <div className="relative mb-4">
		{activeTab === 'edit' && (
		  <div className="flex items-center mb-2">
			{/* Upload button now opens URL modal */}
			<button
			  type="button"
			  className="cursor-pointer bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white font-medium transition-colors hover:bg-gray-700 hover:border-gray-500 mr-3 shadow-sm"
			  onClick={() => setShowImageUrlModal(true)}
			>
			  {editImage ? 'Change Image' : 'Upload Image'}
			</button>
			{editImage && (
			  <img src={editImage} alt="To Edit" className="rounded-lg h-10 w-10 object-cover border border-gray-700 ml-2" />
			)}
				   </div>
		)}

		{/* Image URL Modal */}
		{showImageUrlModal && (
		  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
			  <h2 className="text-lg font-semibold text-white mb-4">Enter Image URL</h2>
			  <input
				type="text"
				className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white mb-4"
				placeholder="https://example.com/image.jpg"
				value={imageUrlInput}
				onChange={e => setImageUrlInput(e.target.value)}
			  />
			  <div className="flex justify-end gap-2">
				<button
				  className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
				  onClick={() => setShowImageUrlModal(false)}
				>Cancel</button>
				<button
				  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
				  onClick={() => {
					setEditImage(imageUrlInput);
					setShowImageUrlModal(false);
					setImageUrlInput("");
				  }}
				  disabled={!imageUrlInput.trim()}
				>Submit</button>
			  </div>
			</div>
		  </div>
		)}

		<div className="flex items-center space-x-4 bg-gray-900 rounded-2xl p-4 border border-gray-800 hover:border-gray-700 transition-colors">
				   <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
			<span className="text-white text-lg">✨</span>
		  </div>
		  <input
			type="text"
			value={prompt}
			onChange={(e) => setPrompt(e.target.value)}
			placeholder={activeTab === 'edit' && editImage ? "Describe how you want to edit the image..." : "Describe your creative vision in detail..."}
			className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
		  />
		  <button
			type="button"
			className="flex items-center justify-center gap-2 bg-gray-500 text-white hover:bg-gray-600 px-2 py-2 rounded-full text-sm"
			onClick={activeTab === 'edit' ? handleEditImage : handleGenerate}
			disabled={loading || !prompt.trim() || (activeTab === 'edit' && !editImage)}
		  >
			<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.91L1.78 1.5L15 7.44899V8.3999L1.78 14.33L1 13.91L2.58311 8L1 1.91ZM3.6118 8.5L2.33037 13.1295L13.5 7.8999L2.33037 2.83859L3.6118 7.43874L9 7.5V8.5H3.6118Z"></path></svg>
		  </button>
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
  .min-h-screen.bg-black {
	scrollbar-width: auto !important;
	-ms-overflow-style: auto !important;
  }
  html::-webkit-scrollbar,
  body::-webkit-scrollbar,
  .min-h-screen.bg-black::-webkit-scrollbar {
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
				selectedRatio={aspectRatio} 
				setSelectedRatio={setAspectRatio} 
				customWidth={customWidth} 
				setCustomWidth={setCustomWidth} 
				customHeight={customHeight} 
				setCustomHeight={setCustomHeight} 
				anchorRef={aspectRatioBtnRef}
			/>

		
			{/* LoRA Popup */}
			<LoRAPopup isOpen={showLoRAPopup} onClose={() => setShowLoRAPopup(false)} />

			{/* AI Effects Modal */}
			<AIEffectsModal isOpen={showAIEffectsModal} onClose={() => setShowAIEffectsModal(false)} />

			{/* Styles Modal */}
			<StylesModal isOpen={showStylesModal} onClose={() => setShowStylesModal(false)} selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} anchorRef={stylesBtnRef} />
		</>
	);
}