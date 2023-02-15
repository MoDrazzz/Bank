import { FC } from "react";

interface Props {
  children: string;
  htmlFor: string;
}

const Label: FC<Props> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-lg">
    {children}
  </label>
);

export default Label;
