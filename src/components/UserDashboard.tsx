import { useAuthContext } from "contexts/AuthContext";
import { FC } from "react";
import Heading from "./Heading";

const UserDashboard: FC = () => {
  const { user } = useAuthContext();

  return (
    <>
      <Heading>
        Balance: <span className="text-primary">{user?.balance}$</span>
      </Heading>
      <p>Account number: {user?.accountNumber}</p>
    </>
  );
};

export default UserDashboard;
