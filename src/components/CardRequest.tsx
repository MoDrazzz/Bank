import { FC, useCallback, useEffect, useState } from "react";
import Modal from "components/Modal";
import ListItem from "./ListItem";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import useBank from "hooks/useBank";
import Button from "./Button";

interface Props {
  card: Card;
  refetchRequests: () => void;
}

const CardRequest: FC<Props> = ({ card, refetchRequests }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [owner, setOwner] = useState<User>();
  const { getSpecifiedData, handleCardRequest } = useBank();

  const getUser = useCallback(async () => {
    const user = await getSpecifiedData("user", card.ownerID);

    setOwner(user);
  }, [card]);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {!owner ? (
        <li>
          <Paragraph>Loading card request data...</Paragraph>
        </li>
      ) : (
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
              <Paragraph>ID: {owner.id}</Paragraph>
              <Paragraph>Full Name: {owner.fullName}</Paragraph>
            </div>
            <div className="flex gap-5">
              <Button
                onClick={() => {
                  handleCardRequest(card, "accept");
                  refetchRequests();
                }}
              >
                Accept
              </Button>
              <Button
                isRed
                onClick={() => {
                  handleCardRequest(card, "deny");
                  refetchRequests();
                }}
              >
                Deny
              </Button>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default CardRequest;
