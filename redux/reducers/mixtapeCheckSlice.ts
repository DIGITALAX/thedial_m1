import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MixtapeCheckState {
  value?: string | undefined;
}

const initialMixtapeCheckState: MixtapeCheckState = {
  value: undefined,
};

export const mixtapeCheckSlice = createSlice({
  name: "mixtapeCheck",
  initialState: initialMixtapeCheckState,
  reducers: {
    setMixtapeCheck: (
      state: MixtapeCheckState,
      action: PayloadAction<string | undefined>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setMixtapeCheck } = mixtapeCheckSlice.actions;

export default mixtapeCheckSlice.reducer;
