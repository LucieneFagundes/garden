import { Formik, Form, Field } from "formik";
import { useState } from "react";
import Layout from "../../components/Layout";

interface IPlant {
  name: string
  species: string
  notes: string
  photo: string | ArrayBuffer
}

export default function Cadastro() {
  //TODO : Melhorar a estrutura de upload
  const [ photo, setPhoto] = useState<string | ArrayBuffer>()

  async function handleChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURI).then(r => r.blob()); //blob:url
    reader.readAsDataURL(blob);
    
    reader.onloadend = function () {
      const base64data = reader.result;
      setPhoto( base64data)
      console.log(base64data);
    }

  }
  const initialValues: IPlant = {
    name: "",
    species: "",
    notes: "",
    photo: ""
  }

  function handleCreate(data: IPlant) {

    data.photo = photo;
    console.log(data,333333333);
    
  }

  return (
    <>
      <Layout title="Cadastrar nova planta">
        <Formik initialValues={initialValues} onSubmit={handleCreate}>
          <Form action="#" method="POST">
            <div className="flex flex-row justify-around py-4 px-auto sm:flex-wrap">
              <div className="">
                <img width={300} height={300} src="https://st.depositphotos.com/1055085/3389/i/600/depositphotos_33897773-stock-photo-artificial-tree.jpg" />

                <input id="photo" name="photo" type="file" onChange={(e) => handleChange(e)} />

              </div> 
              <div className="rounded-md space-y-2 w-full max-w-lg">
                <div>
                  <label htmlFor="name" className="">Nome</label>
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
                  <label htmlFor="species" className="">Espécie</label>
                  <Field
                    id="species"
                    name="species"
                    type="text"
                    className="appearance-none relative block w-full px-3 py-2 mt-1 first: border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Espécie"
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