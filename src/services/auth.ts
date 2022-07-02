import { api } from "./api";

type signInRequestType = {
  email: string,
  password: string
}

export async function signInRequest(data: signInRequestType) {
  const response = await api.post("/login", data)
  return {
    token: {
      token: response.data.token,
      userId: response.data.user.id
    },
    user: response.data.user
  }
}