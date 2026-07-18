import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//import screens
import {
  OnboardingScreen,
  OpeningScreen,
  WelcomeScreen,
  ProfileSelectorScreen,
  SignUpScreen,
  SignInScreen,
  PasswordScreen,
  ConfirmEmailScreen,
  ConfirmForgotEmailScreen,
  ForgotPasswordScreen,
  NewPasswordForgotScreen,
  SignUpBusinessAccountScreen,
  TermsScreen,
  PolicyScreen,
  HomeScreenCardFullView,
  ChatroomScreen,
  BubbleScreen,
  PostOpScreen,
  ProfileScreen,
  AddProfileScreen,
  AddProfileInfoScreen,
  AccountAboutMeScreen,
  AccountFullViewScreen,
  AccountActiveProfilesScreen,
  AccountOpportunityScreen,
  AccountUserQRCodeScreen,
  BubbleMateListScreen,
  MyOtherLinkScreen,
  MyPdfLinkScreen,
  MyWebLinkScreen,
  ProfilePersonaliserScreen,
  RenderPersonalisationScreen,
  EditProfileInfoScreen,
  ProfileBenefitsScreen,
  ManageProfileScreen,
  AccountSettingScreen,
  AboutReechScreen,
  AdSettingScreen,
  AdPrioritySettingScreen,
  AdPreferenceScreen,
  AppSettingScreen,
  HelpScreen,
  WishlistScreen,
  WishlistFilterScreen,
  AddCardInfoScreen,
  CardListScreen,
  EditCardInfoScreen,
  ReechBankDetailsScreen,
  PrivacyOptionScreen,
  AccountQRCodeScreen,
  ScanAccountQrCode,
  AccountInformationScreen,
  FileAttachmentScreen,
  FAQScreen,
  TutorialFullViewScreen,
  TutorialScreen,
  ChatbotScreen,
  SupportMessageFullViewScreen,
  MainMessageFullViewScreen,
  MainMessageScreen,
  ContactsScreen,
  SupportChatScreen,
  BubbleFullViewScreen,
  AddOpportunityCardScreen,
  EditOpportunityCardScreen,
  MyOpportunityCardScreen,
  MyOpportunityResponders,
  ReechingForHomeScreen,
  ReechRileyLibraryImageSelectorScreen,
  SearchCategoriesScreen,
  AddExperienceScreen,
  AddBeyondWorkScreen,
  AddCommunityEngagementScreen,
  AddCommunityEngagementPostScreen,
  BubbleMateProfileViewScreen,
  BubbleMateProfileAboutMeScreen,
  HowToAddVideoScreen,
  LoggedInBubbleProfileNotesScreen,
  SavedToDraftsScreen,
  EditThoughtSavedDataScreen,
  HowToVideoSavedDraftsScreen,
  ThoughtsSavedDraftsScreen,
  SearchAdScreen,
  VouchForSingleBubbleMateScreen,
  ProfileBubbleExperienceScreen,
  ProfileBubbleVouchScreen,
  VouchForBubbleMateScreen,
  IVouchForScreen,
  IVouchForFIlterScreen,
  SearchForPlacesScreen,
  SearchForPeopleScreen,
  VouchedForScreen,
  VouchedForFIlterScreen,
  BubbleMateFilterScreen,
  SearchReechersScreen,
  SearchPlacesFilterScreen,
  SearchPeopleFilterScreen,
  ExperienceFullViewScreen,
  AddThoughtScreen,
  AddThoughtDescriptionScreen,
  PreviewThoughtScreen,
  AddMoreHowToVideoInfoScreen,
  PreviewHowToScreen,
  HowToVideoMoreInfoScreen,
  HowToChannelCategoryScreen,
  HowToSingleChannelCategoryScreen,
  ThoughtMoreUserInfoScreen,
  ThoughtSingleChannelCategoryScreen,
  TipCreatorScreen,
  HowToChannelTogglerScreen,
  BalanceInfoScreen,
  CardTransactionGraphScreen,
  TransactionalFullView,
  TransactionErrorScreen,
  TransactionSuccessScreen,
  DepositScreen,
  WithdrawalScreen,
  RequestPaymentScreen,
  SendPaymentScreen,
  AuthAddProfileScreen,
  AuthAddProfileInfoScreen,
  AuthProfilePersonaliserScreen,
  AuthRenderPersonalisationScreen,
  ThoughtInfoScreen,
  ThoughtsChannelCategoryScreen,
  PersonalityAccountScreen,
  WorkStyleIdeaScreen,
  WorkStyleHybridScreen,
  OutdoorsyAccountScreen,
  EnergeticAccountScreen,
  ExpressiveAccountScreen,
  ReflectiveAccountScreen,
  BeyondWorkScreen,
  MyCommunityEngageScreen,
  MyCommunityEngagementFullViewScreen,
  MyCommunityImageFullViewScreen,
  MyCommunityTeamMemberScreen,
  AssignAdminMemberScreen,
  AssignTeamMemberScreen,
  LoggedInAccountUserScreen,
  LoggedInAccountAboutMeScreen,
  DriverAddOpportunityHomeScreen,
  DriverAddOpportunityLocationScreen,
  DriverAddOpportunityPreferencesScreen,
  DriverOpportunityPreviewScreen,
  DriverPassengerOpportunityFullViewScreen,
  RateDriverTripExperienceScreen,
  RatePassengerExperienceScreen,
  DriverOnTheWayScreen,
  DriverPickingUpPassengerScreen,
  MyAiCalendarHomeScreen,
  MyAiCalendarPreviewScreen,
  AddAvailabilityCalendarScreen,
  AddShortCutScreen,
} from "../screens";

