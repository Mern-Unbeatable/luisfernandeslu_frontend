import { baseApi } from '../../services/api/baseApi'

export const apiMiddlewares = (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(baseApi.middleware)

export default apiMiddlewares