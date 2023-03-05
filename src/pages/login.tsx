import type { NextPage } from "next";
import { LockClosedIcon } from "@heroicons/react/outline";
import { Toast } from "primereact/toast";
import { Formik, Form, Field } from "formik";
import { useContext, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.png";

interface ISignIn {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const { signIn } = useContext(AuthContext);
  const toast = useRef(null);

  const initialValues = {
    email: "",
    password: "",
  };

  const showError = (message: string) => {
    toast.current.show({
      severity: "error",
      summary: "Algo deu errado",
      detail: message,
      life: 5000,
    });
  };

  async function handleSignIn({ email, password }: ISignIn) {
    try {
      await signIn({ email, password });
    } catch (error) {
      showError(error.response.data.message);
    }
  }

  return (
    <>
      <div className="h-screen flex items-center justify-center sm:px-6 bg-brand-100">
        <div className="max-w-md w-full space-y-4">
          <div className="border rounded-md px-4 shadow-md shadow-slate-400 bg-gray-50 xs:mx-2 xs:px-2">
            <div className="flex flex-col items-center pt-3">
              <Image
                className="mx-auto h-28 w-auto"
                src={logo}
                width={150}
                height={190}
                alt="Logo"
              />
              <h2 className="mt-6 text-center text-3xl font-light text-gray-900">
                GARDENE
              </h2>
            </div>
            <Formik initialValues={initialValues} onSubmit={handleSignIn}>
              <Form className="mt-4 space-y-6" action="#" method="POST">
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md space-y-2">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <Field
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      placeholder="E-mail"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      placeholder="Senha"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockClosedIcon
                        className="h-5 w-5 text-green-300 group-hover:text-green-100"
                        aria-hidden="true"
                      />
                    </span>
                    Entrar
                  </button>
                </div>

                <div className="flex flex-row items-center justify-between pb-2 text-sm font-medium">
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-700 hover:font-bold"
                    title="In development"
                  >
                    Esqueceu a senha?
                  </a>
                  <Link href="/signup">
                    <a className="flex flex-row gap-1 text-green-600 hover:text-green-700 hover:font-bold  ">
                      Criar uma conta
                    </a>
                  </Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      <Toast ref={toast} />
    </>
  );
};

export default Login;
