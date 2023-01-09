import classNames from "classnames";
import OperationItem from "components/OperationItem";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import Heading from "./Heading";
import Modal from "./Modal";
import Paragraph from "./Paragraph";

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

  useEffect(() => {
    const fetchSenderOrReceiver = async () => {
      await axios
        .get(`http://localhost:3000/users/${data.receiver || data.sender}`)
        .then((res) => {
          const { fullName, accountNumber: accNumber }: User = res.data;
          const type = data.receiver ? "Receiver" : "Sender";
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
        <OperationItem>
          {new Date(data.date).toLocaleDateString("en-gb")}
        </OperationItem>
        <span
          className={classNames("material-symbols-outlined max-w-[24px]", {
            "text-primary": data.type == "incoming",
            "text-red": data.type == "outgoing",
          })}
        >
          {data.type == "incoming"
            ? "keyboard_double_arrow_up"
            : "keyboard_double_arrow_down"}
        </span>
        <OperationItem>{data.amount}$</OperationItem>
        <OperationItem>{data.title}</OperationItem>
      </li>
      <Modal isVisible={modalVisible} setIsVisible={setModalVisible}>
        <Heading>Operation nr. {data.id}</Heading>
        <Paragraph>Title: {data.title}</Paragraph>
        <Paragraph>
          Type: <span className="capitalize">{data.type}</span>
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
          Balance after operation: {data.balanceAfterOperation}$
        </Paragraph>
      </Modal>
    </>
  );
};

export default Operation;
