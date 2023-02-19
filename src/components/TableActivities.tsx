import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/pt-br";
import { Button } from "primereact/button";

interface Props {
  data: any;
  handleEdit?: (data: any) => void;
  handleDelete?: (data: any) => void;
}

export default function Table({ data, handleEdit, handleDelete }: Props) {
  const formatDate = (data) => {
    dayjs.locale("pt-br");
    dayjs.extend(LocalizedFormat);
    return dayjs(data).format(`DD [de] MMMM [às] HH:mm`);
  };

  const dateInitial = (rowData) => {
    return formatDate(rowData.initial_event);
  };
  const dateNext = (rowData) => {
    return formatDate(rowData.next_event);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-text p-button-rounded p-button-secondary mr-2"
          onClick={() => handleEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-text  p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData)}
        />
      </React.Fragment>
    );
  };

  return (
    <div>
      <div className="card">
        <DataTable value={data} responsiveLayout="scroll">
          <Column field="activity" header="Atividade"></Column>
          <Column field="period_qd" header="QT"></Column>
          <Column field="period" header="Período"></Column>
          <Column
            field="initial_event"
            header="Início"
            filterField="date"
            dataType="date"
            body={dateInitial}
          ></Column>
          <Column
            field="next_event"
            header="Próximo"
            filterField="date"
            dataType="date"
            body={dateNext}
          ></Column>
          <Column field="notes" header="Anotações"></Column>
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
