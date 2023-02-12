import classNames from "classnames";
import ListItem from "components/ListItem";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import Heading from "./Heading";
import Modal from "./Modal";
import Paragraph from "./Paragraph";
import { useAuthContext } from "contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  data: Operation;
}

const Operation: FC<Props> = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [senderOrReceiver, setSenderOrReceiver] = useState({
    type: "",
    payload: {
      fullName: "",
      accNumber: "",
    },
  });
  const operationDate = new Date(data.date);
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const fetchSenderOrReceiver = async () => {
      await axios
        .get(
          `http://localhost:3000/users/${
            data.from == user.id ? data.to : data.from
          }`
        )
        .then((res) => {
          const { fullName, accountNumber: accNumber }: User = res.data;
          const type = user.id == data.from ? "Receiver" : "Sender";
          setSenderOrReceiver({
            type,
            payload: {
              fullName,
              accNumber,
            },
          });
        })
        .catch((err: Error) => {
          console.log(err);
        });
    };

    fetchSenderOrReceiver();
  }, []);

  return (
    <>
      <li
        onClick={() => setModalVisible(true)}
        className="grid cursor-pointer grid-cols-[100px_min-content_75px_250px] gap-3"
      >
        <ListItem>{new Date(data.date).toLocaleDateString("en-gb")}</ListItem>
        <span
          className={classNames("material-symbols-outlined max-w-[24px]", {
            "text-primary": data.to == user.id,
            "text-red": data.from == user.id,
          })}
        >
          {data.to == user.id
            ? "keyboard_double_arrow_up"
            : "keyboard_double_arrow_down"}
        </span>
        <ListItem>{data.amount}$</ListItem>
        <ListItem>{data.title}</ListItem>
      </li>
      <Modal isVisible={modalVisible} setIsVisible={setModalVisible}>
        <Heading>Operation nr. {data.id}</Heading>
        <div>
          <Paragraph>Title: {data.title}</Paragraph>
          <Paragraph>
            Type:{" "}
            <span className="capitalize">
              {data.from == user.id ? "outgoing" : "incoming"}
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
            {senderOrReceiver.type}'s name: {senderOrReceiver.payload.fullName}
          </Paragraph>
          <Paragraph>
            {senderOrReceiver.type}'s account:{" "}
            {senderOrReceiver.payload.accNumber}
          </Paragraph>
          <Paragraph>
            Balance after operation:{" "}
            {data.from == user.id
              ? data.sendersBalanceAfterOperation
              : data.receiversBalanceAfterOperation}
            $
          </Paragraph>
        </div>
      </Modal>
    </>
  );
};

export default Operation;
