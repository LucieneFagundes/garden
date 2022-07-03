import { api } from "./api";

type signInRequestType = {
  email: string,
  password: string
}
type signUpRequestType = {
  name: string;
  email: string;
  password: string;
}

export async function signInRequest(data: signInRequestType) {
  const response = await api.post("/login", data)
  return {
    // todo : retornar id dentro do token pelo backend
    token: {
      token: response.data.token,
      userId: response.data.user.id
    },
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