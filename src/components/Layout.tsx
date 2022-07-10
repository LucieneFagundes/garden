import { ReactNode } from "react";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";

interface Props {
  children: ReactNode,
  title: string;
}

export default function Layout({ children, title }: Props) {

  return (
    <>
      <Navbar />
      <Dashboard title={title}>
        {children}
      </Dashboard>
    </>
  )
}