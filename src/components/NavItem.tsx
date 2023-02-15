import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { NavLink, useLocation } from "react-router-dom";

interface Props {
  children: string;
  isActive?: boolean;
  to: string;
}

const NavItem: FC<Props> = ({ children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={classNames("cursor-pointer font-semibold", {
        "text-white": isActive,
        "text-gray": !isActive,
      })}
    >
      {children}
    </NavLink>
  );
};

// const NavItem: FC<Props> = ({ children, to }) => (
//   <NavLink
//     to={to}
//     className={({ isActive }) =>
//       isActive
//         ? "cursor-pointer font-semibold text-white"
//         : "cursor-pointer font-semibold text-gray"
//     }
//   >
//     {children}
//   </NavLink>
// );

// const NavItem: FC<Props> = ({ children, isActive, to }) => (
//   <NavLink
//     to={to}
//     className={classNames("cursor-pointer font-semibold", {
//       "text-gray": !isActive,
//       "text-white": isActive,
//     })}
//   >
//     {children}
//   </NavLink>
// );

export default NavItem;
