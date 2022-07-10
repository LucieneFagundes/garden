import { getAPIClient } from "./api";

 

type signInRequestType = {
  email: string,
  password: string
}
type signUpRequestType = {
  name: string;
  email: string;
  password: string;
}
const api = getAPIClient()

export async function signInRequest(data: signInRequestType) {
  
  const response = await api.post("/login", data)
  return {
    token: response.data.token,
    user: response.data.user
  }
}

export async function signUpRequest(data: signUpRequestType) {
  const response = await api.post('/user', data);
  return {
    token: response.data.token,
    user: response.data.user
  }
}
