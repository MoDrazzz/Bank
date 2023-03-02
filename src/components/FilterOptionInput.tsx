import { Dispatch, FC } from "react";
import Label from "./Label";

interface Props {
  value: "id" | "sender" | "receiver";
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterOptionInput: FC<Props> = ({ value, checked, onChange }: Props) => {
  return (
    <div className="flex gap-2">
      <input
        checked={checked}
        type="radio"
        name="filterOption"
        id={value}
        onChange={onChange}
        value={value}
      />
      <Label htmlFor={value}>{value.toUpperCase()}</Label>
    </div>
  );
};

export default FilterOptionInput;
