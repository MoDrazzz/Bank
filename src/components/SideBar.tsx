import { AuthActions, useAuthContext } from "contexts/AuthContext";
import { FC } from "react";
import Button from "./Button";
import NavItem from "./NavItem";

const Sidebar: FC = () => {
  const { dispatch } = useAuthContext();

  return (
    <aside className="flex flex-col items-center justify-between pt-12 pb-10">
      <nav className="grid justify-items-center gap-5">
        <NavItem to="/dashboard">Dashboard</NavItem>
        <NavItem to="/transfer">Transfer</NavItem>
        <NavItem to="/settings">Settings</NavItem>
      </nav>
      <Button onClick={() => dispatch({ type: AuthActions.logout })}>
        Logout
      </Button>
    </aside>
  );
};

export default Sidebar;
