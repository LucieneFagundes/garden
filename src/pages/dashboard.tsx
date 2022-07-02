import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { Children, useContext } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";

export default function Dashboard({ children }: any) {
  const { user } = useContext(AuthContext)
  return (
    <>
      <div className="min-h-full">
        <Navbar user={user} />
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard

            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-auto" >
                {children}
              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['auth.token']: token } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}