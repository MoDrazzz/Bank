import Button from "components/Button";
import FormField from "components/FormField";
import { FC, useState } from "react";
import { flushSync } from "react-dom";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useBank from "hooks/useBank";

interface Props {
  isAdmin?: boolean;
}

const Authentication: FC<Props> = ({ isAdmin = false }) => {
  const { error, login, setError } = useBank();

  const [formValues, setFormValues] = useState({
    login: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    if (
      formValues.login.length != parseInt(formValues.login).toString().length
    ) {
      setError("Wrong login submitted");
      return;
    }

    login(
      { login: parseInt(formValues.login), password: formValues.password },
      true,
      isAdmin
    );
  };

  return (
    <div className={"grid h-[100vh] place-items-center bg-dark"}>
      <form className="relative flex w-[25vw] flex-col items-center gap-5 rounded border-2 p-12">
        <FormField
          name="login"
          label="Login"
          onChange={handleInputChange}
          type="text"
          value={formValues.login}
        />
        <FormField
          name="password"
          label="Password"
          onChange={handleInputChange}
          type="password"
          value={formValues.password}
        />
        <Button
          onClick={handleLogin}
          disabled={!formValues.login || !formValues.password}
        >
          {isAdmin ? "Login As Admin" : "Login"}
        </Button>
        {error && (
          <p className="absolute bottom-0 h-12 text-center leading-[3rem] text-red">
            {error}
          </p>
        )}
        <Link to="/admin">Login as admin {"->"}</Link>
      </form>
    </div>
  );
};

export default Authentication;
