import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedPublication from "../../../../../Common/Feed/modules/FeedPublication";
import { PublicationsFoundProps } from "./types/publications.types";

const PublicationsFound: FunctionComponent<PublicationsFoundProps> = ({
  publicationsSearch,
  dispatch,
  hasMirrored,
  hasReacted,
  reactionsFeed,
  hasCommented,
  mixtapeMirror,
  handleHidePost,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto overflow-x-scroll gap-3 col-start-1">
        {publicationsSearch?.map((publication: any, index: number) => {
          return (
            <div
              className="relative w-96 min-w-fit h-fit grid grid-flow-col auto-cols-auto"
              key={index}
            >
              <FeedPublication
                dispatch={dispatch}
                publication={publication}
                type={"Post"}
                hasMirrored={hasMirrored?.length > 0 && hasMirrored[index]}
                hasReacted={hasReacted?.length > 0 && hasReacted[index]}
                reactionsFeed={
                  reactionsFeed?.length > 0 && reactionsFeed[index]
                }
                hasCommented={hasCommented?.length > 0 && hasCommented[index]}
                mixtapeMirror={
                  mixtapeMirror?.length > 0 && mixtapeMirror[index]
                }
                handleHidePost={handleHidePost}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublicationsFound;