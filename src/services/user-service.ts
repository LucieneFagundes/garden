import { getAPIClient } from "./api";

//Função de recuperação de informações do usuário
export async function recoveryUser(id: string, ctx?:any){
  const api = getAPIClient(ctx)
  
  const dataUser = await api.get(`/user/${id}`);
  
  const user =  {
    id: dataUser.data.id,
    name: dataUser.data.name,
    email: dataUser.data.email,
    photo: dataUser.data.photo
  }
  
  return user;
}