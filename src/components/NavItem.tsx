import { FC } from "react";
import classNames from "classnames";

interface Props {
  children: string;
  isActive?: boolean;
}

const NavItem: FC<Props> = ({ children, isActive }) => (
  <p
    className={classNames("cursor-pointer font-semibold", {
      "text-gray": !isActive,
      "text-white": isActive,
    })}
  >
    {children}
  </p>
);

export default NavItem;
