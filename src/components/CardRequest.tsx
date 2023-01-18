import { FC, useState } from "react";
import Modal from "components/Modal";
import Button from "components/Button";
import ListItem from "./ListItem";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import useBank from "hooks/useBank";

interface Props {
  request: {
    owner: User;
    card: Card;
  };
}

const CardRequest: FC<Props> = ({ request: { owner, card } }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { handleCardRequest } = useBank();

  return (
    <>
      <li
        className="grid cursor-pointer grid-cols-[200px_100px_200px_100px] justify-center"
        onClick={() => setModalVisible(true)}
      >
        <ListItem>{card.id}</ListItem>
        <ListItem>
          {new Date(card.validThru).toLocaleDateString("en-gb", {
            year: "2-digit",
            month: "2-digit",
          })}
        </ListItem>
        <ListItem>{owner.fullName}</ListItem>
        <ListItem>{owner.id}</ListItem>
      </li>
      <Modal isVisible={modalVisible} setIsVisible={setModalVisible}>
        <Heading>Card nr. {card.id}</Heading>
        <Paragraph>
          Valid thru:{" "}
          {new Date(card.validThru).toLocaleDateString("en-gb", {
            year: "2-digit",
            month: "2-digit",
          })}
        </Paragraph>
        <Heading>Owner Data</Heading>
        <div>
          <Paragraph>Full Name: {owner.fullName}</Paragraph>
          <Paragraph>ID: {owner.id}</Paragraph>
          <Paragraph>Account number: {owner.accountNumber}</Paragraph>
        </div>
        <div className="flex gap-5">
          <Button onClick={() => handleCardRequest(card, "accept")}>
            Accept
          </Button>
          <Button isRed onClick={() => handleCardRequest(card, "deny")}>
            Deny
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CardRequest;
