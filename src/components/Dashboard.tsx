import { useContext } from "react";
import Navbar from "./Navbar";
import { AuthContext } from "../contexts/AuthContext";
import { Button } from "primereact/button";

export default function Dashboard({ children, title }: any) {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="min-h-full">
        {/* <Navbar user={user} /> */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-1 sm:px-0">
              <div className="border-collapse  rounded-lg h-auto">
                {children}
              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  );
}
