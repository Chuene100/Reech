import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = "https://reech-payments-api-7o3szyfdpq-ue.a.run.app/"

const dataAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
});

const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    
    getCustomer: builder.query({
      query: (id) => ({ url: `${MAIN_API_BASE_PATH}/api/customer/${id}` })
    }),

    addCustomer: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/api/customer`,
        method: "POST",
        body,
      }),
    }),

  })
});

export const {
  useAddCustomerMutation,
  useGetCustomerQuery
} = paymentApiSlice;
