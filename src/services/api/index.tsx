import axios from 'axios';
import { parseCookies } from 'nookies';

const { 'auth.token': token } = parseCookies();

export const api = axios.create({
  baseURL:"http://localhost:8080/"
  // baseURL: process.env.API_URL,
});

if(token) {
  const _token = JSON.parse(token);
  api.defaults.headers.common['Authorization'] = `Bearer ${_token.token}`;
}