import Heading from "components/Heading";
import Paragraph from "components/Paragraph";
import useBank from "hooks/useBank";
import { FC, useEffect, useState } from "react";

const CardRequests: FC = () => {
  const { getPendingCardRequests } = useBank();
  const [pendingCardRequests, setPendingCardRequests] = useState<
    PendingCardRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

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
    <>
      <Heading>Card Requests</Heading>
      {isLoading ? (
        <Paragraph>Loading...</Paragraph>
      ) : pendingCardRequests.length ? (
        <ul>
          {pendingCardRequests.map((request) => (
            <li key={request.card.id}>{request.card.id}</li>
          ))}
        </ul>
      ) : (
        <Paragraph>No requests pending at the moment.</Paragraph>
      )}
    </>
  );
};

export default CardRequests;
