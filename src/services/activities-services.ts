import { getAPIClient } from "./api";

export async function setActivity(data: any, ctx?: any) {
  const api = getAPIClient(ctx)
  await api.post(`/activities`, data);
}


export async function setUpdateActivity(data: any, ctx?: any) {
  const api = getAPIClient(ctx)
  await api.put(`/activity/${data.id}`, data);
}

export async function getActivities(id: any, ctx?: any){
  const api = getAPIClient(ctx);
  const {data} = await api.get(`/activities/${id}`);
  return data
}

export async function deleteActivity(id: string, ctx?: any){
  const api = getAPIClient(ctx);
  await api.delete(`/activity/${id}`);
}

export async function getActivity(id: string, ctx?: any){
  const api = getAPIClient(ctx);
  const {data} = await api.get(`/activity/${id}`);
  return data;
}