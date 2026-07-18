import { apiSlice } from "./api-slice";
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;

const communityPostApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //______________________________________________
        createCommunityPost: builder.mutation({
            query: (body) => ({
                url: `${MAIN_API_BASE_PATH}/community-post`,
                method: "POST",
                body,
            }),
        }),

        //______________________________________________
        listCommunityPosts: builder.query({
            query: (id) => ({ url: `${MAIN_API_BASE_PATH}/community-post/read-all/${id}` }),
            invalidatesTags: (arg) => [{ type: "CommunityPost", id: arg.id }],
        }),

        //______________________________________________
        readCommunityPost: builder.query({
            query: (id) => ({ url: `${MAIN_API_BASE_PATH}/community-post/${id}` }),
            invalidatesTags: (arg) => [{ type: "CommunityPost", id: arg.id }],
        }),

        //______________________________________________
        updateCommunityPost: builder.mutation({
            query: ({ body, CommunityPostId }) => ({
                url: `${MAIN_API_BASE_PATH}/community-post/${CommunityPostId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (arg) => [{ type: "CommunityPost", id: arg.id }],
        }),

        //______________________________________________
        deleteCommunityPost: builder.mutation({
            query: ({ CommunityPostId }) => ({
                url: `${MAIN_API_BASE_PATH}/community-post/${CommunityPostId}`,
                method: "DELETE",
            }),
            invalidatesTags: (arg) => [{ type: "CommunityPost", id: arg.id }],
        }),
    }),
});

export const {
    useCreateCommunityPostMutation,
    useListCommunityPostsQuery,
    useReadCommunityPostQuery,
    useUpdateCommunityPostMutation,
    useDeleteCommunityPostMutation,
} = communityPostApiSlice;
