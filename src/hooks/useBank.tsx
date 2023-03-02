import axios, { AxiosError } from "axios";
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

type UserDataTypeNames =
  | "userAccounts"
  | "userOperations"
  | "operations"
  | "userCards"
  | "cardsWithPendingRequest"
  | "user"
  | "users"
  | "userByAccountID"
  | "account";

type UserDataType<T> = T extends "userAccounts"
  ? Account[]
  : T extends "userOperations"
  ? Operation[]
  : T extends "operations"
  ? Operation[]
  : T extends "userCards"
  ? Card[]
  : T extends "cardsWithPendingRequest"
  ? Card[]
  : T extends "user"
  ? User
  : T extends "users"
  ? User[]
  : T extends "userByAccountID"
  ? User
  : T extends "account"
  ? Account
  : never;

const url = "http://localhost:3000";

const useBank = () => {
  const [error, setError] = useState("");
  const {
    user,
    dispatchUser,
    activeAccount: userAccount,
    setActiveAccount,
  } = useAuthContext();
  const navigate = useNavigate();

  const getSpecifiedData = async <T extends UserDataTypeNames>(
    type: T,
    id?: number
  ): Promise<UserDataType<T> | undefined> => {
    try {
      switch (type) {
        case "user": {
          const { data: user } = await axios.get<User>(`${url}/users/${id}`);
          return user as UserDataType<T>;
        }
        case "users": {
          const { data: users } = await axios.get<User[]>(`${url}/users`);
          return users as UserDataType<T>;
        }
        case "userAccounts": {
          const { data: accounts } = await axios.get<Account[]>(
            `${url}/accounts?ownerID=${id}`
          );
          return accounts as UserDataType<T>;
        }
        case "userCards": {
          const { data: cards } = await axios.get<Card[]>(
            `${url}/cards?ownerID=${id}`
          );
          return cards as UserDataType<T>;
        }
        case "cardsWithPendingRequest": {
          const { data: cards } = await axios.get<Card[]>(
            `${url}/cards?requestPending=true`
          );
          return cards as UserDataType<T>;
        }
        case "userOperations": {
          if (id) {
            const { data: operationsToUser } = await axios.get<Operation[]>(
              `${url}/operations?receiver=${id}`
            );
            const { data: operationsFromUser } = await axios.get<Operation[]>(
              `${url}/operations?sender=${id}`
            );
            return operationsToUser.concat(
              operationsFromUser
            ) as UserDataType<T>;
          } else {
            const { data: operations } = await axios.get<Operation[]>(
              `${url}/operations`
            );
            return operations as UserDataType<T>;
          }
        }
        case "operations": {
          const { data: operations } = await axios.get<Operation[]>(
            `${url}/operations`
          );

          return operations as UserDataType<T>;
        }
        case "account": {
          const { data: account } = await axios.get<Account>(
            `${url}/accounts/${id}`
          );
          return account as UserDataType<T>;
        }
        case "userByAccountID": {
          const account = await getSpecifiedData("account", id);

          if (!account) return;

          const { data: user } = await axios.get<User>(
            `${url}/users/${account.ownerID}`
          );
          return user as UserDataType<T>;
        }
      }
    } catch (err) {
      console.log(err);
      setError("Can not connect to the database.");
    }
  };

  const mockAccSelection = async (id: number) => {
    const accs = await getSpecifiedData("userAccounts", id);

    if (!accs) return;

    setActiveAccount(accs[0]);
  };

  const login = async (credentials: Credentials) => {
    try {
      const {
        data: [user],
      } = await axios.get<[User]>(`${url}/users?login=${credentials.login}`);

      if (!user) {
        setError("No user of given login found.");
        return;
      }

      if (user.password !== credentials.password) {
        setError("Password is not valid.");
        return;
      }

      // User authenticated.
      setError("");

      flushSync(() => {
        dispatchUser({
          type: "LOGIN",
          payload: user,
        });

        mockAccSelection(user.id);
      });

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError("Can not connect to the database.");
    }
  };

  const logout = () => {
    dispatchUser({ type: "LOGOUT", payload: null });
  };

  const transfer = async (
    receiversAccountNumber: string,
    amount: number,
    title: string
  ): Promise<void | number> => {
    if (!user) return navigate("/");

    // first of all check if receiver's account number is not the user's one ( ͡° ͜ʖ ͡°)
    if (!userAccount) return;

    if (userAccount.number === receiversAccountNumber) {
      setError("Provided account number is the same as yours. Nice try!");
      return;
    }

    try {
      const {
        data: [receiversAccount],
      } = await axios.get<[Account]>(
        `${url}/accounts?number=${receiversAccountNumber}`
      );

      if (!receiversAccount) {
        setError("Provided receiver's account number is invalid.");
        return;
      }

      // check amount <= balance
      if (userAccount.balance < amount) {
        setError("You do not have enough money to perform this operation.");
        return;
      }

      // reset errors
      setError("");

      // calculate new balances
      const newSenderBalance: number = parseFloat(
        (userAccount.balance - amount).toFixed(2)
      );
      const newReceiverBalance: number = parseFloat(
        (receiversAccount.balance + amount).toFixed(2)
      );

      const now = Date.now();

      const operation: Operation = {
        id: now,
        amount,
        date: now,
        title,
        sender: userAccount.id,
        receiver: receiversAccount.id,
        sendersBalanceAfterOperation: newSenderBalance,
        receiversBalanceAfterOperation: newReceiverBalance,
      };

      // add operation to database
      await axios.post(`${url}/operations`, operation);

      // change sender's balance
      await axios.patch(`${url}/accounts/${userAccount.id}`, {
        balance: newSenderBalance,
      });

      // change receiver's balance
      await axios.patch(`${url}/accounts/${receiversAccount.id}`, {
        balance: newReceiverBalance,
      });

      await mockAccSelection(user.id);

      return 200;
    } catch (err) {
      console.log(err);
      setError("Can not connect to the database.");
    }
  };

  // const getPendingCardRequests = async (): Promise<PendingCardRequest[]> => {
  //   const requests = await Promise.all(
  //     cards.map(async (card) => {
  //       const ownerRequest = await axios
  //         .get(`${url}/users?id=${card.ownerID}`)
  //         .catch((err) => console.log(err));

  //       return {
  //         card,
  //         owner: ownerRequest?.data[0],
  //       };
  //     })
  //   );

  //   return requests;
  // };

  // const handleCardRequest = async (card: Card, type: "accept" | "deny") => {
  //   if (!user) return navigate("/");

  //   if (type === "accept") {
  //     const acceptCardResponse = await axios
  //       .patch(`${url}/cards/${card.id}`, {
  //         requestPending: false,
  //       })
  //       .catch((err) => console.error(err));

  //     if (acceptCardResponse?.status !== 200) {
  //       setError("Something went wrong.");
  //     } else {
  //       setError("");
  //       login({ login: user.login, password: user.password }, false, true);
  //     }
  //   }
  //   if (type === "deny") {
  //     const acceptCardResponse = await axios
  //       .delete(`${url}/cards/${card.id}`)
  //       .catch((err) => console.error(err));

  //     if (acceptCardResponse?.status !== 200) {
  //       setError("Something went wrong.");
  //     } else {
  //       setError("");
  //       login({ login: user.login, password: user.password }, false, true);
  //     }
  //   }
  // };

  const generateXDigitNumber = (x: number) => {
    const num = Math.floor(
      Math.random() * (parseInt("1" + "0".repeat(x)) - 1) + 1
    );

    return num.toString().padStart(x, "0");
  };

  const requestNewCard = async () => {
    if (!user) return navigate("/");

    const cards = await getSpecifiedData("userCards", user.id);

    if (!cards) return navigate("/");

    const hasRequestAlready = cards.find((card) => {
      return card.requestPending === true;
    });

    if (hasRequestAlready) {
      setError("You can request only one card at once!");
      return;
    }

    const now = new Date();
    const validThru = new Date(now.getFullYear() + 2, now.getMonth()).getTime();

    const addCardResponse = await axios
      .post(`${url}/cards`, {
        id: `1234 5678 ${generateXDigitNumber(4)} ${generateXDigitNumber(4)}`,
        validThru,
        ownerID: user?.id,
        CVC: parseInt(generateXDigitNumber(3)),
        requestPending: true,
      })
      .catch((err) => console.log(err));

    if (addCardResponse?.status !== 200) setError("Something went wrong.");

    setError("");
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
    const users = await getSpecifiedData("users");

    if (!users) return { status: 400, user: null };

    let generatedLogin: number;

    do {
      generatedLogin = Math.floor(Math.random() * 90000) + 10000;
    } while (users.some((user) => user.id === generatedLogin));

    const newUserData: User = {
      id: generatedLogin,
      login: generatedLogin,
      password: generatePassword(),
      fullName,
      type: "user",
    };

    try {
      const addNewUserResponse = await axios.post(`${url}/users`, newUserData);

      if (addNewUserResponse.status !== 201) {
        setError("Something went wrong.");
        return { status: 400, user: null };
      }

      return { status: 200, user: newUserData };
    } catch (err) {
      console.log(err);
      setError("Can not connect to the database.");

      return { status: 400, user: null };
    }
  };

  const cancelTransfer = async (transfer: Operation) => {
    // Set sender's balance
    const sender = await getSpecifiedData("account", transfer.sender);

    if (!sender) return;

    try {
      await axios.patch(`${url}/accounts/${sender.id}`, {
        balance: sender.balance + transfer.amount,
      });
    } catch (err) {
      console.log(err);
      setError("Can not connect to the database.");
    }

    // Set receiver's balance
    const receiver = await getSpecifiedData("account", transfer.receiver);

    if (!receiver) return;

    try {
      await axios.patch(`${url}/accounts/${receiver.id}`, {
        balance: receiver.balance - transfer.amount,
      });
    } catch (err) {
      console.log(err);
      setError("Can not connect to the database.");
    }

    // Delete operation from history
    try {
      await axios.delete(`${url}/operations/${transfer.id}`);
    } catch (err) {
      console.log(err);
      setError("Can not connect to the database.");
    }

    return 200;
  };

  return {
    error,
    setError,
    login,
    logout,
    getSpecifiedData,
    transfer,
    // getPendingCardRequests,
    // handleCardRequest,
    requestNewCard,
    addUser,
    cancelTransfer,
  };
};

export default useBank;
