import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedUserId: null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUserId(state, action) {
      state.selectedUserId = action.payload
    },
  },
})

export const { setSelectedUserId } = userSlice.actions
export default userSlice.reducer