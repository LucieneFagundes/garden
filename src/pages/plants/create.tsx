import { Formik, Form, Field } from "formik";
import Router from "next/router";
import { useContext, useRef, useState } from "react";
import Layout from "../../components/Layout";
import { AuthContext } from "../../contexts/AuthContext";
import { setNewPlant } from "../../services/plant-services";
import noImage from "../../public/noImage.png";
import Image from "next/image";
import { getBase64Image } from "../../utils/utils";
import { Toast } from "primereact/toast";

interface IPlant {
  name: string;
  species?: string;
  notes?: string;
  photo?: string | ArrayBuffer;
  userId: string;
}

export default function CreatePlant() {
  const { user } = useContext(AuthContext);
  const toast = useRef(null);
  const [photo, setPhoto] = useState(undefined);

  const initialValues: IPlant = {
    name: "",
    species: "",
    notes: "",
    photo: "",
    userId: user?.id,
  };

  const showError = (message: string) => {
    toast.current.show({
      severity: "error",
      summary: "Algo deu errado",
      detail: message,
      life: 5000,
    });
  };

  async function handleChange(event: any) {
    event.preventDefault();

    if (!event.target.files || event.target.files.length === 0) {
      setPhoto(undefined);
      return;
    }

    const file = event.target.files[0];
    const fileBase64 = await getBase64Image(file);
    setPhoto(fileBase64);
  }

  async function handleCreate(plant: IPlant) {
    if (photo) {
      plant.photo = photo.toString();
    }
    try {
      plant.userId = user.id;
      await setNewPlant(plant);
      Router.push("/plants");
    } catch (e) {
      const errorMessage = e.response.data.message;
      showError(errorMessage);
    }
  }

  return (
    <>
      <Layout title="Cadastrar nova planta">
        <Formik initialValues={initialValues} onSubmit={handleCreate}>
          <Form action="#" method="POST">
            <div className="flex flex-row justify-around py-4 px-auto sm:flex-wrap xs:flex-wrap">
              <div className="flex flex-col w-auto items-center xs:w-3/4 gap-2">
                <Image
                  src={photo ? photo : noImage}
                  width={300}
                  height={300}
                  alt="previewImage"
                  objectFit="cover"
                  className="rounded-xl"
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
              <div className="rounded-md space-y-2 w-full max-w-lg xs:pt-3">
                <div>
                  <label htmlFor="name" className="">
                    Nome <span>*</span>
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Nome"
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
                    required={false}
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
                    required={false}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Salvar
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
