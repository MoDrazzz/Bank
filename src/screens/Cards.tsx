import Button from "components/Button";
import Card from "components/Card";
import Heading from "components/Heading";
import Paragraph from "components/Paragraph";
import { useAuthContext } from "contexts/AuthContext";
import useBank from "hooks/useBank";
import { FC } from "react";

const Cards: FC = () => {
  const { cards } = useAuthContext();
  const { error, requestNewCard } = useBank();

  const handleRequestNewCard = () => {
    requestNewCard();
  };

  return (
    <div className="grid gap-5">
      <Heading>Your cards</Heading>
      <ul className="grid grid-cols-2 gap-5">
        {cards.length
          ? cards.map((cardData) => <Card key={cardData.id} data={cardData} />)
          : "No cards."}
      </ul>
      <div>
        <Button onClick={handleRequestNewCard}>Request new card</Button>
        {error && <Paragraph>{error}</Paragraph>}
      </div>
    </div>
  );
};

export default Cards;
