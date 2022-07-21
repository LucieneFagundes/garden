import { getAPIClient } from "./api";

export async function setActivity(data: any, ctx?: any) {
  const api = getAPIClient(ctx)
  await api.post(`/activities`, data);
}

export async function getActivities(id: any, ctx?: any){
  const api = getAPIClient(ctx);
  const {data} = await api.get(`/activities/${id}`);
  return data
}