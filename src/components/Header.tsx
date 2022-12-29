import { useAuthContext } from "contexts/AuthContext";
import { FC } from "react";
import Title from "./Title";

const Header: FC = () => {
  const { user } = useAuthContext();

  return (
    <header className="col-span-2 flex h-full items-center border-4 border-r-0 border-t-0 border-white px-24 ">
      <Title>
        Welcome back,
        <span className="text-primary"> {user?.fullName}!</span>
      </Title>
    </header>
  );
};

export default Header;
