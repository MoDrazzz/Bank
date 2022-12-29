import { FC } from "react";

interface Props {
  children: string;
  onClick: () => void;
}

const Button: FC<Props> = ({ children, onClick }) => (
  <button className="rounded bg-primary px-5 py-2" onClick={onClick}>
    {children}
  </button>
);

export default Button;
