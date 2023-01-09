import Heading from "components/Heading";
import { useAuthContext } from "contexts/AuthContext";
import { FC } from "react";

const Cards: FC = () => {
  const { cards } = useAuthContext();

  return (
    <>
      <Heading>Your cards</Heading>
      <ul>
        {cards.length
          ? cards.map((card) => <li key={card.id}>{card.id}</li>)
          : "No cards."}
      </ul>
    </>
  );
};

export default Cards;
