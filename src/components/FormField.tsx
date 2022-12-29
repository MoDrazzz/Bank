import { FC } from "react";
import Input from "./Input";
import Label from "./Label";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type: "text" | "password";
  name: string;
  label: string;
}

const FormField: FC<Props> = ({ name, label, onChange, type }) => (
  <div className="grid w-full gap-2">
    <Label htmlFor={name}>{label}</Label>
    <Input onChange={onChange} type={type} name={name} />
  </div>
);

export default FormField;
