import { FC, ReactNode } from "react";
import classNames from "classnames";

interface Props {
  children: ReactNode;
}

const ListItem: FC<Props> = ({ children }) => (
  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-center">
    {children}
  </span>
);

export default ListItem;
