import Image from "next/image";
import { parseCookies } from "nookies";
import Layout from "../../components/Layout";
import { getPlantByIdRequest } from "../../services/plant-services";
import Table from "../../components/Table"

import noImage from "../../public/noImage.png";
import Router from "next/router";
import { getActivities } from "../../services/activities-services";

const columns = [
  { field: 'activity', header: 'Tarefa' },
  { field: 'period_qd', header: 'Qt por' },
  { field: 'period', header: 'Período' },
  { field: 'initial_event', header: 'Início' },
  { field: 'next_event', header: 'Próximo' },
  { field: 'notes', header: 'Anotações' },
]

export async function getServerSideProps(ctx: any) {
  const { ['auth.token']: token } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const id = ctx.query.id;
  const data = await getPlantByIdRequest(id, ctx);
  const activities = await getActivities(id, ctx)

  return {
    props: { data, activities }
  }
}


export default function Activities({ data, activities }: any) {

  function createActivity() {
    Router.push(`/activities/register/${data.id}`)
  }

  return (
    <Layout title={`Resumo: ${data.name}`}>
      <div className="flex flex-row justify-around py-4 px-auto sm:flex-wrap">
        <div className="flex flex-col w-auto">
          <div className="items-center">
            {/* TODO: ZOOM EM IMAGEM */}
            <Image src={data.photo ? data.photo : noImage}
              width={200} height={200} alt="photo"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
          <div>
            <div>
              <label className="">Nome: </label>
              <span
                className=" relative w-full  mt-1 text-gray-900 rounded-md sm:text-sm"
              >{data.name}</span>
            </div>
            <div>
              <label className="">Espécie: </label>
              <span
                className=" relative w-full  mt-1 text-gray-900 rounded-md sm:text-sm"
              >{data.species}</span>
            </div>
            <div className="">
              <label className="">Anotações: </label>
              <span
                className=" relative w-full  mt-1 text-gray-900 rounded-md sm:text-sm"
              >{data.notes}</span>
            </div>
            <div>
            </div>
          </div>
        </div>

        <div className="rounded-md space-y-2 w-full max-w-3xl ">
          <div>
            <button type="button" onClick={createActivity}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Adicionar tarefa
            </button>
          </div>
          <div>
            <Table data={activities} columns={columns}
            />
          </div>
        </div>

      </div>
    </Layout>
  )
}


