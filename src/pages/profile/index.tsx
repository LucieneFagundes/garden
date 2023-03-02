import { parseCookies } from "nookies";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Image from "next/image";
import Layout from "../../components/Layout";
import avatar from "../../public/avatar.jpg";
import Link from "next/link";

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

  return {
    props: {},
  };
}

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Layout title="Meu perfil">
        <div className="flex justify-end my-1">
          <Link href={"/profile/update"}>
            <a
              className="relative py-2 px-4 border border-transparent text-sm font-medium rounded-md
            text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              editar
            </a>
          </Link>
        </div>
        {user && (
          <>
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
          </>
        )}
      </Layout>
    </>
  );
}
