import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Title: FC<Props> = ({ children }) => (
  <h1 className="text-4xl font-semibold">{children}</h1>
);

export default Title;
