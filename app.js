const clientId = "ad4730c657534aaf9a5f99877e13dd7b"; // Replace with your Spotify Client ID
const clientSecret = "e64dc8b51e664166ac62baa21456d6db"; // Replace with your Spotify Client Secret
let accessToken = "";

// Function to fetch access token (required for Spotify API)
const fetchAccessToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  accessToken = data.access_token;
};

// Function to search for songs using Spotify API
const searchSongs = async (query) => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data.tracks.items;
};

// Function to display songs on the page
const displaySongs = (songs) => {
  const songList = document.getElementById("song-list");
  songList.innerHTML = ""; // Clear previous results

  songs.forEach((song) => {
    const songDiv = document.createElement("div");
    songDiv.classList.add("song");

    songDiv.innerHTML = `
      <img src="${song.album.images[0].url}" alt="${song.name}" />
      <h3>${song.name}</h3>
      <p>by ${song.artists.map((artist) => artist.name).join(", ")}</p>
      <a href="${song.external_urls.spotify}" target="_blank">Listen on Spotify</a>
    `;

    songList.appendChild(songDiv);
  });
};

// Event listener for the search form
document.getElementById("search-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = document.getElementById("search-input").value;

  if (!accessToken) {
    await fetchAccessToken(); // Get access token if not already fetched
  }

  const songs = await searchSongs(query);
  displaySongs(songs);
});
