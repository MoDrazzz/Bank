import classNames from "classnames";
import { FC, useState } from "react";
import OperationItem from "components/OperationItem";
import OperationModal from "components/OperationModal";

interface Props {
  data: Operation;
}

const Operation: FC<Props> = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <li
        onClick={() => setModalVisible(true)}
        className="grid cursor-pointer grid-cols-[100px_min-content_75px_250px] gap-3"
      >
        <OperationItem>
          {new Date(data.date).toLocaleDateString("en-gb")}
        </OperationItem>
        <span
          className={classNames("material-symbols-outlined max-w-[24px]", {
            "text-primary": data.type == "incoming",
            "text-red": data.type == "outgoing",
          })}
        >
          {data.type == "incoming"
            ? "keyboard_double_arrow_up"
            : "keyboard_double_arrow_down"}
        </span>
        <OperationItem>{data.amount}$</OperationItem>
        <OperationItem>{data.title}</OperationItem>
      </li>
      <OperationModal
        data={data}
        isVisible={modalVisible}
        setIsVisible={setModalVisible}
      />
    </>
  );
};

export default Operation;
