import classNames from "classnames";
import ListItem from "components/ListItem";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import Heading from "./Heading";
import Modal from "./Modal";
import Paragraph from "./Paragraph";
import { useAuthContext } from "contexts/AuthContext";
import { Navigate } from "react-router-dom";
import useBank from "hooks/useBank";

interface Props {
  data: Operation;
}

const UserOperation: FC<Props> = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [senderOrReceiver, setSenderOrReceiver] = useState({
    type: "",
    payload: {
      fullName: "",
      accNumber: "",
    },
  });
  const operationDate = new Date(data.date);
  const { user, activeAccount } = useAuthContext();
  const { error, getSpecifiedData } = useBank();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!user || !activeAccount) return;

    const fetchSenderOrReceiver = async () => {
      const userRes = await getSpecifiedData(
        "userByAccountID",
        data.sender === activeAccount.id ? data.receiver : data.sender
      );
      const userAccRes = await getSpecifiedData(
        "account",
        data.sender === activeAccount?.id ? data.receiver : data.sender
      );

      if (userRes && userAccRes) {
        const type = activeAccount.id === data.sender ? "Receiver" : "Sender";
        setSenderOrReceiver({
          type,
          payload: {
            fullName: userRes.fullName,
            accNumber: userAccRes.number,
          },
        });
      }

      setIsFetching(false);
    };

    fetchSenderOrReceiver();
  }, []);

  if (!user || !activeAccount) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <li
        onClick={() => setModalVisible(true)}
        className="grid w-full cursor-pointer grid-cols-[max-content_min-content_75px_250px] gap-3"
      >
        <ListItem>{new Date(data.date).toLocaleDateString("en-gb")}</ListItem>
        <span
          className={classNames("material-symbols-outlined max-w-[24px]", {
            "text-primary": data.receiver === activeAccount.id,
            "text-red": data.sender === activeAccount.id,
          })}
        >
          {data.receiver === activeAccount.id
            ? "keyboard_double_arrow_up"
            : "keyboard_double_arrow_down"}
        </span>
        <ListItem>{data.amount}$</ListItem>
        <ListItem>{data.title}</ListItem>
      </li>
      <Modal isVisible={modalVisible} setIsVisible={setModalVisible}>
        {isFetching ? (
          <Heading>Loading...</Heading>
        ) : (
          <>
            <Heading>Operation nr. {data.id}</Heading>
            <div>
              <Paragraph>Title: {data.title}</Paragraph>
              <Paragraph>
                Type:{" "}
                <span className="capitalize">
                  {data.sender === activeAccount.id ? "outgoing" : "incoming"}
                </span>
              </Paragraph>
              <Paragraph>Amount: {data.amount}$</Paragraph>
              <Paragraph>
                Date:{" "}
                {operationDate.toLocaleDateString("en-gb", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                ,{" "}
                {operationDate.toLocaleTimeString("en-gb", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Paragraph>
              <Paragraph>
                {senderOrReceiver.type}'s name:{" "}
                {senderOrReceiver.payload.fullName}
              </Paragraph>
              <Paragraph>
                {senderOrReceiver.type}'s account:{" "}
                {senderOrReceiver.payload.accNumber}
              </Paragraph>
              <Paragraph>
                Balance after operation:{" "}
                {data.sender === activeAccount.id
                  ? data.sendersBalanceAfterOperation
                  : data.receiversBalanceAfterOperation}
                $
              </Paragraph>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserOperation;
