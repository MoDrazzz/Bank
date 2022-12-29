import { useAuthContext } from "contexts/AuthContext";
import { FC } from "react";
import Accent from "./Accent";
import Heading from "./Heading";
import Operation from "./Operation";

const OperationsHistory: FC = () => {
  const { user } = useAuthContext();

  return (
    <aside className="flex flex-col items-center gap-5 pt-12">
      <Heading>Operations History</Heading>
      <Accent />
      <ul className="grid gap-2">
        {user?.operations.map((operation) => (
          <Operation key={operation.id} data={operation} />
        ))}
      </ul>
    </aside>
  );
};
export default OperationsHistory;
