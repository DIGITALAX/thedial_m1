import { FunctionComponent } from "react";
import useSamples from "./hooks/useSamples";
import { useDispatch, useSelector } from "react-redux";
import { setTopic } from "../../../../../../redux/reducers/topicSlice";
import { RootState } from "../../../../../../redux/store";
import { TopicInterface } from "./types/samples.types";
import Topic from "../../../../../Common/Topic/Topic";
import TopicValues from "../../../../../Common/Topic/TopicValues";

const Samples: FunctionComponent = (): JSX.Element => {
  const { topics, topicValues } = useSamples();
  const dispatch = useDispatch();
  const selectedTopic: string = useSelector(
    (state: RootState) => state.app.topicReducer.value
  );
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto pl-20 gap-6">
      <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto overflow-x-scroll gap-5">
        {topics?.map((topic: string, index: number) => {
          return (
            <Topic
              topic={topic}
              index={index}
              selectedTopic={selectedTopic}
              dispatch={dispatch}
              setTopic={setTopic}
            />
          );
        })}
      </div>
      <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto gap-7 pl-10 overflow-x-scroll">
        {topicValues[
          selectedTopic
            .toLowerCase()
            .replaceAll(" ", "") as keyof TopicInterface
        ]?.map((value: string, index: number) => {
          return <TopicValues index={index} value={value} />;
        })}
      </div>
    </div>
  );
};

export default Samples;
