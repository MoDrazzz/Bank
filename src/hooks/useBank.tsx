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

  const transfer = async (
    receiversAccountNumber: string,
    amount: number,
    title: string
  ) => {
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
    if (!user) {
      return navigate("/");
    }

    if (user.balance < amount) {
      setError("You do not have enough money to perform this operation.");
      return;
    }

    // reset errors
    setError("");

    // create operation-like object for sender.
    const senderOperation: Operation = {
      id: now,
      type: "outgoing",
      amount,
      date: now,
      title,
      receiver: receiver.id,
    };

    // create operation-like object for receiver.
    const receiverOperation: Operation = {
      id: now,
      type: "incoming",
      amount,
      date: now,
      title,
      receiver: receiver.id,
    };

    console.log(senderOperation, receiverOperation);

    // change sender's balance
    const newSendersBalance: number = user.balance - amount;
    axios.patch(`http://localhost:3000/users/${user.id}`, {
      balance: newSendersBalance,
    });

    // change receiver's balance
    const newReceiversBalance: number = receiver.balance + amount;
    axios.patch(`http://localhost:3000/users/${receiver.id}`, {
      balance: newReceiversBalance,
    });

    // add operation to sender's operation hisotry.
    // add operation to receive's operation history.
  };

  return {
    error,
    login,
    logout,
    transfer,
  };
};

export default useBank;
