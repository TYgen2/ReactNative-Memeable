import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./screens/splash";
import login from "./screens/authStack/login";
import register from "./screens/authStack/register";
import home from "./screens/mainStack/home";
import viewPost from "./screens/mainStack/viewPost";
import search from "./screens/mainStack/search";
import userProfile from "./screens/mainStack/userProfile";
import notify from "./screens/mainStack/notification";
import upload from "./screens/uploadStack/upload";
import editProfile from "./screens/authStack/editProfile";
import { useContext, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { store } from "./store/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { LoadingContextProvider, UpdateContext } from "./context/loading";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTab from "./components/customTab";
import { EventProvider } from "react-native-outside-press";
import { reduxLogin } from "./store/userReducer";
import BackButton from "./components/backButton";

const persistor = persistStore(store);

// Bottom tab navigation
const Tab = createBottomTabNavigator();

const AuthStack = createNativeStackNavigator();
const UserStack = createNativeStackNavigator();

const MainStack = createNativeStackNavigator();
const UploadStack = createNativeStackNavigator();

// For login and register
const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={login} />
      <AuthStack.Screen name="Register" component={register} />
      <AuthStack.Screen name="Edit Profile" component={editProfile} />
    </AuthStack.Navigator>
  );
};

// For logged in users
const UserStackScreen = () => {
  return (
    <UserStack.Navigator screenOptions={{ headerShown: false }}>
      <UserStack.Screen name="Home" component={home} />
      <UserStack.Screen name="ViewPost" component={viewPost} />
      <UserStack.Screen name="UserProfile" component={userProfile} />
    </UserStack.Navigator>
  );
};

// For main screen UI
const MainStackScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTab {...props} />}
    >
      <Tab.Screen
        name="UserStack"
        component={UserStackScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Search"
        component={search}
        options={{ title: "Explore" }}
      />
      <Tab.Screen
        name="Notify"
        component={notify}
        options={{ title: "Noti" }}
      />
      <Tab.Screen
        name="UserProfile"
        component={userProfile}
        options={{ title: "me" }}
      />
    </Tab.Navigator>
  );
};

// For upload procedures
const UploadStackScreen = () => {
  return (
    <UploadStack.Navigator screenOptions={{ headerShown: false }}>
      <UploadStack.Screen name="Upload" component={upload} />
    </UploadStack.Navigator>
  );
};

// Wrapper of authenticated users' screen
const MainStackNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainStack" component={MainStackScreen} />
      <MainStack.Screen name="UploadStack" component={UploadStackScreen} />
    </MainStack.Navigator>
  );
};

const App = () => {
  const { isLoading } = useContext(UpdateContext);
  const [isUserInfoReady, setIsUserInfoReady] = useState(false);
  const { loginStatus, userInfo } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  // when user info is ready, login user
  useEffect(() => {
    if (userInfo) {
      dispatch(reduxLogin());
      setIsUserInfoReady(true);
    }
  }, [userInfo]);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="white"
      />
      {loginStatus && isUserInfoReady ? (
        <MainStackNavigator />
      ) : (
        <AuthStackScreen />
      )}
    </NavigationContainer>
  );
};

export default function Root() {
  return (
    <EventProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <LoadingContextProvider>
            <App />
          </LoadingContextProvider>
        </PersistGate>
      </Provider>
    </EventProvider>
  );
}
