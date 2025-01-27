import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NewsState {
  category?: string;
  fromDate?: string;
  toDate?: string;
  searchKeyword?: string;
}

const initialState: NewsState = {
  category: undefined,
  fromDate: undefined,
  toDate: undefined,
  searchKeyword: undefined,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string | undefined>) {
      state.category = action.payload;
    },
    setFromDate(state, action: PayloadAction<string | undefined>) {
      state.fromDate = action.payload;
    },
    setToDate(state, action: PayloadAction<string | undefined>) {
      state.toDate = action.payload;
    },
    setSearchKeyword(state, action: PayloadAction<string | undefined>) {
      state.searchKeyword = action.payload;
    },
  },
});

export const { setCategory, setFromDate, setToDate, setSearchKeyword } = newsSlice.actions;

export default newsSlice.reducer;
