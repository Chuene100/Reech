export const initialState = {
  auth: {
    isLoggedIn: false,
  },
  diplomacyService: {
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {},
    config: {
      refetchOnFocus: false,
      refetchOnMountOrArgChange: false,
      refetchOnReconnect: false,
      online: true,
      focused: true,
      middlewareRegistered: false,
      reducerPath: "diplomacyService",
      keepUnusedDataFor: 60,
    },
  },
};
