// Spotify track interface  
export interface SpotifyTrack {  
  name: string;  
  artist: string;  
  url: string;  
  isPlaying: boolean;  
}  
  
// Project card interface for Vinyl component  
export interface VinylCard {  
  id: number;  
  title: string;  
  sub: string;  
  url: string;  
  description: string;  
}  
  
// Skill category interface  
export interface SkillCategory {  
  label: string;  
  items: string[];  
}