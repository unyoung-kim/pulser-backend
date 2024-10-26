import {Result, ok, err} from "true-myth/result"

export function getWordpressAuthUrl(): Result<string,string> {
    const authUrl = new URL(`https://public-api.wordpress.com/oauth2/authorize`);
    authUrl.searchParams.append('client_id', process.env.CLIENT_ID ?? '');
    authUrl.searchParams.append('redirect_uri', process.env.REDIRECT_URI ?? '');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'global');
  
    return ok(authUrl.toString());
  }