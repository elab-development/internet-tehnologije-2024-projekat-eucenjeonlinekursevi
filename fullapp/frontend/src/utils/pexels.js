const API_KEY = import.meta.env.VITE_PEXELS_API_KEY || '';
const CACHE = new Map();

export async function getPexelsThumb(query) {
  const q = (query || '').trim();
  if (!q || !API_KEY) return null;

  if (CACHE.has(q)) return CACHE.get(q);

  try {
    const url = `https://api.pexels.com/v1/search?per_page=1&orientation=landscape&query=${encodeURIComponent(
      q
    )}`;
    const res = await fetch(url, {
      headers: { Authorization: API_KEY },
    });
    if (!res.ok) throw new Error('pexels failed');
    const data = await res.json();
    const first = data?.photos?.[0];
    // Prefer large or medium landscape
    const src =
      first?.src?.large ||
      first?.src?.landscape ||
      first?.src?.medium ||
      first?.src?.small ||
      null;
    CACHE.set(q, src);
    return src;
  } catch {
    CACHE.set(q, null);
    return null;
  }
}