import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Viewer from "./modules/Viewer";
import lodash from "lodash";

const SliderSwitch: FunctionComponent = (): JSX.Element => {
  const dialType: string | undefined = useSelector(
    (state: RootState) => state.app.dialReducer.value
  );
  const lexicaImages = useSelector(
    (state: RootState) => state.app.lexicaImagesReducer.images
  );
  const dispatch = useDispatch();
  let action: string = "Scanner";
  const decideStringAction = () => {
    action = dialType as string;
    return action;
  };

  switch (decideStringAction()) {
    case "Highlights":
      return (
        <Viewer
          slider={lodash.slice(lexicaImages, 0, 10)}
          width={"60"}
          dispatch={dispatch}
        />
      );

    case "Drops":
      return (
        <Viewer
          slider={lodash.slice(lexicaImages, 10, 20)}
          width={"96"}
          dispatch={dispatch}
        />
      );

    case "Reach":
      return (
        <Viewer
          slider={lodash.slice(lexicaImages, 20, 30)}
          width={"40"}
          dispatch={dispatch}
        />
      );

    case "Records":
      return (
        <Viewer
          slider={lodash.slice(lexicaImages, 30, 40)}
          width={"60"}
          dispatch={dispatch}
        />
      );

    default:
      return (
        <Viewer
          slider={lodash.slice(lexicaImages, 40, 50)}
          width={"60"}
          dispatch={dispatch}
        />
      );
  }
};

export default SliderSwitch;
