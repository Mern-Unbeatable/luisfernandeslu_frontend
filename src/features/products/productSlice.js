import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedProductId: null,
  filters: {
    search: '',
  },
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProductId(state, action) {
      state.selectedProductId = action.payload
    },
    setProductFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetProductFilters(state) {
      state.filters = initialState.filters
    },
  },
})

export const {
  setSelectedProductId,
  setProductFilters,
  resetProductFilters,
} = productSlice.actions

export default productSlice.reducer