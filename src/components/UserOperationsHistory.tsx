import { useAuthContext } from "contexts/AuthContext";
import { FC, useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Accent from "./Accent";
import FormField from "./FormField";
import Heading from "./Heading";
import Input from "./Input";
import Label from "./Label";
import List from "./List";
import UserOperation from "./UserOperation";
import Paragraph from "./Paragraph";
import useBank from "hooks/useBank";
import Button from "./Button";

const UserOperationsHistory: FC = () => {
  // const { operations } = useAuthContext();
  const { user, activeAccount } = useAuthContext();
  const { getSpecifiedData, error } = useBank();
  const [userOperations, setUserOperations] = useState<Operation[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>([]);

  const getOperations = useCallback(async () => {
    if (!user || !activeAccount) return;
    const res = await getSpecifiedData("userOperations", activeAccount.id);

    if (res) {
      setFilteredOperations(res);
      setUserOperations(res);
    }

    setIsFetching(false);
  }, [activeAccount, user]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);

    const newOperations = userOperations.filter((operation) =>
      operation.title.toLowerCase().startsWith(e.target.value.toLowerCase())
    );

    setFilteredOperations(newOperations);
  };

  // useEffect(() => {
  //   setFilteredOperations(operations);
  // }, [operations]);
  useEffect(() => {
    if (!activeAccount || !user) return;
    getOperations();
  }, [activeAccount, user]);

  const handleRefresh = async () => {
    setIsFetching(true);
    await getOperations();
    setIsFetching(false);
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <aside className="flex flex-col items-center gap-5 overflow-y-hidden px-[5%] pt-12">
      <Heading>Operations History</Heading>
      <Accent />
      <div className="flex w-full items-end gap-5">
        <FormField
          type="text"
          name="searchOperations"
          value={searchValue}
          onChange={handleSearch}
          label="Filter by title"
        />
        <Button onClick={handleRefresh}>Refresh</Button>
      </div>
      <List>
        {isFetching ? (
          <Paragraph>Loading...</Paragraph>
        ) : !filteredOperations.length ? (
          <Paragraph>No operations found.</Paragraph>
        ) : (
          filteredOperations
            .sort((a, b) => b.date - a.date)
            .map((operationData) => (
              <UserOperation key={operationData.id} data={operationData} />
            ))
        )}
      </List>
    </aside>
  );
};
export default UserOperationsHistory;
