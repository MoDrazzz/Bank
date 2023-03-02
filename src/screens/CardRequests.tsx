import Heading from "components/Heading";
import List from "components/List";
import ListItem from "components/ListItem";
import Paragraph from "components/Paragraph";
import useBank from "hooks/useBank";
import { FC, useEffect, useState } from "react";
import CardRequest from "components/CardRequest";
import { useAuthContext } from "contexts/AuthContext";

const CardRequests: FC = () => {
  const { error, getSpecifiedData } = useBank();
  const [pendingCardRequests, setPendingCardRequests] = useState<
    PendingCardRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const getPendingCardRequests = async () => {
      const cards = await getSpecifiedData("cardsWithPendingRequest");

      if (!cards) return [];

      await Promise.all(
        cards.map(async (card) => {
          const owner = await getSpecifiedData("user", card.ownerID);

          if (!owner) return;

          const req = {
            card,
            owner: owner,
          };

          // setPendingCardRequests((prev) => {
          //   const copy = prev;
          //   copy.push(req);

          //   return copy;
          // });
        })
      );

      // setPendingCardRequests(requests);
      setIsLoading(false);
    };
    // };
    getPendingCardRequests();
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
            {pendingCardRequests
              .sort((a, b) => {
                return b.card.validThru - a.card.validThru;
              })
              .map((request) => (
                <CardRequest key={request.card.id} request={request} />
              ))}
          </List>
          <Paragraph>{error}</Paragraph>
        </>
      ) : (
        <Paragraph>No requests pending at the moment.</Paragraph>
      )}
    </div>
  );
};

export default CardRequests;