//bottom navigation
import Tabs from "./tabs";
import DashboardTabs from "./dashboardTabs";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_CREDENTIALS_KEY, CURRENT_USER_KEY } from "../constants/auth";
import { setCredentials } from "../redux/features/auth-slice";
import { setCurrentUser } from "../redux/features/user-slice";
import useIsAuthenticated from "../hooks/useIsAuthenticated";

//////Added for logout when token expired/
import { useUpdateUserMutation } from "../redux/api/api-slice";
import { removeCredentials } from "../redux/features/auth-slice";
import { useSelector } from "react-redux";

function PublicNavigation() {
  const PublicStack = createStackNavigator();
  return (
    <PublicStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"SignInScreen"}
    >
      {/* common routes */}
      <PublicStack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <PublicStack.Screen name="TermsScreen" component={TermsScreen} />
      <PublicStack.Screen name="PolicyScreen" component={PolicyScreen} />

      {/*generic routes*/}
      <PublicStack.Screen name="OpeningScreen" component={OpeningScreen} />

      {/*authentication routes*/}
      <PublicStack.Screen name="SignUpScreen" component={SignUpScreen} />
      <PublicStack.Screen name="SignInScreen" component={SignInScreen} />
      <PublicStack.Screen name="PasswordScreen" component={PasswordScreen} />
      <PublicStack.Screen
        name="ConfirmEmailScreen"
        component={ConfirmEmailScreen}
      />
      <PublicStack.Screen
        name="ConfirmForgotEmailScreen"
        component={ConfirmForgotEmailScreen}
      />
      <PublicStack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <PublicStack.Screen
        name="NewPasswordForgotScreen"
        component={NewPasswordForgotScreen}
      />

      <PublicStack.Screen
        name="AuthAddProfileScreen"
        component={AuthAddProfileScreen}
      />
      <PublicStack.Screen
        name="AuthAddProfileInfoScreen"
        component={AuthAddProfileInfoScreen}
      />
      <PublicStack.Screen
        name="AuthProfilePersonaliserScreen"
        component={AuthProfilePersonaliserScreen}
      />
      <PublicStack.Screen
        name="AuthRenderPersonalisationScreen"
        component={AuthRenderPersonalisationScreen}
      />
    </PublicStack.Navigator>
  );
}

