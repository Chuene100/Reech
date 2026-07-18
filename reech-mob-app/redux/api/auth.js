import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: (body) => {
        return ({
          url: `${MAIN_API_BASE_PATH}/auth/login`,
          method: "POST",
          body: body,
        })
      },
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),
    googleLogin: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/auth/google-login`,
        method: "POST",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),
    sendVerificationOTP: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/auth/get-verification-otp`,
        method: "POST",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),
    resendVerificationOTP: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/auth/resend-verification-otp`,
        method: "POST",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),
    sendPassowrdVerificationOTP: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/auth/get-reset-password-otp`,
        method: "POST",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),
    verifyOTP: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/auth/verify-otp`,
        method: "POST",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),
    resetPassowrd: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/auth/change-password`,
        method: "POST",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useSendVerificationOTPMutation,
  useSendPassowrdVerificationOTPMutation,
  useResendVerificationOTPMutation,
  useResetPassowrdMutation,
  useVerifyOTPMutation,
} = authApiSlice;

