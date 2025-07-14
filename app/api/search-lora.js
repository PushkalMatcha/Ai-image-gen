// pages/api/search-lora.js
// Next.js API route to search for LoRA models on Civitai

export default async function handler(req, res) {
  const { keyword } = req.query;
  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid keyword' });
  }
  try {
    const civitaiRes = await fetch(`https://civitai.com/api/v1/models?query=${encodeURIComponent(keyword)}`);
    if (!civitaiRes.ok) throw new Error('Civitai API error');
    const data = await civitaiRes.json();
    // Map to top 5 results with required fields
    const results = (data.items || []).slice(0, 5).map(item => ({
      id: item.id,
      versionId: item.modelVersions?.[0]?.id || '',
      name: item.name,
      description: item.description || '',
      image: item.modelVersions?.[0]?.images?.[0]?.url || ''
    }));
    res.status(200).json({ results });
  } catch (err) {
    console.error('Civitai search error:', err);
    res.status(500).json({ error: err.message });
  }
}
