import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./screens/splash";
import login from "./screens/authStack/login";
import register from "./screens/authStack/register";
import home from "./screens/mainStack/home";
import search from "./screens/mainStack/search";
import userProfile from "./screens/mainStack/userProfile";
import notify from "./screens/mainStack/notification";
import upload from "./screens/uploadStack/upload";
import editProfile from "./screens/authStack/editProfile";
import editUserProfile from "./screens/settingStack/editUserProfile";
import appSetting from "./screens/settingStack/appSetting";
import { useContext, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { store } from "./store/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { LoadingContextProvider, UpdateContext } from "./context/loading";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTab from "./components/bottomTab/customTab";
import { EventProvider } from "react-native-outside-press";
import { reduxLogin } from "./store/userReducer";
import { enableScreens } from "react-native-screens";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import editBorderColor from "./screens/settingStack/editBorderColor";
import { ThemeContext } from "./context/theme";
import { getData, storeData } from "./config/asyncStorage";
import useColorTheme from "./hooks/useColorTheme";
import DetailedPost from "./screens/mainStack/detailedPost";

const persistor = persistStore(store);
enableScreens();

// Bottom tab navigation
const Tab = createBottomTabNavigator();

const AuthStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const ExploreStack = createNativeStackNavigator();
const UserProfileStack = createNativeStackNavigator();
const SettingStack = createNativeStackNavigator();

const MainStack = createNativeStackNavigator();
const FunctionStack = createNativeStackNavigator();

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

// For logged in users, Home tab
const HomeScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={home} />
      <HomeStack.Screen name="UserProfile" component={userProfile} />
    </HomeStack.Navigator>
  );
};

// Explore tab
const ExploreScreen = () => {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="Search" component={search} />
      <ExploreStack.Screen name="UserProfile" component={userProfile} />
    </ExploreStack.Navigator>
  );
};

// User profile tab
const UserProfileScreen = () => {
  const { userDetails } = useSelector((state) => state.user);

  return (
    <UserProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <UserProfileStack.Screen
        name="UserProfile"
        component={userProfile}
        initialParams={{ targetId: userDetails.userId }}
      />
      <UserProfileStack.Screen
        name="DetailedPost"
        component={DetailedPost}
        options={{ headerShown: true, title: "Posts" }}
      />
    </UserProfileStack.Navigator>
  );
};

// Setting tab
const SettingScreen = () => {
  const { colors } = useColorTheme();

  return (
    <SettingStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.text,
      }}
    >
      <SettingStack.Screen
        name="EditUserProfile"
        component={editUserProfile}
        options={{ title: "Edit user profile" }}
      />
      <SettingStack.Screen
        name="EditBorderColor"
        component={editBorderColor}
        options={{
          title: "Edit border color",
          animation: "slide_from_bottom",
        }}
      />
      <SettingStack.Screen
        name="AppSetting"
        component={appSetting}
        options={{ title: "Setting" }}
      />
    </SettingStack.Navigator>
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
        name="HomeStack"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="SearchStack"
        component={ExploreScreen}
        options={{ title: "Explore" }}
      />
      <Tab.Screen
        name="Notify"
        component={notify}
        options={{ title: "Noti" }}
      />
      <Tab.Screen
        name="UserProfileStack"
        component={UserProfileScreen}
        options={{ title: "me" }}
      />
    </Tab.Navigator>
  );
};

// For upload procedures
const FunctionScreen = () => {
  return (
    <FunctionStack.Navigator screenOptions={{ headerShown: false }}>
      <FunctionStack.Screen name="Upload" component={upload} />
    </FunctionStack.Navigator>
  );
};

// Wrapper of authenticated users' screen
const MainStackNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainStack" component={MainStackScreen} />
      <MainStack.Screen name="FunctionStack" component={FunctionScreen} />
      <MainStack.Screen name="SettingStack" component={SettingScreen} />
    </MainStack.Navigator>
  );
};

const App = () => {
  const { mode } = useColorTheme();

  const { isLoading } = useContext(UpdateContext);
  const [isUserInfoReady, setIsUserInfoReady] = useState(false);
  const { loginStatus, userDetails } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  // when user info is ready, login user
  useEffect(() => {
    if (userDetails && Object.keys(userDetails).length > 0) {
      dispatch(reduxLogin());
      setIsUserInfoReady(true);
    }
  }, [userDetails, dispatch]);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        translucent={true}
        backgroundColor="transparent"
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
  const [theme, setTheme] = useState({ mode: "dark" });
  const updateTheme = (newTheme) => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === "dark" ? "light" : "dark";
      newTheme = { mode };
    }
    setTheme(newTheme);
    storeData("theme", newTheme);
  };

  const fetchStoredTheme = async () => {
    try {
      const themeData = await getData("theme");
      if (themeData) {
        updateTheme(themeData);
      }
    } catch ({ message }) {
      alert(message);
    }
  };

  useEffect(() => {
    fetchStoredTheme();
  }, []);

  return (
    <EventProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <LoadingContextProvider>
            <GestureHandlerRootView>
              <BottomSheetModalProvider>
                <ThemeContext.Provider value={{ theme, updateTheme }}>
                  <App />
                </ThemeContext.Provider>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </LoadingContextProvider>
        </PersistGate>
      </Provider>
    </EventProvider>
  );
}
