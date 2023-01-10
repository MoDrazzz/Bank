import Card from "components/Card";
import Heading from "components/Heading";
import { useAuthContext } from "contexts/AuthContext";
import { FC } from "react";

const Cards: FC = () => {
  const { cards } = useAuthContext();

  return (
    <div className="grid gap-5">
      <Heading>Your cards</Heading>
      <ul className="grid grid-cols-2 gap-5">
        {cards.length
          ? cards.map((cardData) => <Card key={cardData.id} data={cardData} />)
          : "No cards."}
      </ul>
    </div>
  );
};

export default Cards;
