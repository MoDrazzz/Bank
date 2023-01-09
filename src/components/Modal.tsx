import classNames from "classnames";
import { Dispatch, FC, ReactNode } from "react";

interface Props {
  children: ReactNode[];
  isVisible: boolean;
  setIsVisible: Dispatch<React.SetStateAction<boolean>>;
}

const Modal: FC<Props> = ({ children, isVisible, setIsVisible }) => (
  <div
    className={classNames(
      "absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]",
      {
        hidden: !isVisible,
      }
    )}
  >
    <div className="relative border-2 border-primary bg-dark p-12">
      {children}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-2"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  </div>
);

export default Modal;
