import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Heading: FC<Props> = ({ children }) => (
  <h2 className="text-2xl font-semibold">{children}</h2>
);

export default Heading;
