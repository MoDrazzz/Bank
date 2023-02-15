import axios from "axios";
import { useAuthContext } from "contexts/AuthContext";
import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

interface Credentials {
  login: number;
  password: string;
}

interface AddUserReturnValue {
  status: 200 | 400;
  user: null | User;
}

const useBank = () => {
  const [error, setError] = useState("");
  const { user, dispatchUser, cards, setCards, setOperations } =
    useAuthContext();
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

    if (isAdmin) {
      const cardRequestsResponse = await axios
        .get(`http://localhost:3000/cards?requestPending=true`)
        .catch((err) => console.log(err));
      const operations = await axios
        .get(`http://localhost:3000/operations`)
        .catch((err) => console.log(err));

      if (!cardRequestsResponse?.data || !operations?.data) {
        return setError("Something went wrong.");
      }

      flushSync(() => {
        setCards(cardRequestsResponse.data);
        setOperations(operations.data);
        dispatchUser({ type: "LOGIN", payload: user });
      });
    } else {
      const cardsResponse = await axios
        .get(`http://localhost:3000/cards?ownerID=${user.id}`)
        .catch((err) => console.log(err));
      const operationsToUserResponse = await axios
        .get(`http://localhost:3000/operations?to=${user.id}`)
        .catch((err) => console.log(err));
      const operationsFromUserResponse = await axios
        .get(`http://localhost:3000/operations?from=${user.id}`)
        .catch((err) => console.log(err));

      if (
        !operationsToUserResponse?.data ||
        !operationsFromUserResponse?.data ||
        !cardsResponse?.data
      ) {
        return setError("Something went wrong.");
      }

      const userOperations = operationsToUserResponse.data.concat(
        operationsFromUserResponse.data
      );

      flushSync(() => {
        setCards(cardsResponse.data);
        setOperations(userOperations);
        dispatchUser({ type: "LOGIN", payload: user });
      });
    }

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
    if (!user) return navigate("/");

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

    const now = Date.now();

    // // create operation-like object for sender.
    // const senderOperation: Operation = {
    //   id: now,
    //   type: "outgoing",
    //   amount,
    //   date: now,
    //   title,
    //   receiver: receiver.id,
    //   balanceAfterOperation: newSenderBalance,
    // };

    // // create operation-like object for receiver.
    // const receiverOperation: Operation = {
    //   id: now,
    //   type: "incoming",
    //   amount,
    //   date: now,
    //   title,
    //   sender: user.id,
    //   balanceAfterOperation: newReceiverBalance,
    // };
    const operation: Operation = {
      id: now,
      amount,
      date: now,
      title,
      from: user.id,
      to: receiver.id,
      sendersBalanceAfterOperation: newSenderBalance,
      receiversBalanceAfterOperation: newReceiverBalance,
    };

    // change sender's balance
    // add operation to sender's operation hisotry.
    // await axios.patch(`http://localhost:3000/users/${user.id}`, {
    //   balance: newSenderBalance,
    //   operations: [senderOperation, ...user.operations],
    // });

    // // change receiver's balance
    // // add operation to receive's operation history.
    // await axios.patch(`http://localhost:3000/users/${receiver.id}`, {
    //   balance: newReceiverBalance,
    //   operations: [receiverOperation, ...receiver.operations],
    // });

    // add operation to database
    await axios.post(`http://localhost:3000/operations`, operation);

    // change sender's balance
    await axios.patch(`http://localhost:3000/users/${user.id}`, {
      balance: newSenderBalance,
    });

    // change receiver's balance
    await axios.patch(`http://localhost:3000/users/${receiver.id}`, {
      balance: newReceiverBalance,
    });

    // update current user state in AuthContext.
    login({ login: user.login, password: user.password });

    return 200;
  };

  const getPendingCardRequests = async (): Promise<PendingCardRequest[]> => {
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

  const handleCardRequest = async (card: Card, type: "accept" | "deny") => {
    if (!user) return navigate("/");

    if (type == "accept") {
      const acceptCardResponse = await axios
        .patch(`http://localhost:3000/cards/${card.id}`, {
          requestPending: false,
        })
        .catch((err) => console.error(err));

      if (acceptCardResponse?.status != 200) {
        setError("Something went wrong.");
      } else {
        setError("");
        login({ login: user.login, password: user.password }, false, true);
      }
    }
    if (type == "deny") {
      const acceptCardResponse = await axios
        .delete(`http://localhost:3000/cards/${card.id}`)
        .catch((err) => console.error(err));

      if (acceptCardResponse?.status != 200) {
        setError("Something went wrong.");
      } else {
        setError("");
        login({ login: user.login, password: user.password }, false, true);
      }
    }
    // const test = await axios.patch(`http://localhost:3000/users/${receiver.id}`, {
    //   balance: newReceiverBalance,
    //   operations: [receiverOperation, ...receiver.operations],
    // });
  };

  const generateXDigitNumber = (x: number) => {
    const num = Math.floor(
      Math.random() * (parseInt("1" + "0".repeat(x)) - 1) + 1
    );

    return num.toString().padStart(x, "0");
  };

  const requestNewCard = async () => {
    if (!user) return navigate("/");

    const hasRequestAlready = cards.find((card) => {
      return card.requestPending == true;
    });

    if (hasRequestAlready) {
      setError("You can request only one card at once!");
      return;
    }

    const now = new Date();
    const validThru = new Date(now.getFullYear() + 2, now.getMonth()).getTime();

    const addCardResponse = await axios
      .post(`http://localhost:3000/cards`, {
        id: `1234 5678 ${generateXDigitNumber(4)} ${generateXDigitNumber(4)}`,
        validThru,
        ownerID: user?.id,
        CVC: parseInt(generateXDigitNumber(3)),
        requestPending: true,
      })
      .catch((err) => console.log(err));

    if (addCardResponse?.status != 200) setError("Something went wrong.");

    setError("");
    login({ login: user.login, password: user.password }, false);
  };

  const generatePassword = () => {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";

    for (let i = 0; i < 10; i++) {
      password += chars[Math.floor(Math.random() * chars.length - 1) + 1];
    }

    return password;
  };

  const addUser = async (fullName: string): Promise<AddUserReturnValue> => {
    const generatedLogin = Math.floor(Math.random() * 99999 - 10000) + 1;

    const newUserData: User = {
      id: generatedLogin,
      login: generatedLogin,
      password: generatePassword(),
      fullName,
      balance: 0,
      accountNumber: `12 3456 ${generateXDigitNumber(4)} ${generateXDigitNumber(
        4
      )} ${generateXDigitNumber(4)} ${generateXDigitNumber(
        4
      )} ${generateXDigitNumber(4)}`,
    };

    const addNewUserResponse = await axios
      .post(`http://localhost:3000/users`, newUserData)
      .catch((err) => console.log(err));

    console.log(addNewUserResponse);

    if (addNewUserResponse?.status != 201) {
      setError("Something went wrong.");
      return { status: 400, user: null };
    }

    setError("");

    return { status: 200, user: newUserData };
  };

  return {
    error,
    setError,
    login,
    logout,
    transfer,
    getPendingCardRequests,
    handleCardRequest,
    requestNewCard,
    addUser,
  };
};

export default useBank;
