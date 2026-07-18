import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;

const channelApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    //______________________________________________
    listChannels: builder.query({
      query: () => ({ url: `${MAIN_API_BASE_PATH}/channel` })
    }),

    //______________________________________________
    getChannel: builder.query({
      query: (id) => ({ url: `${MAIN_API_BASE_PATH}/channel/${id}` })
    }),
  })
});

export const {
  useListChannelsQuery,
  useGetChannelQuery,
} = channelApiSlice;
