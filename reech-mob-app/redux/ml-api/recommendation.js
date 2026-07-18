import { mlApiSlice } from "./ml-api-slice";
// import { apiSlice } from "../api/api-slice";
const MATCHING_ENGINE_BASE_PATH = process.env.MATCHING_ENGINE_BASE_PATH;

const recommendationApiSlice = mlApiSlice.injectEndpoints({
    //overrideExisting: true,
    endpoints: builder => ({
        //______________________________________________
        reechFor: builder.query({
            query: ({ _id, n }) => ({
                url: `${MATCHING_ENGINE_BASE_PATH}/home/reach_for/fetch/?${new URLSearchParams({
                    _id,
                    n,
                    hard_filter: 0,
                    include_fake: 0,
                }).toString()}`
            }),
        }),

        //______________________________________________
        beReeched: builder.query({
            query: ({ _id, n }) => ({
                url: `${MATCHING_ENGINE_BASE_PATH}/home/be_reached/fetch/?${new URLSearchParams({
                    _id,
                    n,
                    hard_filter: 0,
                    include_fake: 0,
                }).toString()}`
            }),
        }),

        //______________________________________________
        bubbleFetch: builder.query({
            query: ({ _id, n }) => ({
                url: `${MATCHING_ENGINE_BASE_PATH}/bubble/fetch/?${new URLSearchParams({
                    _id,
                    n,
                }).toString()}`
            }),
        }),

        //______________________________________________
        reechForRespond: builder.mutation({
            query: ({ _id, profile_id, response }) => ({
                url: `${MATCHING_ENGINE_BASE_PATH}/home/reach_for/response/?${new URLSearchParams({
                    _id,
                    profile_id,
                    response,
                }).toString()}`,
                method: "POST",
            }),
        }),

        //______________________________________________
        beReechedRespond: builder.mutation({
            query: ({ _id, opportunity_id, response }) => ({
                url: `${MATCHING_ENGINE_BASE_PATH}/home/be_reached/response/?${new URLSearchParams({
                    _id,
                    opportunity_id,
                    response,
                }).toString()}`,
                method: "POST",
            }),
        }),

        //______________________________________________
        bubbleRespond: builder.mutation({
            query: ({ _id, result }) => ({
                url: `${MATCHING_ENGINE_BASE_PATH}/bubble/response/?${new URLSearchParams({
                    _id,
                    result,
                }).toString()}`,
                method: "POST",
            }),
        }),

        //______________________________________________
        init_doc_embeddings: builder.mutation({
            query: ({ _id }) => ({
                url: `${MATCHING_ENGINE_BASE_PATH}/utilities/init_doc/?${new URLSearchParams({
                    _id,
                    collection: "profiles",
                }).toString()}`,
                method: "POST",
            }),
        }),

        //______________________________________________
        init_doc_embeddings_opp: builder.mutation({
            query: ({ _id }) => ({
                url: `${MATCHING_ENGINE_BASE_PATH}/utilities/init_doc/?${new URLSearchParams({
                    _id,
                    collection: "opportunities",
                }).toString()}`,
                method: "POST",
            }),
        }),
    })
});

export const {
    useReechForQuery,
    useBeReechedQuery,
    useInit_doc_embeddingsMutation,
    useInit_doc_embeddings_oppMutation,
} = recommendationApiSlice;
