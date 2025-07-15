// Next.js 13+ App Router API route for LoRA search (Civitai)

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword');
  if (!keyword || typeof keyword !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing or invalid keyword' }), { status: 400 });
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

    return new Response(JSON.stringify({ results: fluxDevResults }), { status: 200 });
  } catch (err) {
    console.error('Civitai search error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
