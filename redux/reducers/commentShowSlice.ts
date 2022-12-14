import { createSlice } from "@reduxjs/toolkit";

export interface CommentShowState {
  open: boolean;
  type?: string;
  value?: any;
  follower?: boolean;
  mixtape?: boolean;
}

const initialCommentShowState: CommentShowState = {
  open: false,
  type: undefined,
  value: undefined,
  follower: undefined,
  mixtape: false,
};

export const commentShowSlice = createSlice({
  name: "commentShow",
  initialState: initialCommentShowState,
  reducers: {
    setCommentShow: (
      state: CommentShowState,
      {
        payload: {
          actionOpen,
          actionType,
          actionValue,
          actionFollower,
          actionMixtape,
        },
      }
    ) => {
      state.open = actionOpen;
      state.type = actionType;
      state.value = actionValue;
      state.follower = actionFollower;
      state.mixtape = actionMixtape;
    },
  },
});

export const { setCommentShow } = commentShowSlice.actions;

export default commentShowSlice.reducer;
