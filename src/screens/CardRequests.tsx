import Heading from "components/Heading";
import List from "components/List";
import ListItem from "components/ListItem";
import Paragraph from "components/Paragraph";
import useBank from "hooks/useBank";
import { FC, Fragment, useEffect, useState } from "react";
import Modal from "components/Modal";
import Button from "components/Button";

const CardRequests: FC = () => {
  const { getPendingCardRequests } = useBank();
  const [pendingCardRequests, setPendingCardRequests] = useState<
    PendingCardRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getRequests = async () => {
      getPendingCardRequests().then((data) => {
        setPendingCardRequests(data);
        setIsLoading(false);
      });
    };
    getRequests();
  }, []);

  return (
    <div className="grid gap-2">
      <Heading>Card Requests</Heading>
      {isLoading ? (
        <Paragraph>Loading...</Paragraph>
      ) : pendingCardRequests.length ? (
        <>
          <div className="grid grid-cols-[200px_100px_200px_100px] justify-center font-semibold">
            <ListItem>Card ID</ListItem>
            <ListItem>Valid Thru</ListItem>
            <ListItem>Owner Full Name</ListItem>
            <ListItem>Owner ID</ListItem>
          </div>
          <List>
            {pendingCardRequests.map((request) => (
              <Fragment key={request.card.id}>
                <li
                  className="grid cursor-pointer grid-cols-[200px_100px_200px_100px] justify-center"
                  onClick={() => setModalVisible(true)}
                >
                  <ListItem>{request.card.id}</ListItem>
                  <ListItem>
                    {new Date(request.card.validThru).toLocaleDateString(
                      "en-gb",
                      {
                        year: "2-digit",
                        month: "2-digit",
                      }
                    )}
                  </ListItem>
                  <ListItem>{request.owner.fullName}</ListItem>
                  <ListItem>{request.owner.id}</ListItem>
                </li>
                <Modal isVisible={modalVisible} setIsVisible={setModalVisible}>
                  <Heading>Card nr. {request.card.id}</Heading>
                  <Paragraph>
                    Valid thru:{" "}
                    {new Date(request.card.validThru).toLocaleDateString(
                      "en-gb",
                      {
                        year: "2-digit",
                        month: "2-digit",
                      }
                    )}
                  </Paragraph>
                  <Heading>Owner Data</Heading>
                  <div>
                    <Paragraph>Full Name: {request.owner.fullName}</Paragraph>
                    <Paragraph>ID: {request.owner.id}</Paragraph>
                    <Paragraph>
                      Account number: {request.owner.accountNumber}
                    </Paragraph>
                  </div>
                  <div className="flex gap-5">
                    <Button onClick={() => {}}>Accept</Button>
                    <Button isRed onClick={() => {}}>
                      Deny
                    </Button>
                  </div>
                </Modal>
              </Fragment>
            ))}
          </List>
        </>
      ) : (
        <Paragraph>No requests pending at the moment.</Paragraph>
      )}
    </div>
  );
};

export default CardRequests;
