import { FC } from "react";
import { useAuthContext } from "contexts/AuthContext";
import Logo from "components/Logo";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import OperationsHistory from "components/OperationsHistory";
import UserSidebar from "components/UserSideBar";
import AdminSidebar from "components/AdminSideBar";
import Header from "components/Header";
import SideBar from "components/SideBar";

const Root: FC = () => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const {
    state: { isAdmin },
  } = useLocation();

  return (
    <>
      <div className="grid h-[100vh] grid-cols-[200px_1fr_30vw] grid-rows-[120px_1fr] bg-dark">
        <div className="border-b-4 border-white pt-5">
          <Logo />
        </div>
        <Header />
        <SideBar isAdmin={isAdmin} />
        <main className="overflow-scroll border-x-4 border-white px-24 py-12">
          <Outlet context={{ isAdmin }} />
        </main>
        {isAdmin ? null : <OperationsHistory />}
      </div>
    </>
  );
};
export default Root;
