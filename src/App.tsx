import { FC } from "react";
import "index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "contexts/AuthContext";
import Root from "screens/Root";
import Router from "Router";

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext>
        <Router />
      </AuthContext>
    </QueryClientProvider>
  );
};

export default App;
