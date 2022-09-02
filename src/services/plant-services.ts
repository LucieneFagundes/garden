import { getAPIClient } from "./api";

interface ICreatePlant {
  name: string;
  species?: string;
  notes?: string;
  photo?: string | ArrayBuffer;
  userId: string;
}

interface IUpdatePlant {
  id: string;
  name: string;
  species: string;
  notes: string;
  photo: string;
}
//REQUISIÇÃO DE TODAS AS PLANTAS DO USUÁRIO
export async function getPlantsRequest(id: string, ctx?: any) {
  const api = getAPIClient(ctx);
  const { data } = await api.get(`/plants/${id}`);
  return data;
}
//REQUISIÇÃO DE CRIAÇÃO DE PLANTA
export async function setNewPlant(plant: ICreatePlant, ctx?: any) {
  const api = getAPIClient(ctx);
  await api.post("/plant", plant);
}

//REQUISIÇÃO DE ENCONTRAR PLANTA POR ID
export async function getPlantByIdRequest(id: string, ctx?: any) {
  const api = getAPIClient(ctx);
  const { data } = await api.get(`/plant/${id}`);
  return data;
}

//REQUISIÇÃO DE UPDATE DA PLANTA
export async function setPlantUpdate(data: IUpdatePlant, ctx?: any) {
  const api = getAPIClient(ctx);
  await api.patch(`/plant`, data);
}

//REQUISIÇÃO DE DELETE DA PLANTA
export async function setDeletePlant(id: string, ctx?: any) {
  const api = getAPIClient(ctx);
  await api.delete(`/plant/${id}`);
}

//REQUISIÇÃO DE PLANTAS COM ATIVIDADES PELO USUÁRIO LOGADO
export async function getPlantsWithActivities(id: string, ctx?: any) {
  const api = getAPIClient(ctx);
  const { data } = await api.get(`/plant-with-activity/${id}`);
  return data;
}
