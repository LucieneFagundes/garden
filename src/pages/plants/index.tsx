import { parseCookies } from "nookies";
import {
  getPlantsRequest,
  setDeletePlant,
} from "../../services/plant-services";
import Table from "../../components/TablePlants";
import Layout from "../../components/Layout";
import Router from "next/router";

import React, { useState, useRef, useEffect } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
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
        <div className="flex justify-end pb-4 xs:justify-center">
          {/* <Button
            icon="pi pi-plus"
            className="p-button-outlined p-button-rounded p-button-primary"
            label="Adicionar planta"
            onClick={handleCreate}
          ></Button> */}
          <button
            className="flex items-center px-4 py-2 font-bold text-green-600 border-green-600 border-2 rounded-full hover:text-green-100 hover:bg-green-600 hover:transition"
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
