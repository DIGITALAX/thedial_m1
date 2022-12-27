import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useCollected from "../../Common/Feed/hooks/useCollected";
import useHearted from "../../Common/Feed/hooks/useHearted";
import useMirrored from "../../Common/Feed/hooks/useMirrored";
import CollectNotificationModal from "../../Common/Modals/CollectNotification/CollectNotificationModal";
import GetProfileModal from "../../Common/Modals/GetProfile/GetProfileModal";
import ImageViewerModal from "../../Common/Modals/ImageViewer/ImageViewer";
import PublicationModal from "../../Common/Modals/Publications/PublicationModal";
import CollectsModal from "../../Common/Modals/Reactions/CollectsModal";
import CommentsModal from "../../Common/Modals/Publications/CommentsModal";
import HeartsModal from "../../Common/Modals/Reactions/HeartsModal";
import MirrorsModal from "../../Common/Modals/Reactions/MirrorsModal";
import SignInModal from "../../Common/Modals/SignIn/SignInModal";
import Transaction from "../../Common/Modals/Transactions/Transactions";
import useMainFeed from "../Layout/Publish/modules/Feed/hooks/useMainFeed";
import FollowsModal from "../../Common/Modals/Follows/FollowsModal";
import useProfilePage from "../Profile/hooks/useProfilePage";

const Modals = () => {
  const dispatch = useDispatch();
  const makePublication = useSelector(
    (state: RootState) => state.app.publicationReducer.value
  );
  const collectNotificationModal = useSelector(
    (state: RootState) => state.app.collectNotificationReducer.open
  );
  const getProfileModal = useSelector(
    (state: RootState) => state.app.getProfileModalReducer.value
  );
  const follow = useSelector(
    (state: RootState) => state.app.followModalReducer
  );
  const imageViewerModal = useSelector(
    (state: RootState) => state.app.imageViewerReducer.open
  );
  const commentShow = useSelector(
    (state: RootState) => state.app.commentShowReducer
  );
  const failed = useSelector(
    (state: RootState) => state.app.insufficientFundsReducer.value
  );
  const reactionModal = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const signInModal = useSelector(
    (state: RootState) => state.app.signInReducer.value
  );
  const {
    mirrorInfoLoading,
    mirrorLoading,
    mirrorPost,
    getMorePostMirrors,
    mirrorers,
  } = useMirrored();

  const {
    reactionPost,
    reactionLoading,
    getMorePostReactions,
    reactionInfoLoading,
    reacters,
  } = useHearted();

  const {
    collectLoading,
    collectInfoLoading,
    postCollectInfoLoading,
    getMorePostCollects,
    approvalLoading,
    collectPost,
    approveCurrency,
    collectors,
  } = useCollected();

  const {
    commentInfoLoading,
    commentors,
    getMorePostComments,
    hasCommented,
    hasMirrored,
    hasReacted,
    reactionsFeed,
  } = useMainFeed();

  const {
    getMoreFollowers,
    getMoreFollowing,
    userFollowers,
    userFollowing,
    followingLoading,
    followersLoading,
  } = useProfilePage();

  return (
    <>
      {makePublication && <PublicationModal />}
      {signInModal && <SignInModal />}
      {getProfileModal && <GetProfileModal />}
      {imageViewerModal && <ImageViewerModal />}
      {collectNotificationModal && <CollectNotificationModal />}
      {reactionModal.open && reactionModal.type === "collect" && (
        <CollectsModal
          collectors={collectors}
          getMorePostCollects={getMorePostCollects}
          approveCurrency={approveCurrency}
          handleCollect={collectPost}
          collectInfoLoading={collectInfoLoading}
          postCollectInfoLoading={postCollectInfoLoading}
          collectLoading={collectLoading}
          approvalLoading={approvalLoading}
        />
      )}
      {reactionModal.open && reactionModal.type === "mirror" && (
        <MirrorsModal
          mirrorers={mirrorers}
          getMorePostMirrors={getMorePostMirrors}
          mirrorPost={mirrorPost}
          mirrorLoading={mirrorLoading}
          mirrorInfoLoading={mirrorInfoLoading}
        />
      )}
      {reactionModal.open && reactionModal.type === "heart" && (
        <HeartsModal
          reacters={reacters}
          getMorePostReactions={getMorePostReactions}
          reactionPost={reactionPost}
          reactionLoading={reactionLoading}
          reactionInfoLoading={reactionInfoLoading}
        />
      )}
      {commentShow.open && (
        <CommentsModal
          commentors={commentors}
          commentInfoLoading={commentInfoLoading}
          getMorePostComments={getMorePostComments}
          hasMirrored={hasMirrored}
          hasReacted={hasReacted}
          hasCommented={hasCommented}
          reactionsFeed={reactionsFeed}
        />
      )}
      {follow?.open && (
        <FollowsModal
          dispatch={dispatch}
          followersLoading={followersLoading}
          followingLoading={followingLoading}
          getMoreFollowers={getMoreFollowers}
          getMoreFollowing={getMoreFollowing}
          userFollowing={userFollowing}
          userFollowers={userFollowers}
          type={follow?.type}
        />
      )}
      {failed !== "" && failed !== undefined && (
        <Transaction
          inputText={
            failed === "insufficient"
              ? "Insufficient Funds."
              : "Transaction Failed. Please try again."
          }
        />
      )}
    </>
  );
};

export default Modals;
