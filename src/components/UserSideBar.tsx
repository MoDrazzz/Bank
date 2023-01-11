import { FC } from "react";
import NavItem from "./NavItem";

const UserSideBar: FC = () => {
  return (
    <>
      <NavItem to="/dashboard">Dashboard</NavItem>
      <NavItem to="/transfer">Transfer</NavItem>
      <NavItem to="/cards">Cards</NavItem>
    </>
  );
};

export default UserSideBar;
