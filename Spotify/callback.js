function logout() {
  localStorage.removeItem('spotifyAccessToken');
  localStorage.removeItem('spotifyRefreshToken');
  window.location.href = 'index.html';
}

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
    'Authorization': 'Basic ' + btoa('' + ':' + '') // 
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
};
