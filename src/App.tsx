import { FC } from "react";
import "index.css";
import Authentication from "components/Authentication";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthActions, useAuthContext } from "contexts/AuthContext";
import classNames from "classnames";
import Logo from "components/Logo";
import Title from "components/Title";
import NavItem from "components/NavItem";
import Button from "components/Button";
import Heading from "components/Heading";
import Accent from "components/Accent";
import Operation from "components/Operation";

const queryClient = new QueryClient();

const App: FC = () => {
  const { user, dispatch } = useAuthContext();
  console.log(user);

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={classNames("grid h-[100vh] bg-dark", {
          "place-items-center": !user,
          "grid-cols-[200px_1fr_30vw] grid-rows-[120px_1fr]": user,
        })}
      >
        {user ? (
          <>
            <div className="border-b-4 border-white pt-5">
              <Logo />
            </div>
            <header className="col-span-2 flex h-full items-center border-4 border-r-0 border-t-0 border-white px-24 ">
              <Title>
                Welcome back,
                <span className="text-primary"> {user.fullName}!</span>
              </Title>
            </header>
            <aside className="flex flex-col items-center justify-between pt-12 pb-10">
              <nav className="grid justify-items-center gap-5">
                <NavItem isActive>Dashboard</NavItem>
                <NavItem>Transfer</NavItem>
                <NavItem>Settings</NavItem>
              </nav>
              <Button onClick={() => dispatch({ type: AuthActions.logout })}>
                Logout
              </Button>
            </aside>
            <main className="border-x-4 border-white px-24 pt-12">
              <Heading>
                Balance: <span className="text-primary">{user.balance}$</span>
              </Heading>
              <p>Account number: {user.accountNumber}</p>
            </main>
            <aside className="flex flex-col items-center gap-5 pt-12">
              <Heading>Operations History</Heading>
              <Accent />
              <ul className="grid gap-2">
                {user.operations.map((operation) => (
                  <Operation key={operation.id} data={operation} />
                ))}
              </ul>
            </aside>
          </>
        ) : (
          <Authentication />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default App;
