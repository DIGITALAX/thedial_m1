import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../../components/Common/types/lens.types";

export interface LensProfileState {
  profile?: Profile | undefined;
}

const initialLensProfileState: LensProfileState = {
  profile: undefined,
};

export const lensProfileSlice = createSlice({
  name: "lensProfile",
  initialState: initialLensProfileState,
  reducers: {
    setLensProfile: (
      state: LensProfileState,
      action: PayloadAction<Profile | undefined>
    ) => {
      state.profile = action.payload;
    },
  },
});

export const { setLensProfile } = lensProfileSlice.actions;

export default lensProfileSlice.reducer;
