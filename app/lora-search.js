import { useState } from 'react';

function LoraSearch() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search handler
  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch(`/api/search-lora?keyword=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data.results);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  // Copy model ID to clipboard
  function handleCopy(id) {
    navigator.clipboard.writeText(id);
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-gray-900 rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-white">Search LoRA Models (Civitai)</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="Enter keyword..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700" disabled={loading || !keyword.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <div className="grid gap-4">
        {results.map(r => (
          <div key={r.id} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:border-purple-500" onClick={() => handleCopy(r.id)}>
            {r.image && <img src={r.image} alt={r.name} className="w-16 h-16 object-cover rounded" />}
            <div className="flex-1">
              <div className="font-semibold text-white">{r.name}</div>
              <div className="text-xs text-gray-400 truncate">{r.description}</div>
              <div className="text-xs text-gray-500 mt-1">ID: {r.id}</div>
            </div>
            <button className="ml-2 px-2 py-1 rounded bg-gray-700 text-xs text-white hover:bg-purple-600" onClick={e => { e.stopPropagation(); handleCopy(r.id); }}>Copy ID</button>
          </div>
        ))}
      </div>
      {results.length > 0 && <div className="text-xs text-gray-400 mt-4">Click a card or the button to copy the model ID.</div>}
    </div>
  );
}

// Export or render <LoraSearch /> where you want this feature to appear
export default LoraSearch;