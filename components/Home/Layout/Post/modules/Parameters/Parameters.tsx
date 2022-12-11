import { FunctionComponent } from "react";
import useParameters from "./hooks/useParameters";
import Options from "./modules/Options";
import Viewer from "./modules/Viewer";

const Parameters: FunctionComponent = (): JSX.Element => {
  const {
    feedOrder,
    feedType,
    feedPriority,
    orderPriority,
    setPriorityDrop,
    orderType,
    setTypeDrop,
    orderDrop,
    setOrderDrop,
    userList,
    setUserTypeOpen,
    userTypeOpen,
  } = useParameters();

  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-col auto-cols-auto z-30">
      <Options
        feedOrder={feedOrder}
        feedType={feedType}
        feedPriority={feedPriority}
        orderPriority={orderPriority}
        setPriorityDrop={setPriorityDrop}
        orderType={orderType}
        setTypeDrop={setTypeDrop}
        orderDrop={orderDrop}
        setOrderDrop={setOrderDrop}
      />
      <Viewer
        userList={userList}
        setUserTypeOpen={setUserTypeOpen}
        userTypeOpen={userTypeOpen}
      />
    </div>
  );
};

export default Parameters;