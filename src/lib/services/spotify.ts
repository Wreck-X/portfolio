import type { SpotifyTrack } from '$lib/types/index.js';  
  
const CACHE_TTL = 30 * 1000; // 30 seconds
let cache: { data: SpotifyTrack, timestamp: number } | null = null;  
  
export async function fetchNowPlaying(): Promise<SpotifyTrack> {  
  // Return cached data if still valid  
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {  
    return cache.data;  
  }  
  
  try {  
    const res = await fetch("/api/now-playing");  
    if (res.ok) {  
      const trackData = await res.json();  
      cache = { data: trackData, timestamp: Date.now() };  
      return trackData;  
    }  
      
    // Fallback for non-OK responses  
    const fallback = { name: "No track playing", artist: "", url: "#", isPlaying: false };  
    cache = { data: fallback, timestamp: Date.now() };  
    return fallback;  
  } catch {  
    // Network error fallback  
    const fallback = { name: "No track playing", artist: "", url: "#", isPlaying: false };  
    cache = { data: fallback, timestamp: Date.now() };  
    return fallback;  
  }  
}  
  
export function clearCache(): void {  
  cache = null;  
}