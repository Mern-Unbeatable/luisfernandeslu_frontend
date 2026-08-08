import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedOrderId: null,
  statusFilter: 'all',
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSelectedOrderId(state, action) {
      state.selectedOrderId = action.payload
    },
    setOrderStatusFilter(state, action) {
      state.statusFilter = action.payload
    },
  },
})

export const { setSelectedOrderId, setOrderStatusFilter } = orderSlice.actions
export default orderSlice.reducer
