import Button from "components/Button";
import Card from "components/Card";
import Heading from "components/Heading";
import Paragraph from "components/Paragraph";
import { useAuthContext } from "contexts/AuthContext";
import useBank from "hooks/useBank";
import { FC, useCallback, useEffect, useState } from "react";

const Cards: FC = () => {
  const { user } = useAuthContext();
  const { error, requestNewCard, getSpecifiedData } = useBank();
  const [cards, setCards] = useState<Card[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const getCards = useCallback(async () => {
    if (!user) return;

    const cards = await getSpecifiedData("userCards", user.id);

    if (cards) {
      setCards(cards);
      setIsFetching(false);
    }
  }, []);

  const handleRequestNewCard = async () => {
    await requestNewCard();

    getCards();
  };

  useEffect(() => {
    getCards();
  }, []);

  return (
    <div className="grid justify-items-start gap-5">
      <Heading>Your cards</Heading>
      <ul className="grid grid-cols-2 gap-5">
        {cards.length
          ? cards.map((cardData) => <Card key={cardData.id} data={cardData} />)
          : isFetching
          ? "Loading..."
          : "No cards."}
      </ul>
      <Button onClick={handleRequestNewCard}>Request new card</Button>
      {error && <Paragraph>{error}</Paragraph>}
    </div>
  );
};

export default Cards;
