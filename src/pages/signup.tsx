import { ArrowLeftIcon, LockClosedIcon, LoginIcon, PencilAltIcon } from "@heroicons/react/outline";
import { Formik, Form, Field } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../public/logo.png"

export default function SignUp() {

  interface ISignUp {
    name: string;
    email: string;
    password: string;
  }

  const { signUp } = useContext(AuthContext)
  const initialValues = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  }

  async function handleSignUp({ name, email, password }: ISignUp) {
    await signUp({ name, email, password })
  }


  return (
    <>
      <div className="h-screen flex items-center justify-center sm:px-6 bg-brand-100">
        <div className="max-w-md w-full space-y-4">
          <div className="flex flex-col items-center">
            <Image
              className="mx-auto h-28 w-auto"
              src={logo}
              width={150}
              height={190}
              alt="Logo"
            />
            <h2 className="text-center text-3xl font-light text-gray-900">GARDENE</h2>
          </div>
          <div className="border rounded-md px-4 shadow-md shadow-slate-400 bg-gray-50 xs:mx-2 xs:px-2">
            <Formik initialValues={initialValues} onSubmit={handleSignUp}>
              <Form className="mt-4 space-y-6" action="#" method="POST">
                <h3 className="border-b text-center text-gray-900">Cadastre-se</h3>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md space-y-2">
                  <div>
                    <label htmlFor="name" className="sr-only" />
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      placeholder="Nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="email-address" className="sr-only" />
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
                    <label htmlFor="password" className="sr-only" />
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      placeholder="Senha"
                    />
                  </div>
                  <div>
                    <label htmlFor="passwordConfirm" className="sr-only" />
                    <Field
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      placeholder="Confirmação de senha"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LoginIcon className="h-5 w-5 text-green-300 group-hover:text-green-100" aria-hidden="true" />
                    </span>
                    Cadastrar-me
                  </button>
                </div>
                <div className="flex items-center justify-end pb-2 xs:justify-center">
                  <Link href="/">
                    <a className="flex flex-row gap-1 text-sm font-medium text-green-600 hover:text-green-700 hover:font-bold">
                      <ArrowLeftIcon className="w-3" />
                      Já tenho cadastro
                    </a>
                  </Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}