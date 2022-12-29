import Button from "components/Button";
import FormField from "components/FormField";
import Heading from "components/Heading";
import Input from "components/Input";
import Label from "components/Label";
import { AuthActions, useAuthContext } from "contexts/AuthContext";
import { FC, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

const Authentication: FC = () => {
  const [formValues, setFormValues] = useState({
    login: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    fetch(`http://localhost:3000/users?login=${formValues.login}`)
      .then((res) => res.json())
      .then(([user]) => {
        if (!user) {
          return setError("No user of given login found.");
        }
        if (user.password != formValues.password) {
          return setError("Password is not valid.");
        }

        setError("");

        flushSync(() => {
          dispatch({ type: AuthActions.login, payload: user });
        });

        navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={"grid h-[100vh] place-items-center bg-dark"}>
      <form className="relative flex w-[25vw] flex-col items-center gap-5 rounded border-2 p-12">
        <FormField
          name="login"
          label="Login"
          onChange={handleInputChange}
          type="text"
        />
        <FormField
          name="password"
          label="Password"
          onChange={handleInputChange}
          type="password"
        />
        <Button
          onClick={handleLogin}
          disabled={!formValues.login || !formValues.password}
        >
          Login
        </Button>
        <p className="absolute bottom-0 h-12 text-center leading-[3rem] text-red">
          {error}
        </p>
      </form>
    </div>
  );
};

export default Authentication;
