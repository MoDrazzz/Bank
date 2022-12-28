import { FC } from "react";
import "index.css";
import Authentication from "components/Authentication";

const App: FC = () => (
  <main className="grid h-[100vh] place-items-center bg-dark">
    <Authentication />
  </main>
);

export default App;
