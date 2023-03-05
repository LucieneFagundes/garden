import Image from "next/image";
import Router from "next/router";
import { parseCookies } from "nookies";
import { PencilIcon, PlusIcon } from "@heroicons/react/outline";
import { getPlantByIdRequest } from "../../../services/plant-services";
import {
  deleteActivity,
  getActivities,
} from "../../../services/activities-services";
import Layout from "../../../components/Layout";
import Table from "../../../components/TableActivities";
import noImage from "../../../public/noImage.png";
import { useEffect, useState } from "react";

export async function getServerSideProps(ctx: any) {
  const { ["auth.token"]: token } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const id = ctx.query.id;
  const data = await getPlantByIdRequest(id, ctx);
  const activities = await getActivities(id, ctx);

  return {
    props: { data, activities },
  };
}

export default function Activities({ data, activities }: any) {
  const [tasks, setTasks] = useState<any>();
  useEffect(() => {
    setTasks(activities);
  }, []);

  function updatePlant() {
    Router.replace(`/plants/update/${data.id}`);
  }
  function createActivity() {
    Router.push(`/plants/activities/register/${data.id}`);
  }

  function handleEdit(e) {
    Router.push(`update/${e.id}`);
  }
  async function handleDelete(taskToDelete) {
    try {
      await deleteActivity(taskToDelete.id);

      const taskWithoutDeleteOne = tasks.filter((t) => {
        return t.id != taskToDelete.id;
      });

      setTasks(taskWithoutDeleteOne);
    } catch (err) {
      alert("Algo deu errado: " + err.message);
    }
  }

  return (
    <Layout title={`Atividades da planta: ${data.name}`}>
      <div className="flex flex-row justify-around py-4 px-auto sm:flex-wrap">
        <div className="flex flex-col w-auto">
          <div className="items-center">
            <Image
              src={data.photo ? data.photo : noImage}
              width={200}
              height={200}
              alt="photo"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1 text-gray-900 sm:text-sm text-center">
            <div className="">
              <label className="pr-1 ">Nome: </label>
              <span className=" relative w-full  mt-1 rounded-md sm:text-sm">
                {data.name}
              </span>
            </div>
            <div>
              <label className="">Espécie: </label>
              <span className=" relative w-full  mt-1 rounded-md sm:text-sm">
                {data.species}
              </span>
            </div>
            <div className="">
              <label className="">Anotações: </label>
              <span className=" relative w-full  mt-1 rounded-md sm:text-sm">
                {data.notes}
              </span>
            </div>
            <div></div>
          </div>
        </div>

        <div className="rounded-md space-y-2 w-4/5 flex flex-col gap-2">
          <div className="flex">
            <button
              type="button"
              onClick={updatePlant}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md mr-1
              text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
            >
              <span>
                <PencilIcon
                  className="h-5 w-5 pr-1 text-white group-hover:text-white"
                  aria-hidden="true"
                />
              </span>
              Editar planta
            </button>
            <button
              type="button"
              onClick={createActivity}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md ml-1
              text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
            >
              <span>
                <PlusIcon
                  className="h-5 w-5 pr-1 text-white group-hover:text-white"
                  aria-hidden="true"
                />
              </span>
              Adicionar tarefa
            </button>
          </div>
          <Table
            data={tasks}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </div>
      </div>
    </Layout>
  );
}
