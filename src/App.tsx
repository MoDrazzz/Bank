import { FC } from "react";
import "index.css";
import Authentication from "components/Authentication";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthContext } from "contexts/AuthContext";
import classNames from "classnames";

const queryClient = new QueryClient();

const App: FC = () => {
  const { user } = useAuthContext();
  console.log(user);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="grid h-[100vh] place-items-center bg-dark">
        {user ? (
          <div>
            <h1>Logged in.</h1>
          </div>
        ) : (
          <Authentication />
        )}
      </main>
    </QueryClientProvider>
  );
};

export default App;
