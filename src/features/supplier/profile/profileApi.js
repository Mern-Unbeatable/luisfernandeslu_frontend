import { baseApi } from "../../../services/api/baseApi";

function normalizeSupplierProfile(payload = {}) {
  const profile = payload?.profile ?? payload?.data ?? payload ?? {};
  const warehouses = Array.isArray(profile.warehouses)
    ? profile.warehouses.map((warehouse, index) => ({
        id: String(warehouse?.id ?? `wh-${index + 1}`),
        label: String(warehouse?.label ?? warehouse?.name ?? ""),
        address: String(warehouse?.address ?? ""),
      }))
    : [];

  return {
    displayName: String(profile.displayName ?? profile.name ?? ""),
    displayEmail: String(profile.displayEmail ?? profile.email ?? ""),
    name: String(profile.name ?? ""),
    email: String(profile.email ?? ""),
    phone: String(profile.phone ?? ""),
    avatarUrl: profile.avatarUrl || null,
    warehouses,
    iban: String(profile.iban ?? ""),
    ibanPhone: String(profile.ibanPhone ?? ""),
  };
}

export const supplierProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierProfile: builder.query({
      query: () => ({
        url: "/api/supplier/profile",
        method: "GET",
      }),
      transformResponse: normalizeSupplierProfile,
    }),
    updateSupplierProfile: builder.mutation({
      query: ({ name, email, phone }) => ({
        url: "/api/supplier/profile",
        method: "PATCH",
        data: {
          name,
          email,
          phone,
        },
      }),
    }),
    saveSupplierWarehouses: builder.mutation({
      query: (warehouses = []) => ({
        url: "/api/supplier/profile/warehouses",
        method: "PUT",
        data: {
          warehouses: warehouses.map((warehouse) => ({
            id: warehouse?.id,
            label: warehouse?.label ?? warehouse?.name,
            address: warehouse?.address,
          })),
        },
      }),
    }),
    changeSupplierPassword: builder.mutation({
      query: ({ currentPassword, newPassword, confirmPassword }) => ({
        url: "/api/supplier/profile/password",
        method: "POST",
        data: {
          currentPassword,
          newPassword,
          confirmPassword,
        },
      }),
    }),
    saveSupplierIban: builder.mutation({
      query: ({ iban, ibanPhone }) => ({
        url: "/api/supplier/profile/iban",
        method: "PUT",
        data: {
          iban,
          ibanPhone,
        },
      }),
    }),
  }),
});

export const {
  useGetSupplierProfileQuery,
  useUpdateSupplierProfileMutation,
  useSaveSupplierWarehousesMutation,
  useChangeSupplierPasswordMutation,
  useSaveSupplierIbanMutation,
} = supplierProfileApi;
