import { FC, useState } from "react";

const Authentication: FC = () => {
  const [formValues, setFormValues] = useState({
    login: "",
    password: "",
  });
  const [error, setError] = useState("");

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

        // User authenticated.
      })
      .catch((err) => console.log(err));
  };

  return (
    <form className="flex flex-col gap-2 rounded border-2 p-5">
      <label htmlFor="login">Login</label>
      <input
        className="text-dark"
        onChange={handleInputChange}
        type="text"
        name="login"
      />
      <label htmlFor="password">Password</label>
      <input
        className="text-dark"
        onChange={handleInputChange}
        type="password"
        name="password"
      />
      <button
        type="submit"
        onClick={handleLogin}
        className="rounded border-2 py-2 text-white disabled:opacity-20"
        disabled={!formValues.login || !formValues.password}
      >
        Login
      </button>
      {error}
    </form>
  );
};

export default Authentication;
