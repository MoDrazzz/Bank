import axios from "axios";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import Heading from "./Heading";
import Label from "./Label";
import Paragraph from "./Paragraph";
import Title from "./Title";

interface Props {
  data: Operation;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const OperationModal: FC<Props> = ({ isVisible, setIsVisible, data }) => {
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
          const type = data.receiver ? "Sender" : "Receiver";
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
          setIsVisible(false);
        });
    };

    fetchSenderOrReceiver();
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.025)]">
      <div className="relative border-2 border-primary bg-dark p-12">
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
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-2"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
};

export default OperationModal;
