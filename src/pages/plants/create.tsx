import { Formik, Form, Field, isEmptyArray } from "formik";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { AuthContext } from "../../contexts/AuthContext";
import { setNewPlant } from "../../services/plant-services";
import noImage from "../../public/noImage.png";
import Image from "next/image";
import { getBase64Image } from "../../utils/utils";

interface IPlant {
  name: string
  species?: string
  notes?: string
  photo?: string | ArrayBuffer
  userId: string;
}

export default function CreatePlant() {
  //TODO : Melhorar a estrutura de upload, e tornar um componente
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(undefined);
  const [photo, setPhoto] = useState(undefined);
  const [preview, setPreview] = useState(undefined);

  useEffect(() => {
    if (!image) {
      setPreview(noImage)
      return
    }
    const objectUrl = URL.createObjectURL(image)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [image])

  const initialValues: IPlant = {
    name: '',
    species: '',
    notes: '',
    photo: '',
    userId: user?.id
  }

  async function handleChange(event: any) {
    event.preventDefault();

    if (!event.target.files || event.target.files.length === 0) {
      setImage(noImage)
      return
    }
    setImage(event.target.files[0])

    const file = event.target.files[0];
    const fileBase64 = await getBase64Image(file);
    setPhoto(fileBase64);
  }

  //FUNCIONANDO
  async function handleCreate(plant: IPlant) {
    //TODO: Fazer tratativa de campos vazios para null no backend.
    try {
      plant.photo = photo.toString();
    } catch (error) {
      console.log(error);
    }
    plant.userId = user.id;
    await setNewPlant(plant);
    Router.push("/plants")
  }

  return (
    <>
      <Layout title="Cadastrar nova planta">
        <Formik initialValues={initialValues} onSubmit={handleCreate}>
          <Form action="#" method="POST">

            <div className="flex flex-row justify-around py-4 px-auto sm:flex-wrap">
              {/* PARTE DA FOTO E PREVIEW */}
              {/* TODO: Impedir imagens com tamanho maior do que o especificado */}
              {/* TODO: Botão de remoção de imagem do input */}
              {/* TODO: Redimencionar imagem antes de salvar */}
              <div className="flex flex-col w-auto items-center">
                <div className="border-solid  border-indigo-600">
                  <Image src={preview != undefined ? preview : noImage}
                    width={300} height={300} alt="previewImage"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                </div>
                <input id="photo"
                  name="photo"
                  type="file"
                  accept="image/jpg, image/png, image/jpeg"
                  onChange={(e) => handleChange(e)}
                  // size={5000000}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-indigo-600
                  hover:file:bg-violet-10"
                />
              </div>

              {/* PARTE DO RESTANTE DO FORMULÁRIO */}
              <div className="rounded-md space-y-2 w-full max-w-lg">
                <div>
                  <label htmlFor="name" className="">Nome <span>*</span></label>
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
                  <label htmlFor="species" className="">Espécie</label>
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
                  <label htmlFor="notes" className="">Anotações</label>
                  <Field component="textarea"
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
      </Layout>
    </>
  )
}