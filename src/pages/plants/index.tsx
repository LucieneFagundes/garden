import { parseCookies } from "nookies";
import {
  getPlantsRequest,
  setDeletePlant,
} from "../../services/plant-services";
import React, { useState, useRef, useEffect } from "react";
import Router from "next/router";
import Table from "../../components/TablePlants";
import Layout from "../../components/Layout";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { PlusSmIcon } from "@heroicons/react/outline";

interface IPlant {
  id: string;
  name: string;
  species: string;
  photo: string;
  notes: string;
}

const columns = [
  { field: "name", header: "Nome" },
  { field: "species", header: "Espécies" },
  { field: "notes", header: "Anotações" },
];

export default function Plants({ data, id }: any) {
  const dataPlants = Array.from(data);

  const [plants, setPlants] = useState<any>([]);

  useEffect(() => {
    setPlants(dataPlants);
  }, []);

  const toast = useRef(null);

  function handleCreate() {
    Router.push("/plants/create");
  }

  function handleDetail(data: any) {
    Router.push(`/plants/activities/${data.id}`);
  }

  function handleDelete(data: IPlant) {
    confirmDialog({
      message: `Deseja apagar a planta "${data.name}"?`,
      header: "Confirmação de exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger p-button-sm",
      rejectClassName: "p-button p-button-sm",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: async () => {
        try {
          await setDeletePlant(data.id);
          toast.current.show({
            severity: "success",
            summary: "Confimado",
            detail: "Excluido com sucesso",
            life: 3000,
          });
          const plants = await getPlantsRequest(id);
          setPlants(plants);
        } catch (error) {
          toast.current.show({
            severity: "danger",
            summary: "Error",
            detail: "Erro ao excluir",
            life: 3000,
          });
        }
      },
    });
  }
  return (
    <>
      <Layout title="Plantas">
        <div className="flex justify-end pb-4">
          <button
            className="relative xs:w-full xs:justify-center flex justify-end py-2 px-4 border border-transparent text-sm font-medium rounded-md mr-1
            text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleCreate}
          >
            <span>
              <PlusSmIcon className="w-5 h-5" />
            </span>
            Nova Planta
          </button>
        </div>
        <Table
          data={plants}
          columns={columns}
          handleDetail={handleDetail}
          handleDelete={handleDelete}
        />
        <Toast ref={toast} />
        <ConfirmDialog />
      </Layout>
    </>
  );
}

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

  const { id } = JSON.parse(token);
  const data = await getPlantsRequest(id, ctx);

  return {
    props: { data, id },
  };
}
