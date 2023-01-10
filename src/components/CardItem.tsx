import classNames from "classnames";
import { FC, ReactNode } from "react";

interface Props {
  title: string;
  alignRight?: boolean;
  children: ReactNode;
}

const CardItem: FC<Props> = ({ children, title, alignRight }) => (
  <p
    className={classNames("grid", {
      "text-right": alignRight,
    })}
  >
    <span className="text-xs font-semibold">{title}</span>
    {children}
  </p>
);

export default CardItem;
