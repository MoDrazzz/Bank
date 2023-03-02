import { useAuthContext } from "contexts/AuthContext";
import { FC, useEffect, useState } from "react";
import Heading from "./Heading";
import useBank from "hooks/useBank";
import { Navigate } from "react-router-dom";

const UserDashboard: FC = () => {
  const { user, activeAccount } = useAuthContext();
  const { getSpecifiedData, error } = useBank();
  const [userAccounts, setUserAccounts] = useState<Account[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!user) return;

    const getAccounts = async () => {
      const res = await getSpecifiedData("userAccounts", user.id);

      if (res) {
        setUserAccounts(res);
        setIsFetching(false);
      }
    };
    getAccounts();
  }, [activeAccount]);

  if (!user) {
    return <Navigate to="/" />;
  }
  return (
    <>
      {error && <Heading>{error}</Heading>}
      {isFetching ? (
        <Heading>Loading...</Heading>
      ) : (
        <>
          <Heading>
            Balance:{" "}
            <span className="text-primary">{activeAccount?.balance}$</span>
          </Heading>
          <p>Account number: {activeAccount?.number}</p>
        </>
      )}
    </>
  );
};

export default UserDashboard;
