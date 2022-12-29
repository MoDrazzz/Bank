import Heading from "components/Heading";
import { useAuthContext } from "contexts/AuthContext";
import { FC } from "react";

const Dashboard: FC = () => {
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

export default Dashboard;
