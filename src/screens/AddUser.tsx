import Button from "components/Button";
import FormField from "components/FormField";
import Heading from "components/Heading";
import Paragraph from "components/Paragraph";
import useBank from "hooks/useBank";
import { FC, useEffect, useState } from "react";

const AddUser: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const { addUser, error } = useBank();
  const [stage, setStage] = useState(1);
  const [newUser, setNewUser] = useState<User>();

  const handleAddUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const result = await addUser(inputValue);

    if (result.status === 200 && result.user) {
      setInputValue("");
      setNewUser(result.user);
      setStage(2);
    }
  };

  return (
    <div className="grid justify-items-start gap-5">
      <Heading>Add User</Heading>
      {stage === 1 ? (
        <>
          <Paragraph>
            Enter new user's full name and the rest will be generated
            automatically.
          </Paragraph>
          <form className="grid w-96 justify-items-start gap-5">
            <FormField
              name="fullName"
              label="Full Name"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
            />
            <Button
              onClick={handleAddUser}
              disabled={inputValue.trim().length === 0}
            >
              Add User
            </Button>
          </form>
        </>
      ) : stage === 2 ? (
        <>
          <Paragraph>New user's data is shown below.*</Paragraph>
          <ul>
            <li>
              <Paragraph>Full Name: {newUser?.fullName}</Paragraph>
            </li>
            <li>
              <Paragraph>Login: {newUser?.login}</Paragraph>
            </li>
            <li>
              <Paragraph>Password: {newUser?.password}</Paragraph>
            </li>
            <li>
              <Paragraph>Account number: {newUser?.accountNumber}</Paragraph>
            </li>
          </ul>
          <Button onClick={() => setStage(1)}>Add another user</Button>
          <Paragraph>* Only for mockup purposes.</Paragraph>
        </>
      ) : null}
      {error && <Paragraph>{error}</Paragraph>}
    </div>
  );
};

export default AddUser;
