import classNames from "classnames";
import { FC } from "react";

interface Props {
  children: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  isRed?: boolean;
}

const Button: FC<Props> = ({ children, onClick, disabled, isRed }) => (
  <button
    className={classNames("rounded px-5 py-2 transition-opacity ", {
      "opacity-70": disabled,
      "bg-primary": !isRed,
      "bg-red": isRed,
    })}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
