// pages/api/search-lora.js
// Next.js API route to search for LoRA models on Civitai

export default async function handler(req, res) {
  const { keyword } = req.query;
  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid keyword' });
  }
  try {
    // Search for LoRA models with Flux Dev base model
    const civitaiRes = await fetch(`https://civitai.com/api/v1/models?query=${encodeURIComponent(keyword)}&types=LORA&baseModels=Flux.1%20D`);
    if (!civitaiRes.ok) throw new Error('Civitai API error');
    const data = await civitaiRes.json();

    // Filter and map results to only include Flux Dev LoRAs
    const fluxDevResults = (data.items || [])
      .filter(item => {
        // Double-check that it's a LoRA and has Flux Dev base model
        return item.type === 'LORA' &&
               item.modelVersions?.[0]?.baseModel?.includes('Flux');
      })
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        versionId: item.modelVersions?.[0]?.id || '',
        name: item.name,
        description: item.description || '',
        image: item.modelVersions?.[0]?.images?.[0]?.url || '',
        airId: item.id && item.modelVersions?.[0]?.id ? `civitai:${item.id}@${item.modelVersions[0].id}` : '',
        baseModel: item.modelVersions?.[0]?.baseModel || 'Unknown'
      }));

    res.status(200).json({ results: fluxDevResults });
  } catch (err) {
    console.error('Civitai search error:', err);
    res.status(500).json({ error: err.message });
  }
}
