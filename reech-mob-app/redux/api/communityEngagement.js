import { apiSlice } from "./api-slice";
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;

const communityApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //______________________________________________
        postCommunity: builder.mutation({
            query: (body) => ({
                url: `${MAIN_API_BASE_PATH}/community`,
                method: "POST",
                body,
            }),
        }),

        //______________________________________________
        communityFeed: builder.query({
            query: () => ({ url: `${MAIN_API_BASE_PATH}/community` })
        }),

        //______________________________________________
        readCommunityDetails: builder.query({
            query: (id) => ({ url: `${MAIN_API_BASE_PATH}/community/${id}` }),
        }),

        //______________________________________________
        listMyCommunity: builder.query({
            query: (userId) => ({ url: `${MAIN_API_BASE_PATH}/community/mycommunity/${userId}` }),
            invalidatesTags: (arg) => [{ type: "Community", id: arg.id }],
        }),

        //______________________________________________
        updateCommunity: builder.mutation({
            query: ({ body, CommunityId }) => ({
                url: `${MAIN_API_BASE_PATH}/community/${CommunityId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (arg) => [{ type: "Community", id: arg.id }],
        }),

        //______________________________________________
        deleteCommunity: builder.mutation({
            query: ({ CommunityId }) => ({
                url: `${MAIN_API_BASE_PATH}/community/${CommunityId}`,
                method: "DELETE",
            }),
            invalidatesTags: (arg) => [{ type: "Community", id: arg.id }],
        }),
    }),
});

export const {
    usePostCommunityMutation,
    useReadCommunityDetailsQuery,
    useCommunityFeedQuery,
    useListMyCommunityQuery,
    useUpdateCommunityMutation,
    useDeleteCommunityMutation,
} = communityApiSlice;
