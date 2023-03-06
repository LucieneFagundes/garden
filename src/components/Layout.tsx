import { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "./Navbar";

interface Props {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: Props) {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Navbar user={user} />
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
            <div className="border-collapse rounded-lg h-auto">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
}
