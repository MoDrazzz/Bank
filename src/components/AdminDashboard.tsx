import { useAuthContext } from "contexts/AuthContext";
import { FC } from "react";
import Heading from "./Heading";

const AdminDashboard: FC = () => {
  return (
    <>
      <Heading>Hello admin!</Heading>
    </>
  );
};

export default AdminDashboard;
