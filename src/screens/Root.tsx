import { FC } from "react";
import { useAuthContext } from "contexts/AuthContext";
import Logo from "components/Logo";
import { Navigate, Outlet } from "react-router-dom";
import OperationsHistory from "components/OperationsHistory";
import Sidebar from "components/SideBar";
import Header from "components/Header";

const Root: FC = () => {
  const { user } = useAuthContext();

  return (
    <>
      {user ? (
        <div className="grid h-[100vh] grid-cols-[200px_1fr_30vw] grid-rows-[120px_1fr] bg-dark">
          <div className="border-b-4 border-white pt-5">
            <Logo />
          </div>
          <Header />
          <Sidebar />
          <main className="overflow-scroll border-x-4 border-white px-24 py-12">
            <Outlet />
          </main>
          <OperationsHistory />
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};
export default Root;
