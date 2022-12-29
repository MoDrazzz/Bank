import { FC } from "react";

interface Props {
  children: string;
  htmlFor: string;
}

const Label: FC<Props> = ({ children }) => (
  <label className="text-lg">{children}</label>
);

export default Label;
