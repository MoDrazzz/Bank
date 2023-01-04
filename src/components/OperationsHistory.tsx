import { useAuthContext } from "contexts/AuthContext";
import { FC, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Accent from "./Accent";
import FormField from "./FormField";
import Heading from "./Heading";
import Input from "./Input";
import Label from "./Label";
import OperationComponent from "./Operation";
import Paragraph from "./Paragraph";

const OperationsHistory: FC = () => {
  const { user } = useAuthContext();
  const [searchValue, setSearchValue] = useState("");
  const [operations, setOperations] = useState<Operation[]>([]);

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);

    const newOperations = user.operations.filter((operation) =>
      operation.title.toLowerCase().startsWith(e.target.value.toLowerCase())
    );

    setOperations(newOperations);
  };

  useEffect(() => {
    setOperations(user.operations);
  }, [user]);

  return (
    <aside className="flex flex-col items-center gap-5 overflow-y-hidden pt-12">
      <Heading>Operations History</Heading>
      <Accent />
      <div className="relative w-[90%]">
        <FormField
          type="text"
          name="searchOperations"
          value={searchValue}
          onChange={handleSearch}
          label="Filter by title"
        />
      </div>
      <ul className="grid gap-2 overflow-y-scroll">
        {!operations.length ? (
          <Paragraph>No operations found.</Paragraph>
        ) : (
          operations.map((operation) => (
            <OperationComponent key={operation.id} data={operation} />
          ))
        )}
      </ul>
    </aside>
  );
};
export default OperationsHistory;
