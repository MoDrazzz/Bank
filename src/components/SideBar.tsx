import useBank from "hooks/useBank";
import { FC } from "react";
import AdminSidebar from "./AdminSideBar";
import Button from "./Button";
import UserSideBar from "./UserSideBar";

interface Props {
  isAdmin: boolean;
}

const SideBar: FC<Props> = ({ isAdmin }) => {
  const { logout } = useBank();

  return (
    <aside className="flex flex-col items-center justify-between pt-12 pb-10">
      <nav className="grid justify-items-center gap-5">
        {isAdmin ? <AdminSidebar /> : <UserSideBar />}
      </nav>
      <Button onClick={logout}>Logout</Button>
    </aside>
  );
};

export default SideBar;
