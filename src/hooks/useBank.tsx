import axios from "axios";
import { AuthActions, useAuthContext } from "contexts/AuthContext";
import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

interface Credentials {
  login: string;
  password: string;
}

const useBank = () => {
  const now = Date.now();

  const [error, setError] = useState("");
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (credentials: Credentials, isInitial?: boolean) => {
    const userResponse = await axios
      .get(`http://localhost:3000/users?login=${credentials.login}`)
      .catch((err) => console.log(err));

    const user = userResponse?.data[0];

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

    if (isInitial) {
      navigate("/dashboard");
    }
  };

  const logout = () => {
    dispatch({ type: AuthActions.logout });
  };

  const transfer = async (
    receiversAccountNumber: string,
    amount: number,
    title: string
  ): Promise<void | number> => {
    if (!user) {
      return navigate("/");
    }

    // first of all check if receiver's account number is not the user's one ( ͡° ͜ʖ ͡°)
    if (receiversAccountNumber == user.accountNumber) {
      setError("Provided account number is the same as yours. Nice try!");
      return;
    }

    // check if receiver exists
    const receiverResponse = await axios
      .get<[User]>(
        `http://localhost:3000/users?accountNumber=${receiversAccountNumber}`
      )
      .catch((err) => console.log(err));

    if (!receiverResponse?.data[0]) {
      setError("Provided receiver's account number is invalid.");
      return;
    }

    const [receiver] = receiverResponse.data;

    // check amount <= balance
    if (user.balance < amount) {
      setError("You do not have enough money to perform this operation.");
      return;
    }

    // reset errors
    setError("");

    // create operation-like object for sender.
    const sendersOperation: Operation = {
      id: now,
      type: "outgoing",
      amount,
      date: now,
      title,
      receiver: receiver.id,
    };

    // create operation-like object for receiver.
    const receiversOperation: Operation = {
      id: now,
      type: "incoming",
      amount,
      date: now,
      title,
      sender: user.id,
    };

    console.log(sendersOperation, receiversOperation);

    // change sender's balance
    // add operation to sender's operation hisotry.
    const newSendersBalance: number = user.balance - amount;
    axios.patch(`http://localhost:3000/users/${user.id}`, {
      balance: newSendersBalance,
      operations: [sendersOperation, ...user.operations],
    });

    // change receiver's balance
    // add operation to receive's operation history.
    const newReceiversBalance: number = receiver.balance + amount;
    axios.patch(`http://localhost:3000/users/${receiver.id}`, {
      balance: newReceiversBalance,
      operations: [receiversOperation, ...receiver.operations],
    });

    // update current user state in AuthContext.
    login({ login: user.login, password: user.password });

    return 200;
  };

  return {
    error,
    login,
    logout,
    transfer,
  };
};

export default useBank;
