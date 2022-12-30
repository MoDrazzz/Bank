import Authentication from "screens/Authentication";
import { FC } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Root from "screens/Root";
import Dashboard from "screens/Dashboard";
import Transfer from "screens/Transfer";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Authentication />,
  },
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "transfer",
        element: <Transfer />,
      },
    ],
  },
  {
    path: "/*",
    element: <Navigate to="/" />,
  },
]);

const Router: FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
