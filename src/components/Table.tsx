import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import noImage from '../public/noImage.png';
import Image from 'next/image';

interface Props {
  data: any;
  columns: any;
  header?: string;
  handleDetail: (data:any) => void;
  handleEdit: (data: any) => void;
  handleDelete: (data: any) => void;
}

export default function Table({ data, columns, header, handleDetail, handleEdit, handleDelete }: Props) {
  const imageBodyTemplate = (rowData) => {
    return <Image src={rowData.photo ? rowData.photo : noImage}  className="product-image" 
      height={100} width={100}
    />
  }
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-eye" className="p-button-text  p-button-rounded p-button-primary" label='Detalhes' onClick={() => handleDetail(rowData)} />
        <Button icon="pi pi-pencil" className="p-button-text p-button-rounded p-button-secondary mr-2" onClick={() => handleEdit(rowData)} />
        <Button icon="pi pi-trash" className="p-button-text  p-button-rounded p-button-danger" onClick={() => handleDelete(rowData)} />
      </React.Fragment>
    );
  }
  const dynamicColumns = columns.map((col: any, i: any) => {
    return <Column key={col.field} field={col.field} header={col.header} />;
  });

  return (
    <div>
      <div className="card">
        <DataTable value={data} responsiveLayout="scroll">
          <Column field="photo" header="Foto" body={imageBodyTemplate}></Column>
          {dynamicColumns}
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
      </div>
    </div>
  );
}
