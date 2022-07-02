import { api } from "./api";

//Função de recuperação de informações do usuário
export async function recoveryUser(id: string){
  
  const dataUser = await api.get(`/user/${id}`);

  const user =  {
    name: dataUser.data.name,
    email: dataUser.data.email,
    photo: dataUser.data.photo
  }
  
  return user;
}