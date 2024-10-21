export async function callWordpressAccessToken(code: string): Promise<string> {
    const response = await fetch('https://public-api.wordpress.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID ?? '',
        client_secret: process.env.CLIENT_SECRET ?? '',
        redirect_uri: process.env.REDIRECT_URI ?? '',
        code: code,
        grant_type: 'authorization_code',
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch access token');
    }
  
    const data = await response.json();
    return data.access_token;
  }