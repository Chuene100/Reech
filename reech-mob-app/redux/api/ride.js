import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;

const rideApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //______________________________________________
        postRide: builder.mutation({
            query: (body) => ({
                url: `${MAIN_API_BASE_PATH}/ride`,
                method: "POST",
                body,
            }),
            extraOptions: {
                userContext: "individual",
                backend: "reech-main-api"
            },
        }),

        //______________________________________________
        rideFeed: builder.query({
            query: ({ sortField, sortDirection, filter }) => ({
                url: `${MAIN_API_BASE_PATH}/ride?${new URLSearchParams({
                    sortField,
                    sortDirection,
                }).toString()}`,
                extraOptions: {
                    userContext: "individual",
                    backend: "reech-main-api"
                },
                params: { filter: JSON.stringify(filter) },
            }),
        }),

        //______________________________________________
        readRideDetails: builder.query({
            query: (id) => ({ url: `${MAIN_API_BASE_PATH}/ride/${id}` }),
            extraOptions: {
                userContext: "individual",
                backend: "reech-main-api"
            },
        }),

        //______________________________________________
        listMyRides: builder.query({
            query: (userId) => ({ url: `${MAIN_API_BASE_PATH}/ride/myrides/${userId}` }),
            extraOptions: {
                userContext: "individual",
                backend: "reech-main-api"
            },
            invalidatesTags: (arg) => [{ type: "Ride", id: arg.id }],
        }),

        //______________________________________________
        updateRide: builder.mutation({
            query: ({ body, rideId }) => ({
                url: `${MAIN_API_BASE_PATH}/ride/${rideId}`,
                method: "PUT",
                body,
            }),
            extraOptions: {
                userContext: "individual",
                backend: "reech-main-api"
            },
            invalidatesTags: (arg) => [{ type: "Ride", id: arg.id }],
        }),

        //______________________________________________
        deleteRide: builder.mutation({
            query: ({ rideId }) => ({
                url: `${MAIN_API_BASE_PATH}/ride/${rideId}`,
                method: "DELETE",
            }),
            extraOptions: {
                userContext: "individual",
                backend: "reech-main-api"
            },
            invalidatesTags: (arg) => [{ type: "Ride", id: arg.id }],
        }),
    }),
});

export const {
    usePostRideMutation,
    useReadRideDetailsQuery,
    useRideFeedQuery,
    useListMyRidesQuery,
    useUpdateRideMutation,
    useDeleteRideMutation,
} = rideApiSlice;
