import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN
} from "$env/static/private";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

const basic = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString("base64");

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  return response.json();
}

export async function GET() {
  const { access_token } = await getAccessToken();

  // Try currently playing
  const nowPlaying = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (nowPlaying.status === 200) {
    const song = await nowPlaying.json();

    if (song?.item) {
      return new Response(
        JSON.stringify({
          name: song.item.name,
          artist: song.item.artists.map((a: any) => a.name).join(", "),
          url: song.item.external_urls.spotify,
          isPlaying: song.is_playing,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // fallback: last played
  const lastPlayed = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await lastPlayed.json();
  const song = data.items?.[0]?.track;


  return new Response(
    JSON.stringify({
      name: song?.name ?? "Nothing played recently",
      artist: song?.artists?.map((a: any) => a.name).join(", ") ?? "",
      url: song?.external_urls?.spotify ?? "#",
      isPlaying: false,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}