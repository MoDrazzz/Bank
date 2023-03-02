import classNames from "classnames";
import ListItem from "components/ListItem";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import Heading from "./Heading";
import Modal from "./Modal";
import Paragraph from "./Paragraph";
import { useAuthContext } from "contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Button from "./Button";
import useBank from "hooks/useBank";

interface Props {
  data: Operation;
  refreshOperations: () => void;
}

const AdminOperation: FC<Props> = ({ data, refreshOperations }) => {
  const { user } = useAuthContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [sender, setSender] = useState<User>();
  const [receiver, setReceiver] = useState<User>();
  const operationDate = new Date(data.date);
  const [cancelButtonStage, setCancelButtonStage] = useState(1);
  const { cancelTransfer, error, getSpecifiedData } = useBank();

  useEffect(() => {
    const fetchSender = async () => {
      const sender = await getSpecifiedData("userByAccountID", data.sender);

      if (!sender) return;

      setSender(sender);
    };

    const fetchReceiver = async () => {
      const receiver = await getSpecifiedData("userByAccountID", data.receiver);

      if (!receiver) return;

      setReceiver(receiver);
    };

    fetchSender();
    fetchReceiver();
  }, []);

  useEffect(() => {
    setCancelButtonStage(1);
  }, [modalVisible]);

  const handleCancelTransfer = async () => {
    if (cancelButtonStage === 1) {
      setCancelButtonStage(2);
    } else {
      await cancelTransfer(data);
      refreshOperations();
    }
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <li
        onClick={() => setModalVisible(true)}
        className="grid cursor-pointer grid-cols-[1fr_120px_75px_75px] gap-3"
      >
        <ListItem>{data.id}</ListItem>
        <ListItem>{data.amount}$</ListItem>
        <ListItem>{data.sender}</ListItem>
        <ListItem>{data.receiver}</ListItem>
      </li>
      <Modal isVisible={modalVisible} setIsVisible={setModalVisible}>
        <Heading>Operation nr. {data.id}</Heading>
        <div>
          <Paragraph>Title: {data.title}</Paragraph>
          <Paragraph>Amount: {data.amount}$</Paragraph>
          <Paragraph>
            Date:{" "}
            {operationDate.toLocaleString("en-gb", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </Paragraph>
          <Paragraph>Sender's id: {sender?.id}</Paragraph>
          <Paragraph>
            Sender's balance after operation:{" "}
            {data.sendersBalanceAfterOperation}
          </Paragraph>
          <Paragraph>Receiver's id: {receiver?.id}</Paragraph>
          <Paragraph>
            Sender's balance after operation:{" "}
            {data.receiversBalanceAfterOperation}
          </Paragraph>
          <Button isRed onClick={handleCancelTransfer}>
            {cancelButtonStage === 1 ? "Cancel Transfer" : "Confirm"}
          </Button>
          {error}
        </div>
      </Modal>
    </>
  );
};

export default AdminOperation;
