import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const List: FC<Props> = ({ children }) => (
  <ul className="grid gap-2 overflow-y-scroll">{children}</ul>
);

export default List;
