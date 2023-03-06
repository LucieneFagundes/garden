import { getAPIClient } from "./api";

interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  photo?: string;
}

//Função de recuperação de informações do usuário
export async function recoveryUser(id: string, ctx?: any) {
  const api = getAPIClient(ctx);

  const dataUser = await api.get(`/user/${id}`);

  const user = {
    id: dataUser.data.id,
    name: dataUser.data.name,
    email: dataUser.data.email,
    photo: dataUser.data.photo,
  };

  return user;
}

export async function updateUser(data: UpdateUserRequest, ctx?: any) {
  const api = getAPIClient(ctx);

  await api.patch(`user`, data);
}
