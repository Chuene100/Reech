import { configureStore } from "@reduxjs/toolkit";

// import all our reducers
import authReducer from "./features/auth-slice";
import userReducer from "./features/user-slice";
import profilesReducer from "./features/profiles-slice";
import currentProfileReducer from "./features/current_profile-slice";
import allUserReducer from "./features/all-user-slice";
import bubbleReducer from "./features/bubble-slice";
import opportunityReducer from "./features/opportunity-slice";
import imageCacheReducer from "./features/cache-image-slice";
import profileImageReducer from "./features/profile-image-slice";
import bubbleImageReducer from "./features/bubble-image-slice";
import opportunityImageReducer from "./features/opportunity-image-slice";
import usersImageReducer from "./features/all-user-image-slice";
import jobTitleReducer from "./features/job-title-slice";
import rememberMeReducer from "./features/remember-me-slice";
import { apiSlice } from "./api/api-slice";
import { mlApiSlice } from "./ml-api/ml-api-slice";
import chatReducer from "./features/chat-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    //_____________________________Images
    image_cache: imageCacheReducer,
    profile_images: profileImageReducer,
    users_images: usersImageReducer,
    bubble_images: bubbleImageReducer,
    opportunity_images: opportunityImageReducer,
    //____________________________Text data
    remember_me: rememberMeReducer,
    job_title: jobTitleReducer,
    profiles: profilesReducer,
    currentProfile: currentProfileReducer,
    allUser: allUserReducer,
    bubble: bubbleReducer,
    user: userReducer,
    opportunity: opportunityReducer,
    chat: chatReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [mlApiSlice.reducerPath]: mlApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    // extend and return default middleware:
    return getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    })
    .concat(apiSlice.middleware)
    .concat(mlApiSlice.middleware)
  },
});
