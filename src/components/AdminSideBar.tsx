import { FC } from "react";
import NavItem from "./NavItem";

const AdminSideBar: FC = () => {
  return (
    <>
      <NavItem to="/dashboard">Dashboard</NavItem>
      <NavItem to="/cardRequests">Card Requests</NavItem>
    </>
  );
};

export default AdminSideBar;
