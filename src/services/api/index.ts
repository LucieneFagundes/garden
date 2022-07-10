import axios from 'axios';
import { parseCookies } from 'nookies';

export function getAPIClient(ctx?: any){

  const { 'auth.token': token } = parseCookies(ctx);
  
  const api = axios.create({
    baseURL:"http://localhost:8080/"
    // baseURL: process.env.API_URL,
  });
  
  if(token) {
    const _token = JSON.parse(token);
    api.defaults.headers.common['Authorization'] = `Bearer ${_token.token}`;
  }

  return api;
}