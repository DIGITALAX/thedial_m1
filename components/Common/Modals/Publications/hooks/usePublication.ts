import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractWrite as useCommentWrite,
  usePrepareContractWrite as usePrepareCommentWrite,
  useSignTypedData,
} from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../../lib/lens/constants";
import LensHubProxy from "../../../../../abis/LensHubProxy.json";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { PostArgsType, PostImage } from "../../../types/common.types";
import moment from "moment";
import createPostTypedData from "../../../../../graphql/mutations/createPost";
import { omit, splitSignature } from "../../../../../lib/lens/helpers";
import checkIndexed from "../../../../../graphql/queries/checkIndexed";
import { setPublication } from "../../../../../redux/reducers/publicationSlice";
import { setSignIn } from "../../../../../redux/reducers/signInSlice";
import lodash from "lodash";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";
import CreateCommentTypedData from "../../../../../graphql/mutations/comment";
import { useRouter } from "next/router";
import { setIndexModal } from "../../../../../redux/reducers/indexModalSlice";

const usePublication = () => {
  const {
    query: { id },
  } = useRouter();
  const [postDescription, setPostDescription] = useState<string>("");
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [contentURI, setContentURI] = useState<string | undefined>();
  const [args, setArgs] = useState<PostArgsType | undefined>();
  const [enabled, setEnabled] = useState<boolean>(false);
  const [searchGif, setSearchGif] = useState<string>();
  const [results, setResults] = useState<any>([]);
  const [commentArgs, setCommentArgs] = useState<any>();
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const defaultProfile = useSelector(
    (state: RootState) => state?.app?.lensProfileReducer?.profile?.id
  );
  const pubId = useSelector(
    (state: RootState) => state.app.reactionStateReducer.value
  );
  const { signTypedDataAsync } = useSignTypedData();
  const postImages = useSelector(
    (state: RootState) => state?.app?.postImageReducer?.value
  );
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );
  const [gifs, setGifs] = useState<string[]>([]);

  const { config, isSuccess: postSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "postWithSig",
    enabled: Boolean(enabled),
    args: [args],
  });

  const { writeAsync } = useContractWrite(config);

  const { config: commentConfig, isSuccess: commentSuccess } =
    usePrepareCommentWrite({
      address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
      abi: LensHubProxy,
      functionName: "commentWithSig",
      enabled: Boolean(commentArgs),
      args: [commentArgs],
    });

  const { writeAsync: commentWriteAsync } = useCommentWrite(commentConfig);

  const commentPost = async (e: FormEvent): Promise<void> => {
    setCommentLoading(true);
    try {
      const contentURI = await uploadContent();
      const result: any = await CreateCommentTypedData({
        profileId: defaultProfile,
        publicationId: id ? id : pubId,
        contentURI: "ipfs://" + contentURI,
        collectModule: collectModuleType,
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      });

      const typedData: any = result.data.createCommentTypedData.typedData;

      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const { v, r, s } = splitSignature(signature);

      const commentArgs = {
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        profileIdPointed: typedData.value.profileIdPointed,
        pubIdPointed: typedData.value.pubIdPointed,
        referenceModuleData: typedData.value.referenceModuleData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };
      setCommentArgs(commentArgs);
    } catch (err: any) {
      console.error(err.message);
      dispatch(setInsufficientFunds("failed"));
    }
    setCommentLoading(false);
  };

  const handleEmoji = (e: any): void => {
    setPostDescription(postDescription + e.emoji);
  };

  const handleGif = (e: FormEvent): void => {
    setSearchGif((e.target as HTMLFormElement).value);
  };

  const handleGifSubmit = async (e: any): Promise<void> => {
    const getGifs = await fetch("/api/giphy", {
      method: "POST",
      body: JSON.stringify(searchGif),
    });
    const allGifs = await getGifs.json();
    setResults(allGifs?.json?.results);
  };

  const handleSetGif = (result: any): void => {
    setGifs([...gifs, result]);
  };

  const handleRemoveGif = (result: any): void => {
    const filtered: string[] = lodash.filter(gifs, (gif) => gif !== result);
    setGifs(filtered);
  };

  const uploadContent = async (): Promise<string | undefined> => {
    let newImages: PostImage[] = [];
    postImages?.forEach((image) => {
      newImages.push({
        item: "ipfs://" + image,
        type: "image/png",
        altTag: image,
      });
    });

    if (gifs.length > 0) {
      for (let i = 0; i < gifs.length; i++) {
        newImages.push({
          item: gifs[i],
          type: "image/gif",
          altTag: gifs[i],
        });
      }
    }

    const data = {
      version: "2.0.0",
      metadata_id: uuidv4(),
      description: postDescription ? postDescription : "",
      content: postDescription ? postDescription : "",
      external_url: "https://www.thedial.xyz/",
      image:
        postImages && postImages?.length > 0 ? "ipfs://" + postImages[0] : null,
      imageMimeType: "image/png",
      name: postDescription ? postDescription?.slice(0, 20) : "The Dial",
      mainContentFocus:
        newImages.length > 0 || gifs.length > 0 ? "IMAGE" : "TEXT_ONLY",
      contentWarning: null,
      attributes: [
        {
          traitType: "string",
          key: "date",
          date: moment().format("MM/D hh:mm:ss"),
        },
      ],
      media: newImages,
      locale: "en",
      postTags: null,
      createdOn: new Date(),
      appId: "thedial",
    };

    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
      } else {
        let responseJSON = await response.json();
        setContentURI(responseJSON.cid);
        return responseJSON.cid;
      }
    } catch (err: any) {
      console.error(err.message);
    }
    return contentURI;
  };

  const handlePost = async (): Promise<void> => {
    setPostLoading(true);
    try {
      const contentURI = await uploadContent();
      const result: any = await createPostTypedData({
        profileId: defaultProfile,
        contentURI: "ipfs://" + contentURI,
        collectModule: collectModuleType,
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      });

      const typedData: any = result.data.createPostTypedData.typedData;

      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const { v, r, s } = splitSignature(signature);

      const postArgs: PostArgsType = {
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };
      setArgs(postArgs);
      setEnabled(true);
    } catch (err: any) {
      console.error(err.message);
      // dispatch(setLensProfile(undefined));
      dispatch(setSignIn(true));
    }
    setPostLoading(false);
  };

  const handlePostWrite = async (): Promise<void> => {
    setPostLoading(true);
    try {
      const tx = await writeAsync?.();
      dispatch(setPublication(false));
      setPostLoading(false);
      setEnabled(false);
      dispatch(setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      }));
      setPostDescription("");
      const res = await tx?.wait();
      const indexedStatus = await checkIndexed(res?.transactionHash);
      if (indexedStatus?.data?.hasTxHashBeenIndexed?.indexed) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Successfully Indexed",
          })
        );
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Post Unsuccessful, Please Try Again",
          })
        );
      }
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: false,
            actionMessage: undefined,
          })
        );
      }, 3000);
    } catch (err) {
      console.error(err);
      setPostLoading(false);
      dispatch(setInsufficientFunds("failed"));
    }
  };

  const handleCommentWrite = async (): Promise<void> => {
    setCommentLoading(true);
    try {
      const tx = await commentWriteAsync?.();
      setCommentLoading(false);
      setPostDescription("");
      dispatch(setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      }));
      const res = await tx?.wait();
      const indexedStatus = await checkIndexed(res?.transactionHash);
      if (indexedStatus?.data?.hasTxHashBeenIndexed?.indexed) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Successfully Indexed",
          })
        );
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Comment Unsuccessful, Please Try Again",
          })
        );
      }
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: false,
            actionMessage: undefined,
          })
        );
      }, 3000);
    } catch (err) {
      console.error(err);
      setCommentLoading(false);
      dispatch(setInsufficientFunds("failed"));
    }
  };

  const handlePostDescription = (e: FormEvent): void => {
    setPostDescription((e.target as HTMLFormElement).value);
  };

  useEffect(() => {
    if (postSuccess) {
      handlePostWrite();
    }

    if (commentSuccess) {
      handleCommentWrite();
    }
  }, [postSuccess, commentSuccess]);

  return {
    handlePost,
    postDescription,
    handlePostDescription,
    handleEmoji,
    postLoading,
    postSuccess,
    searchGif,
    results,
    handleGif,
    handleGifSubmit,
    handleSetGif,
    gifs,
    handleRemoveGif,
    commentLoading,
    commentSuccess,
    commentPost,
  };
};

export default usePublication;