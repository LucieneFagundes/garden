import { getAPIClient } from "./api";

interface IData {
  id: string;
  name: string;
  species: string;
  notes: string
  photo: string;

}
//REQUISIÇÃO DE TODAS AS PLANTAS DO USUÁRIO
export async function getPlantsRequest(id: string, ctx?: any) {
  const api = getAPIClient(ctx)

  const { data } = await api.get(`/plants/${id}`)

  return data;

}

//REQUISIÇÃO DE PLANTA POR ID
export async function getPlantByIdRequest(id: string, ctx?: any) {
  const api = getAPIClient(ctx);
  const { data } = await api.get(`/plant/${id}`);
  return data;
}

//REQUISIÇÃO DE UPDATE DA PLANTA
export async function setPlantUpdate(plant: IData, ctx?: any) {
  const api = getAPIClient(ctx);
  await api.patch(`/plant`, plant)
}

//REQUISIÇÃO DE DELETE DA PLANTA
export async function setDeletePlant(id: string, ctx?: any) {
  const api = getAPIClient(ctx);
  await api.delete(`/plant/${id}`);
}