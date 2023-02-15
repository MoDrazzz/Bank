import { useAuthContext } from "contexts/AuthContext";
import { FC, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Accent from "./Accent";
import FormField from "./FormField";
import Heading from "./Heading";
import Input from "./Input";
import Label from "./Label";
import List from "./List";
import AdminOperationComponent from "./AdminOperation";
import Paragraph from "./Paragraph";
import ListItem from "./ListItem";
import FilterOptionInput from "./FilterOptionInput";

const AdminOperationsHistory: FC = () => {
  const { operations } = useAuthContext();
  const [searchValue, setSearchValue] = useState("");
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>([]);
  const [filterOption, setFilterOption] = useState<"id" | "from" | "to">("id");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);

    const newOperations = operations.filter((operation) =>
      operation[filterOption]
        .toString()
        .startsWith(e.target.value.toLowerCase())
    );

    setFilteredOperations(newOperations);
  };

  const handleFilterOptionChange = (option: "id" | "from" | "to"): void => {
    setFilterOption(option);
    setSearchValue("");
    setFilteredOperations(operations);
  };

  useEffect(() => {
    setFilteredOperations(operations);
  }, [operations, filterOption]);

  return (
    <aside className="flex flex-col items-center gap-5 overflow-y-hidden pt-12">
      <Heading>Operations History</Heading>
      <Accent />
      <div className="relative grid w-[90%] gap-2">
        <div className="flex w-full justify-between">
          <Label htmlFor="searchOperations">Filter by:</Label>
          <div className="flex gap-5">
            <FilterOptionInput
              onChange={() => handleFilterOptionChange("id")}
              checked={filterOption === "id"}
              value="id"
            />
            <FilterOptionInput
              onChange={() => handleFilterOptionChange("from")}
              checked={filterOption === "from"}
              value="from"
            />
            <FilterOptionInput
              onChange={() => handleFilterOptionChange("to")}
              checked={filterOption === "to"}
              value="to"
            />
          </div>
        </div>
        <Input
          type="text"
          name="searchOperations"
          value={searchValue}
          onChange={handleSearch}
        />
      </div>
      <List>
        <li className="grid grid-cols-[1fr_120px_75px_75px] gap-3">
          <ListItem>ID</ListItem>
          <ListItem>AMOUNT</ListItem>
          <ListItem>FROM</ListItem>
          <ListItem>TO</ListItem>
        </li>
        {!filteredOperations.length ? (
          <Paragraph>No operations found.</Paragraph>
        ) : (
          filteredOperations
            .sort((a, b) => b.date - a.date)
            .map((operation) => (
              <AdminOperationComponent key={operation.id} data={operation} />
            ))
        )}
      </List>
    </aside>
  );
};
export default AdminOperationsHistory;
