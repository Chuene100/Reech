import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = ""//process.env.MAIN_API_BASE_PATH;

const vouchApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //______________________________________________
        postVouch: builder.mutation({
            query: (body) => ({
                url: `${MAIN_API_BASE_PATH}/vouch`,
                method: "POST",
                body,
            }),
        }),

        //______________________________________________
        listMyVouches: builder.query({
            query: (userId) => ({ url: `${MAIN_API_BASE_PATH}/vouch/list/${userId}` }),
            invalidatesTags: (result, err, arg) => [{ type: "Vouch", id: arg.id }],
        }),

        //______________________________________________
        updateVouch: builder.mutation({
            query: ({ body, vouchId }) => ({
                url: `${MAIN_API_BASE_PATH}/vouch/${vouchId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, err, arg) => [{ type: "Vouch", id: arg.id }],
        }),

        //______________________________________________
        deleteVouch: builder.mutation({
            query: ({ vouchId }) => ({
                url: `${MAIN_API_BASE_PATH}/vouch/${vouchId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, err, arg) => [{ type: "Vouch", id: arg.id }],
        }),
    }),
});

export const {
    usePostVouchMutation,
    useListMyVouchesQuery,
    useUpdateVouchMutation,
    useDeleteVouchMutation,
} = vouchApiSlice;
