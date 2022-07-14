import { Formik, Form, Field, isEmptyArray } from "formik";
import Router from "next/router";
import { useContext, useState } from "react";
import Layout from "../../components/Layout";
import { AuthContext } from "../../contexts/AuthContext";
import { setNewPlant } from "../../services/plant-services";

interface IPlant {
  name: string
  species?: string
  notes?: string
  photo?: string | ArrayBuffer
  userId: string;
}

export default function Cadastro() {
  //TODO : Melhorar a estrutura de upload, e tornar um componente
  const { user } = useContext(AuthContext);
  const [photo, setPhoto] = useState<string | ArrayBuffer>()

    const initialValues: IPlant = {
    name: '',
    species: '',
    notes: '',
    photo: '',
    userId: user?.id
  }

  async function handleChange(event: any) {

    event.preventDefault();
    const file = event.target.files[0];
    // console.log(file);
    const reader = new FileReader();
    let blob = await fetch(file.objectURI).then(r => r.blob()); //blob:url
    reader.readAsDataURL(blob);

    reader.onloadend = function () {
      const base64data = reader.result;
      setPhoto(base64data.toString());
      console.log(base64data);
    }

  }



  async function handleCreate(plant: IPlant) {
    try {

      plant.photo = photo.toString();
    } catch (error) {
      console.log(error);

    }
    plant.userId = user.id;
    console.log(plant);
    await setNewPlant(plant);
    Router.push("/plants")
  }

  return (
    <>
      <Layout title="Cadastrar nova planta">
        <Formik initialValues={initialValues} onSubmit={handleCreate}>
          <Form action="#" method="POST">
            <div className="flex flex-row justify-around py-4 px-auto sm:flex-wrap">
              <div className="">
                <img id="previewImage" width={300} height={300} src="#" alt="previewImage" />
                <input id="photo" name="photo" type="file" accept="image/*" onChange={(e) => handleChange(e)} required={false} />
                {/* <input id="userId" name="userId" type="hidden" value={user.id} /> */}
              </div>
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
                    Cadastrar nova planta
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