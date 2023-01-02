import { FC } from "react";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type: string;
  name: string;
  value: string | number;
  min?: number;
}

const Input: FC<Props> = ({ onChange, name, type, value, min }) => (
  <input
    className="w-full rounded py-1 px-2 text-lg text-dark"
    min={min}
    onChange={onChange}
    type={type}
    name={name}
    value={value}
  />
);

export default Input;
