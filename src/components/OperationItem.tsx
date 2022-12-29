import { FC, ReactNode } from "react";
import classNames from "classnames";

interface Props {
  children: ReactNode;
}

const OperationItem: FC<Props> = ({ children }) => (
  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-center">
    {children}
  </p>
);

export default OperationItem;
