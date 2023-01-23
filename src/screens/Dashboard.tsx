import AdminDashboard from "components/AdminDashboard";
import UserDashboard from "components/UserDashboard";
import { FC } from "react";
import { useOutletContext } from "react-router-dom";

interface OutletContext {
  isUserAdmin: boolean;
}

const Dashboard: FC = () => {
  const { isUserAdmin } = useOutletContext<OutletContext>();

  return isUserAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
