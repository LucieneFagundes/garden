import { Field, Form, Formik } from "formik";
import Image from "next/image";
import Router from "next/router";
import { parseCookies } from "nookies";
import Layout from "../../components/Layout";
import { getPlantByIdRequest, setPlantUpdate } from "../../services/plant-services";
import noImage from "../../public/noImage.png";

interface IPlant {
  data: {
    id: string;
    name: string;
    species?: string;
    notes?: string;
    photo?: string;
  }
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

  const id = ctx.query.id;
  const data = await getPlantByIdRequest(id, ctx);

  return {
    props: { data }
  }
}



export default function Plant({ data }: IPlant) {
  const { name, species, photo, notes } = data;

  const initialValues = { name, species, photo, notes, }

  async function handleUpdate({ id, name, species, photo, notes }) {
    try {
      await setPlantUpdate({ id: data.id, name, species, photo, notes })
      Router.push('/plants')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Layout title={`Editar ${name}`}>
        <Formik initialValues={initialValues} onSubmit={handleUpdate}>
          <Form action="#" method="POST">
            <div className="flex flex-row justify-around py-4 px-auto sm:flex-wrap">
              <div className="">
                {/* TODO : Manipulação de imagem para edição*/}
                <Image width={300} height={300} src={photo ? photo : noImage} alt="Plant photo" />
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
                    Salvar mudanças
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