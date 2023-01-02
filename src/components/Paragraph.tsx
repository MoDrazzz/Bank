import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Paragraph: FC<Props> = ({ children }) => <p>{children}</p>;

export default Paragraph;
