import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import noImage from "../public/noImage.png";
import Image from "next/image";

interface TableProps {
  data: any;
  columns: any;
  handleDetail: (data: any) => void;
  handleDelete: (data: any) => void;
}

export default function TablePlants({
  data,
  columns,
  handleDetail,
  handleDelete,
}: TableProps) {
  const imageBodyTemplate = (rowData) => {
    return (
      <Image
        src={rowData.photo ? rowData.photo : noImage}
        className="rounded-xl"
        height={100}
        width={100}
        objectFit="cover"
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div className="flex justify-around">
          <Button
            icon="pi pi-eye"
            className="p-button-text p-button-rounded p-button-primary"
            onClick={() => handleDetail(rowData)}
          />
          <Button
            icon="pi pi-trash"
            className="p-button-text p-button-rounded p-button-danger"
            onClick={() => handleDelete(rowData)}
          />
        </div>
      </React.Fragment>
    );
  };
  const dynamicColumns = columns.map((col: any, i: any) => {
    return (
      <Column
        key={col.field}
        field={col.field}
        header={col.header}
        align="center"
      />
    );
  });

  return (
    <div>
      <div className="card">
        <DataTable value={data} responsiveLayout="scroll" stripedRows>
          <Column
            field="photo"
            header="Foto"
            body={imageBodyTemplate}
            align="center"
          ></Column>
          {dynamicColumns}
          <Column align="center" body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
