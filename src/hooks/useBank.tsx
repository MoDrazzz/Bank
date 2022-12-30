import { AuthActions, useAuthContext } from "contexts/AuthContext";
import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

interface Credentials {
  login: string;
  password: string;
}

const useBank = () => {
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = (user: User, credentials: Credentials) => {
    if (!user) {
      setError("No user of given login found.");
      return;
    }
    if (user.password != credentials.password) {
      setError("Password is not valid.");
      return;
    }

    setError("");

    flushSync(() => {
      dispatch({ type: AuthActions.login, payload: user });
    });

    navigate("/dashboard");
  };

  const logout = () => {
    dispatch({ type: AuthActions.logout });
  };

  return {
    error,
    login,
    logout,
  };
};

export default useBank;
