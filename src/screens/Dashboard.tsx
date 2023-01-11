import AdminDashboard from "components/AdminDashboard";
import UserDashboard from "components/UserDashboard";
import { FC } from "react";
import { useOutletContext } from "react-router-dom";

interface OutletContext {
  isAdmin: boolean;
}

const Dashboard: FC = () => {
  const { isAdmin } = useOutletContext<OutletContext>();

  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