function AuthNavigation() {
  const AuthStack = createStackNavigator();
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"WelcomeScreen"}
    >
      {/* common routes */}
      <AuthStack.Screen name="TermsScreen" component={TermsScreen} />
      <AuthStack.Screen name="PolicyScreen" component={PolicyScreen} />
      {/*generic routes*/}
      <AuthStack.Screen name="HomeScreen" component={Tabs} />
      {/*business account routes*/}
      <AuthStack.Screen
        name="SignUpBusinessAccountScreen"
        component={SignUpBusinessAccountScreen}
      />
      {/*bottom navigation routes*/}
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="WelcomeScreen"
        component={WelcomeScreen}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="AddShortCutScreen"
        component={AddShortCutScreen}
      />

      <AuthStack.Screen
        name="ProfileSelectorScreen"
        component={ProfileSelectorScreen}
      />
      <AuthStack.Screen
        name="HomeScreenCardFullView"
        component={HomeScreenCardFullView}
      />

      <AuthStack.Screen name="ChatroomScreen" component={ChatroomScreen} />
      <AuthStack.Screen name="BubbleScreen" component={BubbleScreen} />
      <AuthStack.Screen name="PostOpScreen" component={PostOpScreen} />
      <AuthStack.Screen name="ProfileScreen" component={ProfileScreen} />
      {/*profile navigation*/}
      <AuthStack.Screen name="AddProfileScreen" component={AddProfileScreen} />
      <AuthStack.Screen
        name="AddProfileInfoScreen"
        component={AddProfileInfoScreen}
      />
      <AuthStack.Screen
        name="AccountAboutMeScreen"
        component={AccountAboutMeScreen}
      />
      <AuthStack.Screen
        name="AccountFullViewScreen"
        component={AccountFullViewScreen}
      />
      <AuthStack.Screen
        name="AccountActiveProfilesScreen"
        component={AccountActiveProfilesScreen}
      />
      <AuthStack.Screen
        name="AccountOpportunityScreen"
        component={AccountOpportunityScreen}
      />
      <AuthStack.Screen
        name="AccountUserQRCodeScreen"
        component={AccountUserQRCodeScreen}
      />
      <AuthStack.Screen name="BeyondWorkScreen" component={BeyondWorkScreen} />
      <AuthStack.Screen
        name="MyCommunityEngageScreen"
        component={MyCommunityEngageScreen}
      />
      <AuthStack.Screen
        name="MyCommunityEngagementFullViewScreen"
        component={MyCommunityEngagementFullViewScreen}
      />
      <AuthStack.Screen
        name="MyCommunityImageFullViewScreen"
        component={MyCommunityImageFullViewScreen}
      />
      <AuthStack.Screen
        name="MyCommunityTeamMemberScreen"
        component={MyCommunityTeamMemberScreen}
      />
      <AuthStack.Screen
        name="AssignAdminMemberScreen"
        component={AssignAdminMemberScreen}
      />
      <AuthStack.Screen
        name="AssignTeamMemberScreen"
        component={AssignTeamMemberScreen}
      />
      <AuthStack.Screen
        name="BubbleMateListScreen"
        component={BubbleMateListScreen}
      />
      <AuthStack.Screen
        name="MyOtherLinkScreen"
        component={MyOtherLinkScreen}
      />
      <AuthStack.Screen name="MyPdfLinkScreen" component={MyPdfLinkScreen} />
      <AuthStack.Screen name="MyWebLinkScreen" component={MyWebLinkScreen} />
      <AuthStack.Screen
        name="ProfilePersonaliserScreen"
        component={ProfilePersonaliserScreen}
      />
      <AuthStack.Screen
        name="RenderPersonalisationScreen"
        component={RenderPersonalisationScreen}
      />
      <AuthStack.Screen
        name="EditProfileInfoScreen"
        component={EditProfileInfoScreen}
      />
      <AuthStack.Screen
        name="ProfileBenefitsScreen"
        component={ProfileBenefitsScreen}
      />
      <AuthStack.Screen
        name="ManageProfileScreen"
        component={ManageProfileScreen}
      />
      <AuthStack.Screen
        name="AccountSettingScreen"
        component={AccountSettingScreen}
      />
      <AuthStack.Screen
        name="AboutReechScreen"
        component={AboutReechScreen}
      />
      <AuthStack.Screen name="AdSettingScreen" component={AdSettingScreen} />
      <AuthStack.Screen
        name="AdPrioritySettingScreen"
        component={AdPrioritySettingScreen}
      />
      <AuthStack.Screen
        name="AdPreferenceScreen"
        component={AdPreferenceScreen}
      />
      <AuthStack.Screen name="AppSettingScreen" component={AppSettingScreen} />
      <AuthStack.Screen name="HelpScreen" component={HelpScreen} />
      <AuthStack.Screen
        name="ActivityDashboardScreen"
        component={DashboardTabs}
      />
      <AuthStack.Screen name="WishlistScreen" component={WishlistScreen} />
      <AuthStack.Screen
        name="WishlistFilterScreen"
        component={WishlistFilterScreen}
      />
      <AuthStack.Screen
        name="AddCardInfoScreen"
        component={AddCardInfoScreen}
      />
      <AuthStack.Screen name="CardListScreen" component={CardListScreen} />
      <AuthStack.Screen
        name="EditCardInfoScreen"
        component={EditCardInfoScreen}
      />
      <AuthStack.Screen
        name="ReechBankDetailsScreen"
        component={ReechBankDetailsScreen}
      />
      <AuthStack.Screen
        name="PrivacyOptionScreen"
        component={PrivacyOptionScreen}
      />
      <AuthStack.Screen
        name="ScanAccountQrCode"
        component={ScanAccountQrCode}
      />
      <AuthStack.Screen
        name="AccountQRCodeScreen"
        component={AccountQRCodeScreen}
      />
      {/*Account settings screen*/}
      <AuthStack.Screen
        name="AccountInformationScreen"
        component={AccountInformationScreen}
      />
      <AuthStack.Screen
        name="FileAttachmentScreen"
        component={FileAttachmentScreen}
      />
      {/*tutorial navigation*/}
      <AuthStack.Screen name="FAQScreen" component={FAQScreen} />
      <AuthStack.Screen name="TutorialScreen" component={TutorialScreen} />
      <AuthStack.Screen name="TutorialFullViewScreen" component={TutorialFullViewScreen} />
      {/*chat navigation*/}
      <AuthStack.Screen name="ChatbotScreen" component={ChatbotScreen} />
      <AuthStack.Screen
        name="SupportChatScreen"
        component={SupportChatScreen}
      />
      <AuthStack.Screen
        name="SupportMessageFullViewScreen"
        component={SupportMessageFullViewScreen}
      />
      <AuthStack.Screen
        name="MainMessageFullViewScreen"
        component={MainMessageFullViewScreen}
      />
      <AuthStack.Screen
        name="MainMessageScreen"
        component={MainMessageScreen}
      />
      <AuthStack.Screen name="ContactsScreen" component={ContactsScreen} />
      {/*promo ad*/}
      <AuthStack.Screen
        name="BubbleFullViewScreen"
        component={BubbleFullViewScreen}
      />
      {/*reeching for screens*/}
      <AuthStack.Screen
        name="AddOpportunityCardScreen"
        component={AddOpportunityCardScreen}
      />
      <AuthStack.Screen
        name="EditOpportunityCardScreen"
        component={EditOpportunityCardScreen}
      />
      <AuthStack.Screen
        name="MyOpportunityCardScreen"
        component={MyOpportunityCardScreen}
      />
      <AuthStack.Screen
        name="MyOpportunityResponders"
        component={MyOpportunityResponders}
      />
      <AuthStack.Screen
        name="ReechingForHomeScreen"
        component={ReechingForHomeScreen}
      />
      <AuthStack.Screen
        name="ReechRileyLibraryImageSelectorScreen"
        component={ReechRileyLibraryImageSelectorScreen}
      />
      <AuthStack.Screen
        name="SearchCategoriesScreen"
        component={SearchCategoriesScreen}
      />
      {/*bubble screens options*/}
      <AuthStack.Screen
        name="AddExperienceScreen"
        component={AddExperienceScreen}
      />
      <AuthStack.Screen
        name="AddBeyondWorkScreen"
        component={AddBeyondWorkScreen}
      />
      <AuthStack.Screen
        name="AddCommunityEngagementScreen"
        component={AddCommunityEngagementScreen}
      />
      <AuthStack.Screen
        name="AddCommunityEngagementPostScreen"
        component={AddCommunityEngagementPostScreen}
      />
      <AuthStack.Screen
        name="BubbleMateProfileViewScreen"
        component={BubbleMateProfileViewScreen}
      />
      <AuthStack.Screen
        name="BubbleMateProfileAboutMeScreen"
        component={BubbleMateProfileAboutMeScreen}
      />
      <AuthStack.Screen
        name="HowToAddVideoScreen"
        component={HowToAddVideoScreen}
      />
      <AuthStack.Screen name="LoggedInBubbleProfileNotesScreen" component={LoggedInBubbleProfileNotesScreen} />
      <AuthStack.Screen name="SavedToDraftsScreen" component={SavedToDraftsScreen} />
      <AuthStack.Screen name="EditThoughtSavedDataScreen" component={EditThoughtSavedDataScreen} />
      <AuthStack.Screen name="HowToVideoSavedDraftsScreen" component={HowToVideoSavedDraftsScreen} />
      <AuthStack.Screen name="ThoughtsSavedDraftsScreen" component={ThoughtsSavedDraftsScreen} />
      <AuthStack.Screen name="SearchAdScreen" component={SearchAdScreen} />
      <AuthStack.Screen
        name="VouchForSingleBubbleMateScreen"
        component={VouchForSingleBubbleMateScreen}
      />
      <AuthStack.Screen
        name="ProfileBubbleExperienceScreen"
        component={ProfileBubbleExperienceScreen}
      />
      <AuthStack.Screen
        name="ProfileBubbleVouchScreen"
        component={ProfileBubbleVouchScreen}
      />
      <AuthStack.Screen
        name="VouchForBubbleMateScreen"
        component={VouchForBubbleMateScreen}
      />
      <AuthStack.Screen name="IVouchForScreen" component={IVouchForScreen} />
      <AuthStack.Screen
        name="IVouchForFIlterScreen"
        component={IVouchForFIlterScreen}
      />
      <AuthStack.Screen name="VouchedForScreen" component={VouchedForScreen} />
      <AuthStack.Screen
        name="VouchedForFIlterScreen"
        component={VouchedForFIlterScreen}
      />
      <AuthStack.Screen
        name="BubbleMateFilterScreen"
        component={BubbleMateFilterScreen}
      />
      <AuthStack.Screen
        name="SearchForPeopleScreen"
        component={SearchForPeopleScreen}
      />
      <AuthStack.Screen
        name="SearchForPlacesScreen"
        component={SearchForPlacesScreen}
      />
      <AuthStack.Screen
        name="SearchReechersScreen"
        component={SearchReechersScreen}
      />
      <AuthStack.Screen
        name="SearchPlacesFilterScreen"
        component={SearchPlacesFilterScreen}
      />
      <AuthStack.Screen
        name="SearchPeopleFilterScreen"
        component={SearchPeopleFilterScreen}
      />
      <AuthStack.Screen
        name="PersonalityAccountScreen"
        component={PersonalityAccountScreen}
      />
      <AuthStack.Screen
        name="EnergeticAccountScreen"
        component={EnergeticAccountScreen}
      />
      <AuthStack.Screen
        name="ExpressiveAccountScreen"
        component={ExpressiveAccountScreen}
      />
      <AuthStack.Screen
        name="OutdoorsyAccountScreen"
        component={OutdoorsyAccountScreen}
      />
      <AuthStack.Screen
        name="ReflectiveAccountScreen"
        component={ReflectiveAccountScreen}
      />
      <AuthStack.Screen
        name="WorkStyleIdeaScreen"
        component={WorkStyleIdeaScreen}
      />
      <AuthStack.Screen
        name="WorkStyleHybridScreen"
        component={WorkStyleHybridScreen}
      />
      <AuthStack.Screen
        name="ExperienceFullViewScreen"
        component={ExperienceFullViewScreen}
      />
      <AuthStack.Screen name="AddThoughtScreen" component={AddThoughtScreen} />
      <AuthStack.Screen
        name="AddThoughtDescriptionScreen"
        component={AddThoughtDescriptionScreen}
      />
      <AuthStack.Screen
        name="PreviewThoughtScreen"
        component={PreviewThoughtScreen}
      />
      <AuthStack.Screen
        name="AddMoreHowToVideoInfoScreen"
        component={AddMoreHowToVideoInfoScreen}
      />
      <AuthStack.Screen
        name="PreviewHowToScreen"
        component={PreviewHowToScreen}
      />
      <AuthStack.Screen
        name="HowToVideoMoreInfoScreen"
        component={HowToVideoMoreInfoScreen}
      />
      <AuthStack.Screen
        name="HowToChannelCategoryScreen"
        component={HowToChannelCategoryScreen}
      />
      <AuthStack.Screen
        name="HowToSingleChannelCategoryScreen"
        component={HowToSingleChannelCategoryScreen}
      />
      <AuthStack.Screen
        name="ThoughtMoreUserInfoScreen"
        component={ThoughtMoreUserInfoScreen}
      />
      <AuthStack.Screen
        name="ThoughtSingleChannelCategoryScreen"
        component={ThoughtSingleChannelCategoryScreen}
      />
      <AuthStack.Screen name="TipCreatorScreen" component={TipCreatorScreen} />
      <AuthStack.Screen
        name="HowToChannelTogglerScreen"
        component={HowToChannelTogglerScreen}
      />
      <AuthStack.Screen
        name="BalanceInfoScreen"
        component={BalanceInfoScreen}
      />
      <AuthStack.Screen
        name="CardTransactionGraphScreen"
        component={CardTransactionGraphScreen}
      />
      <AuthStack.Screen
        name="TransactionalFullView"
        component={TransactionalFullView}
      />
      <AuthStack.Screen
        name="TransactionErrorScreen"
        component={TransactionErrorScreen}
      />
      <AuthStack.Screen
        name="TransactionSuccessScreen"
        component={TransactionSuccessScreen}
      />
      <AuthStack.Screen name="DepositScreen" component={DepositScreen} />
      <AuthStack.Screen name="WithdrawalScreen" component={WithdrawalScreen} />
      <AuthStack.Screen
        name="RequestPaymentScreen"
        component={RequestPaymentScreen}
      />
      <AuthStack.Screen
        name="SendPaymentScreen"
        component={SendPaymentScreen}
      />
      <AuthStack.Screen
        name="ThoughtInfoScreen"
        component={ThoughtInfoScreen}
      />
      <AuthStack.Screen
        name="ThoughtsChannelCategoryScreen"
        component={ThoughtsChannelCategoryScreen}
      />
      <AuthStack.Screen
        name="LoggedInAccountUserScreen"
        component={LoggedInAccountUserScreen}
      />
      <AuthStack.Screen
        name="LoggedInAccountAboutMeScreen"
        component={LoggedInAccountAboutMeScreen}
      />
      <AuthStack.Screen
        name="DriverAddOpportunityHomeScreen"
        component={DriverAddOpportunityHomeScreen}
      />
      <AuthStack.Screen
        name="DriverAddOpportunityLocationScreen"
        component={DriverAddOpportunityLocationScreen}
      />
      <AuthStack.Screen
        name="DriverAddOpportunityPreferencesScreen"
        component={DriverAddOpportunityPreferencesScreen}
      />
      <AuthStack.Screen
        name="DriverOpportunityPreviewScreen"
        component={DriverOpportunityPreviewScreen}
      />
      <AuthStack.Screen
        name="DriverPassengerOpportunityFullViewScreen"
        component={DriverPassengerOpportunityFullViewScreen}
      />
      <AuthStack.Screen
        name="RateDriverTripExperienceScreen"
        component={RateDriverTripExperienceScreen}
      />
      <AuthStack.Screen
        name="RatePassengerExperienceScreen"
        component={RatePassengerExperienceScreen}
      />
      <AuthStack.Screen
        name="DriverOnTheWayScreen"
        component={DriverOnTheWayScreen}
      />
      <AuthStack.Screen
        name="DriverPickingUpPassengerScreen"
        component={DriverPickingUpPassengerScreen}
      />
      <AuthStack.Screen
        name="MyAiCalendarHomeScreen"
        component={MyAiCalendarHomeScreen}
      />
      <AuthStack.Screen
        name="MyAiCalendarPreviewScreen"
        component={MyAiCalendarPreviewScreen}
      />
      <AuthStack.Screen
        name="AddAvailabilityCalendarScreen"
        component={AddAvailabilityCalendarScreen}
      />
    </AuthStack.Navigator>
  );
}

