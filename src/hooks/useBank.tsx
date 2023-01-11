import axios from "axios";
import { useAuthContext } from "contexts/AuthContext";
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
  const { user, dispatchUser, setCards } = useAuthContext();
  const navigate = useNavigate();

  const login = async (
    credentials: Credentials,
    isInitial?: boolean,
    isAdmin?: boolean
  ) => {
    const userResponse = await axios
      .get(
        `http://localhost:3000/${isAdmin ? "admins" : "users"}?login=${
          credentials.login
        }`
      )
      .catch((err) => console.log(err));

    // !userResponse.data -> no database connection
    // !userResponse.data[0] -> no user found

    if (!userResponse?.data) {
      setError("Can not connect to the database.");
      return;
    }
    if (!userResponse.data[0]) {
      setError("No user of given login found.");
      return;
    }

    const user: User = userResponse.data[0];

    if (user.password != credentials.password) {
      setError("Password is not valid.");
      return;
    }

    setError("");

    const cardsResponse = await axios
      .get(`http://localhost:3000/cards?ownerID=${user.id}`)
      .catch((err) => console.log(err));

    flushSync(() => {
      if (cardsResponse?.data.length) {
        setCards(cardsResponse.data);
      }
      dispatchUser({ type: "LOGIN", payload: user });
    });

    if (isInitial) {
      navigate("/dashboard", {
        state: {
          isAdmin,
        },
      });
    }
  };

  const logout = () => {
    dispatchUser({ type: "LOGOUT", payload: null });
    setCards([]);
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

    // calculate new balances
    const newSenderBalance: number = parseFloat(
      (user.balance - amount).toFixed(2)
    );
    const newReceiverBalance: number = parseFloat(
      (receiver.balance + amount).toFixed(2)
    );

    // create operation-like object for sender.
    const senderOperation: Operation = {
      id: now,
      type: "outgoing",
      amount,
      date: now,
      title,
      receiver: receiver.id,
      balanceAfterOperation: newSenderBalance,
    };

    // create operation-like object for receiver.
    const receiverOperation: Operation = {
      id: now,
      type: "incoming",
      amount,
      date: now,
      title,
      sender: user.id,
      balanceAfterOperation: newReceiverBalance,
    };

    // console.log(senderOperation, receiverOperation);

    // change sender's balance
    // add operation to sender's operation hisotry.
    await axios.patch(`http://localhost:3000/users/${user.id}`, {
      balance: newSenderBalance,
      operations: [senderOperation, ...user.operations],
    });

    // change receiver's balance
    // add operation to receive's operation history.
    await axios.patch(`http://localhost:3000/users/${receiver.id}`, {
      balance: newReceiverBalance,
      operations: [receiverOperation, ...receiver.operations],
    });

    // update current user state in AuthContext.
    login({ login: user.login, password: user.password });

    return 200;
  };

  const getPendingCardRequests = async (): Promise<PendingCardRequest[]> => {
    const cardsResponse = await axios
      .get(`http://localhost:3000/cards?requestPending=true`)
      .catch((err) => console.log(err));

    if (!cardsResponse?.data) {
      setError("Can not connect to the database.");
      return [];
    }

    const cards: Card[] = [...cardsResponse.data];

    const requests = await Promise.all(
      cards.map(async (card) => {
        const ownerRequest = await axios
          .get(`http://localhost:3000/users?id=${card.ownerID}`)
          .catch((err) => console.log(err));

        return {
          card,
          owner: ownerRequest?.data[0],
        };
      })
    );

    return requests;
  };

  return {
    error,
    setError,
    login,
    logout,
    transfer,
    getPendingCardRequests,
  };
};

export default useBank;
