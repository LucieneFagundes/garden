import { Formik, Form, Field } from "formik";
import Image from "next/image";
import { parseCookies } from "nookies";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { recoveryUser, updateUser } from "../../services/user-service";
import { getBase64Image } from "../../utils/utils";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeftIcon, ClipboardIcon } from "@heroicons/react/outline";

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

interface IUser {
  id: string;
  name: string;
  email: string;
  photo: string;
}

export default function UpdateProfile({ dataUser }) {
  const { user, setUpdateUser } = useContext(AuthContext);
  const [image, setImage] = useState(undefined);
  const nav = useRouter();

  const initualValues: IUser = {
    id: dataUser.id,
    name: dataUser.name,
    email: dataUser.email,
    photo: dataUser.photo || null,
  };

  async function handleChange(event: any) {
    if (!event || event === 0) {
      setImage(undefined);
      return;
    }

    const file = event;
    const fileBase64 = await getBase64Image(file);
    setImage(fileBase64);
  }

  async function handleSubmit(userToSave: any) {
    try {
      if (!image) {
        userToSave.photo = dataUser.photo;
      } else {
        userToSave.photo = image;
      }

      await updateUser(userToSave);
      setUpdateUser(userToSave);
      nav.push("/profile");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout title="Editar meus dados">
      <>
        <div className="flex justify-end my-1">
          <Link href={"/profile"}>
            <a
              className="relative py-2 px-4 border border-transparent text-sm font-medium rounded-md
            text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              flex items-center
            "
            >
              <ArrowLeftIcon className="h-5 w-5 pr-1 text-white group-hover:text-white" />
              voltar
            </a>
          </Link>
        </div>
        <Formik
          initialValues={initualValues}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="flex flex-row justify-around py-4 px-auto sm:flex-wrap xs:flex-wrap">
                <div className="flex flex-col w-auto items-center xs:w-3/4 gap-2">
                  <Image
                    src={image || dataUser.photo}
                    width={300}
                    height={300}
                    alt="Imagem de perfil"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                  <label htmlFor="photo" className="sr-only"></label>
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/jpg, image/png, image/jpeg"
                    capture
                    onChange={(e) =>
                      setFieldValue(
                        "photo",
                        handleChange(e.currentTarget.files[0])
                      )
                    }
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-indigo-600
                hover:file:bg-violet-10"
                  />
                </div>
                <div className="rounded-md space-y-2 w-full max-w-lg xs:pt-3">
                  <div>
                    <label htmlFor="name" className="sr-only">
                      ID:{" "}
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="sr-only"
                      value={dataUser.id}
                      disabled
                    />
                  </div>
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
                      className="w-full relative py-2 px-4 border border-transparent text-sm font-medium rounded-md
                  text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  flex items-center justify-center"
                    >
                      <ClipboardIcon className="h-5 w-5 pr-1 text-white group-hover:text-white" />
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </>
    </Layout>
  );
}
