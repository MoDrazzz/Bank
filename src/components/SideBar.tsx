import { AuthActions, useAuthContext } from "contexts/AuthContext";
import useBank from "hooks/useBank";
import { FC } from "react";
import Button from "./Button";
import NavItem from "./NavItem";

const Sidebar: FC = () => {
  const { logout } = useBank();

  return (
    <aside className="flex flex-col items-center justify-between pt-12 pb-10">
      <nav className="grid justify-items-center gap-5">
        <NavItem to="/dashboard">Dashboard</NavItem>
        <NavItem to="/transfer">Transfer</NavItem>
        <NavItem to="/settings">Settings</NavItem>
      </nav>
      <Button onClick={logout}>Logout</Button>
    </aside>
  );
};

export default Sidebar;
