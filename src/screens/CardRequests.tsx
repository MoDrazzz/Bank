import CardRequest from "components/CardRequest";
import Heading from "components/Heading";
import List from "components/List";
import ListItem from "components/ListItem";
import Paragraph from "components/Paragraph";
import useBank from "hooks/useBank";
import { FC, useCallback, useEffect, useState } from "react";

const CardRequests: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cardRequests, setCardRequests] = useState<Card[]>([]);
  const { getSpecifiedData } = useBank();

  const getCardRequests = useCallback(async () => {
    const fetchedRequests = await getSpecifiedData("cardsWithPendingRequest");

    if (fetchedRequests) {
      setCardRequests(fetchedRequests);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getCardRequests();
  }, []);

  return (
    <div className="grid gap-2">
      <Heading>Card Requests</Heading>
      {isLoading ? (
        <Paragraph>Loading...</Paragraph>
      ) : (
        <List>
          <div className="grid grid-cols-[200px_100px_200px_100px] justify-center font-semibold">
            <ListItem>Card ID</ListItem>
            <ListItem>Valid Thru</ListItem>
            <ListItem>Owner Full Name</ListItem>
            <ListItem>Owner ID</ListItem>
          </div>
          {cardRequests.map((cardRequest) => (
            <CardRequest
              key={cardRequest.id}
              refetchRequests={getCardRequests}
              card={cardRequest}
            />
          ))}
        </List>
      )}
    </div>
  );
};

export default CardRequests;
