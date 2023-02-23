import { parseCookies } from "nookies";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Image from "next/image";
import Layout from "../components/Layout";
import avatar from "../public/avatar.jpg";
import { getBase64Image } from "../utils/utils";
import { Field, Form, Formik } from "formik";
import { updateUser, recoveryUser } from "../services/user-service";

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
  const { id } = JSON.parse(token);
  const dataUser = await recoveryUser(id, ctx);
  return {
    props: { dataUser },
  };
}

interface ProfileProps {
  id: string;
  name: string;
  email: string;
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  photo: string;
}

export default function Profile({ id }: ProfileProps) {
  const { user, setUpdateUser } = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(undefined);

  const initialValues = {
    id: id,
    name: user?.name || "",
    email: user?.email || "",
  };

  async function handleChange(event: any) {
    event.preventDefault();
    if (!event.target.files || event.target.files === 0) {
      setImage(undefined);
      return;
    }

    const file = event.target.files[0];
    const fileBase64 = await getBase64Image(file);
    setImage(fileBase64);
  }

  async function handleSubmit(userToSave: CurrentUser) {
    try {
      userToSave.photo = image;
    } catch (error) {
      console.log(error);
    }
    await updateUser(userToSave);
    setUpdateUser(userToSave);
    setIsEdit(!isEdit);
  }

  return (
    <>
      <Layout title="Meu perfil">
        <div className="flex justify-end my-1">
          <button
            className="relative py-2 px-4 border border-transparent text-sm font-medium rounded-md
          text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setIsEdit(!isEdit)}
          >
            {isEdit ? "voltar" : "editar"}
          </button>
        </div>
        {user && (
          <>
            {!isEdit ? (
              <div className="flex flex-row justify-around py-4 px-auto sm:flex-wrap xs:flex-wrap">
                <div className="flex flex-col w-auto items-center xs:w-3/4 gap-2 mx-1">
                  <Image
                    src={user.photo ? user.photo : avatar}
                    width={300}
                    height={300}
                    alt="Imagem de perfil"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                </div>
                <div className="rounded-md space-y-2 w-full max-w-lg xs:pt-3">
                  <div className="flex flex-row items-center gap-2 ">
                    <p>Nome:</p>
                    <p className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md sm:text-sm">
                      {user.name}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-2 ">
                    <p>Email:</p>
                    <p className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md sm:text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Formik onSubmit={handleSubmit} initialValues={initialValues}>
                <Form>
                  <div className="flex flex-row justify-around py-4 px-auto sm:flex-wrap xs:flex-wrap">
                    <div className="flex flex-col w-auto items-center xs:w-3/4 gap-2">
                      <Image
                        src={!user.photo ? avatar : user.photo}
                        width={300}
                        height={300}
                        alt="Imagem de perfil"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                      <Field
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/jpg, image/png, image/jpeg"
                        capture
                        defaultValue={image}
                        onChange={(e) => handleChange(e)}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-indigo-600
                  hover:file:bg-violet-10"
                      />
                    </div>
                    <div className="rounded-md space-y-2 w-full max-w-lg xs:pt-3">
                      <div>
                        <label htmlFor="name">Nome: </label>
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="email">Email</label>
                        <Field
                          type="text"
                          name="email"
                          id="email"
                          className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md sm:text-sm"
                        />
                      </div>
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          className="relative py-2 px-4 border border-transparent text-sm font-medium rounded-md
                    text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </Formik>
            )}
          </>
        )}
      </Layout>
    </>
  );
}
