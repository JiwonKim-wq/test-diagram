import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // TODO: 리듀서들 추가 예정
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 