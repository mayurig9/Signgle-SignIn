const clientId = ''; 
const redirectUri = 'http://localhost:8888/callback.html'; 
const scope = 'user-read-private'; 
const clientSecret ='';

function loginWithSpotify() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  window.location.href = authUrl;
}

if (window.location.search) {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    const apiUrl = 'https://accounts.spotify.com/api/token';
    const data = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret) 
    };

    fetch(apiUrl, {
      method: 'POST',
      headers,
      body: new URLSearchParams(data)
    })
      .then(response => response.json())
      .then(data => {
        const { access_token, refresh_token } = data;

        localStorage.setItem('spotifyAccessToken', access_token);
        localStorage.setItem('spotifyRefreshToken', refresh_token);

        window.location.href = 'callback.html';
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
} else {

  const accessToken = localStorage.getItem('spotifyAccessToken');
  const refreshToken = localStorage.getItem('spotifyRefreshToken');

  if (accessToken) {
    const apiUrl = 'https://api.spotify.com/v1/me';
    fetch(apiUrl, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error:', error);
      });
  } else if (refreshToken) {
    const apiUrl = 'https://accounts.spotify.com/api/token';
    const data = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    };

    fetch(apiUrl, {
      method: 'POST',
      headers,
      body: new URLSearchParams(data)
    })
      .then(response => response.json())
      .then(data => {
        const { access_token, refresh_token } = data;

        localStorage.setItem('spotifyAccessToken', access_token);
        localStorage.setItem('spotifyRefreshToken', refresh_token);

        const apiUrl = 'https://api.spotify.com/v1/me';
        fetch(apiUrl, {
          headers: {
            'Authorization': 'Bearer ' + access_token
          }
        })
          .then(response => response.json())
          .catch(error => {
            console.error('Error:', error);
          });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}