import { useAuthContext } from "contexts/AuthContext";
import { FC } from "react";
import CardItem from "./CardItem";
import CardLine from "./CardLine";
import Paragraph from "./Paragraph";

interface Props {
  data: Card;
}

const Card: FC<Props> = ({ data }) => {
  const { user } = useAuthContext();

  return (
    <div className="relative z-0 grid h-[210px] w-[375px] grid-rows-[1fr,2fr,1fr] items-center overflow-hidden rounded-xl bg-gradient-to-r from-[#0d0d0d] to-[#1c1c1c] p-8 shadow-lg">
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">The bank</p>
        <CardItem title="Owner" alignRight>
          {user?.fullName}
        </CardItem>
      </div>
      <p className="flex w-full justify-between text-xl tracking-wider">
        {data.id.split(" ").map((el, i) => (
          <span key={i}>{el}</span>
        ))}
      </p>
      <div className="relative z-20 flex justify-between">
        <CardItem title="Valid thru">
          {new Date(data.validThru).toLocaleDateString("en-gb", {
            year: "2-digit",
            month: "2-digit",
          })}
        </CardItem>
        <CardItem title="CVC" alignRight>
          {data.CVC}
        </CardItem>
      </div>
      <div className="absolute left-0 bottom-0 z-10 grid -rotate-12 gap-3">
        <CardLine />
        <CardLine />
        <CardLine />
      </div>
    </div>
  );
};

export default Card;
