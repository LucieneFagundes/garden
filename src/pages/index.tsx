import { parseCookies } from "nookies";
import Layout from "../components/Layout";

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

  return {
    props: {  }
  }
}

export default function Home () {

  return(
  <Layout title="Dashboard">

  </Layout>
  )
}