import { FC, useEffect, useState } from "react";
import { useAuthContext } from "contexts/AuthContext";
import Logo from "components/Logo";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import OperationsHistory from "components/UserOperationsHistory";
import Header from "components/Header";
import SideBar from "components/SideBar";
import AdminOperationsHistory from "components/AdminOperationsHistory";

const Root: FC = () => {
  const { user } = useAuthContext();
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setIsUserAdmin(user.type === "admin");
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="grid h-[100vh] grid-cols-[200px_1fr_30vw] grid-rows-[120px_1fr] bg-dark text-white">
        <div className="border-b-4 border-white pt-5">
          <Logo />
        </div>
        <Header />
        <SideBar isAdmin={isUserAdmin} />
        <main className="overflow-scroll border-x-4 border-white px-24 py-12">
          <Outlet context={{ isUserAdmin }} />
        </main>
        {isUserAdmin ? <AdminOperationsHistory /> : <OperationsHistory />}
      </div>
    </>
  );
};
export default Root;
