import { FC } from "react";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type: string;
  name: string;
}

const Input: FC<Props> = ({ onChange, name, type }) => (
  <input
    className="w-full rounded py-1 px-2 text-lg text-dark"
    onChange={onChange}
    type={type}
    name={name}
  />
);

export default Input;
