import {
  getPlantByIdRequest,
  setPlantUpdate,
} from "../../../services/plant-services";
import Router from "next/router";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import { parseCookies } from "nookies";
import Layout from "../../../components/Layout";
import noImage from "../../../public/noImage.png";
import { useEffect, useRef, useState } from "react";
import { getBase64Image } from "../../../utils/utils";
import { Toast } from "primereact/toast";

interface IPlant {
  data: {
    id: string;
    name: string;
    species?: string;
    notes?: string;
    photo?: string;
  };
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

  const id = ctx.query.id;
  const data = await getPlantByIdRequest(id, ctx);

  return {
    props: { data },
  };
}

export default function Plant({ data }: IPlant) {
  const [photoSave, setPhotoSave] = useState(undefined);
  const { name, species, photo, notes } = data;
  const initialValues = { name, species, photo, notes };
  const toast = useRef(null);

  useEffect(() => {
    if (!photo) {
      setPhotoSave(undefined);
      return;
    }

    setPhotoSave(photo);
  }, [photo]);

  async function handleChange(event: any) {
    event.preventDefault();

    if (!event.target.files || event.target.files.length === 0) {
      setPhotoSave(undefined);
      return;
    }

    const file = event.target.files[0];
    const fileBase64 = await getBase64Image(file);
    setPhotoSave(fileBase64);
  }

  async function handleUpdate({ id, name, species, photo, notes }) {
    try {
      photo = photoSave.toString();
      await setPlantUpdate({ id: data.id, name, species, photo, notes });
      Router.push("/plants");
    } catch (error) {
      showError(error.response.data.message);
    }
  }

  const showError = (message: string) => {
    toast.current.show({
      severity: "error",
      summary: "Algo deu errado",
      detail: message,
      life: 5000,
    });
  };

  return (
    <>
      <Layout title={`Editar ${name}`}>
        <Formik initialValues={initialValues} onSubmit={handleUpdate}>
          <Form action="#" method="POST">
            <div className="flex flex-row justify-around py-4 px-auto sm:flex-wrap xs:flex-wrap">
              <div className="flex flex-col w-auto items-center xs:w-3/4 gap-2">
                <Image
                  width={300}
                  height={300}
                  src={photoSave ? photoSave : noImage}
                  className="rounded-xl border-slate-50 border-2"
                  alt="Plant photo"
                />
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/jpg, image/png, image/jpeg"
                  capture
                  onChange={(e) => handleChange(e)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-indigo-600
                  hover:file:bg-violet-10"
                />
              </div>
              <div className="rounded-md space-y-2 w-full max-w-lg">
                <div>
                  <label htmlFor="name" className="">
                    Nome
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label htmlFor="species" className="">
                    Espécie
                  </label>
                  <Field
                    id="species"
                    name="species"
                    type="text"
                    className="appearance-none relative block w-full px-3 py-2 mt-1 first: border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Espécie"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="">
                    Anotações
                  </label>
                  <Field
                    component="textarea"
                    id="notes"
                    name="notes"
                    type="text"
                    className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm
                    line"
                    placeholder="Anotações"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Atualizar
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </Formik>
        <Toast ref={toast} />
      </Layout>
    </>
  );
}
