import { useAuthContext } from "contexts/AuthContext";
import { FC, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Accent from "./Accent";
import FormField from "./FormField";
import Heading from "./Heading";
import Input from "./Input";
import Label from "./Label";
import List from "./List";
import OperationComponent from "./Operation";
import Paragraph from "./Paragraph";

const OperationsHistory: FC = () => {
  const { operations } = useAuthContext();
  const [searchValue, setSearchValue] = useState("");
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);

    const newOperations = operations.filter((operation) =>
      operation.title.toLowerCase().startsWith(e.target.value.toLowerCase())
    );

    setFilteredOperations(newOperations);
  };

  useEffect(() => {
    setFilteredOperations(operations);
  }, [operations]);

  return (
    <aside className="flex flex-col items-center gap-5 overflow-y-hidden px-[5%] pt-12">
      <Heading>Operations History</Heading>
      <Accent />
      <FormField
        type="text"
        name="searchOperations"
        value={searchValue}
        onChange={handleSearch}
        label="Filter by title"
      />
      <List>
        {!filteredOperations.length ? (
          <Paragraph>No operations found.</Paragraph>
        ) : (
          filteredOperations
            .sort((a, b) => b.date - a.date)
            .map((operation) => (
              <OperationComponent key={operation.id} data={operation} />
            ))
        )}
      </List>
    </aside>
  );
};
export default OperationsHistory;
