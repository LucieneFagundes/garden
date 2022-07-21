import { parseCookies } from 'nookies';
import { getPlantsRequest, setDeletePlant } from '../../services/plant-services';
import Table from '../../components/Table';
import Layout from '../../components/Layout';
import Router from 'next/router';

import React, { useState, useRef } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';



interface IPlant {
  id: string;
  name: string;
  species: string;
  photo: string;
  notes: string;
}

const ConfirmDialogDemo = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const toast = useRef(null);

  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  }

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  const confirm2 = () => {
    confirmDialog({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept,
      reject
    });
  };
}

const columns = [
  { field: 'name', header: 'Nome' },
  { field: 'species', header: 'Espécies' },
  { field: 'notes', header: 'Anotações' },
]

export default function Plants({ data }: any) {

  let dataPlants = data.map((d: any) => { return d })
  
  const toast = useRef(null);

  function handleCreate() {
    Router.push('/plants/cadastro')
  }

  function handleDetail(data: any) {
    Router.push(`/activities/${data.id}`)
  }

  function handleEdit(data: any) {
    Router.push(`/plants/${data.id}`);
  }

  function handleDelete(data: IPlant) {
    confirmDialog({
      message: `Deseja apagar a planta "${data.name}"?`,
      header: 'Confirmação de exclusão',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger p-button-sm',
      rejectClassName: 'p-button p-button-sm',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: async () => {
        try {
          await setDeletePlant(data.id);
          toast.current.show({ severity: 'success', summary: 'Confimado', detail: 'Excluido com sucesso', life: 3000 });
          Router.reload();
          //TODO: acionar o Reload no componente, e não na página inteira
        } catch (error) {
          toast.current.show({ severity: 'danger', summary: 'Error', detail: 'Erro ao excluir', life: 3000 });
        }
      }
    });

  }


  return (
    <>
      <Layout title='Plantas'>
        <div className="flex flex-row-reverse px-1 pb-3">
          <Button icon="pi pi-plus" className="p-button-outlined p-button-rounded p-button-primary" label="Adicionar planta" onClick={handleCreate}></Button>
        </div>
        <Table data={dataPlants} photo={true} columns={columns} handleDetail={handleDetail} handleEdit={handleEdit} handleDelete={handleDelete} />
        <Toast ref={toast} />
        <ConfirmDialog />
      </Layout>
    </>
  )

}

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

  const { id } = JSON.parse(token);
  const data = await getPlantsRequest(id, ctx);

  return {
    props: { data }
  }
}