export default function AppNavigation() {
  const dispatch = useDispatch();
  const isAuthenticated = useIsAuthenticated();

  const user = useSelector((state) => state.user.current_user);
  const [updateUserFn] = useUpdateUserMutation();

  
  const SignOut = () => {
    const userId = user?._id;
    const body = { isOnline: false };

    updateUserFn({ body, userId })
      .then((res) => {
        if (res.error) {
          console.log(res.error.data?.message);
          return;
        }
        console.log("User logged out successfully. Navigation");

        dispatch(removeCredentials());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      AsyncStorage.getItem(CURRENT_USER_KEY)
        .then((user) => {
          if (user) {
            dispatch(setCurrentUser({ current_user: JSON.parse(user) }));
          }
        })
        .catch((err) => {
          // TODO: handle error
          console.error({ err });
        });
      return;
    }
    // else if (!isAuthenticated && user?._id) {
    //   SignOut();
    // }

    AsyncStorage.getItem(USER_CREDENTIALS_KEY)
      .then((credentials) => {
        if (credentials) {
          dispatch(setCredentials(JSON.parse(credentials)));
        }
      })
      .catch((err) => {
        // TODO: handle error
        console.error({ err });
      });
  }, [isAuthenticated]);
  if (isAuthenticated) {
    return <AuthNavigation />;
  }
  return <PublicNavigation />;
}
