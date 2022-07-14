import { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";

interface Props {
  children: ReactNode,
  title: string;
}

export default function Layout({ children, title }: Props) {
  const {user} = useContext(AuthContext)
  return (
    <>
      <Navbar user={user}/>
      <Dashboard title={title}>
        {children}
      </Dashboard>
    </>
  )
}