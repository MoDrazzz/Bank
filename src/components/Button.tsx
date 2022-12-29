import classNames from "classnames";
import { FC } from "react";

interface Props {
  children: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const Button: FC<Props> = ({ children, onClick, disabled }) => (
  <button
    className={classNames("rounded bg-primary px-5 py-2 transition-opacity ", {
      "opacity-70": disabled,
    })}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
