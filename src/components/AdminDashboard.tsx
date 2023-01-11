import { useAuthContext } from "contexts/AuthContext";
import { FC } from "react";
import Heading from "./Heading";

const AdminDashboard: FC = () => {
  const { user } = useAuthContext();

  return (
    <>
      <h1>Hello admin!</h1>
    </>
  );
};

export default AdminDashboard;
