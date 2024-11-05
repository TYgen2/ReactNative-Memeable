import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./screens/Splash";
import Login from "./screens/authStack/Login";
import Register from "./screens/authStack/Register";
import Home from "./screens/mainStack/Home";
import Search from "./screens/mainStack/Search";
import UserProfile from "./screens/mainStack/UserProfile";
import Notify from "./screens/mainStack/Notification";
import Upload from "./screens/uploadStack/Upload";
import EditProfile from "./screens/authStack/EditProfile";
import EditUserProfile from "./screens/settingStack/EditUserProfile";
import AppSetting from "./screens/settingStack/AppSetting";
import DetailedPost from "./screens/mainStack/DetailedPost";
import CustomTab from "./components/bottomTab/CustomTab";
import EditSongCover from "./screens/settingStack/EditSongCover";

import { useContext, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { store } from "./store/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { LoadingContextProvider, UpdateContext } from "./context/loading";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { EventProvider } from "react-native-outside-press";
import { reduxLogin } from "./store/userReducer";
import { enableScreens } from "react-native-screens";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeContext } from "./context/theme";
import { getData, storeData } from "./config/asyncStorage";
import useColorTheme from "./hooks/useColorTheme";
import { ProfileUpdateProvider } from "./context/ProfileUpdateContext";
import EditSongAudio from "./screens/settingStack/EditSongAudio";
import { setupPlayer } from "./utils/audioTrimmer/audioHelpers";
import TrackPlayer from "react-native-track-player";

const persistor = persistStore(store);
enableScreens();

TrackPlayer.registerPlaybackService(() => require("./service"));

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
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="Edit Profile" component={EditProfile} />
    </AuthStack.Navigator>
  );
};

// For logged in users, Home tab
const HomeScreen = () => {
  const { colors } = useColorTheme();

  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="UserProfile" component={UserProfile} />
      <HomeStack.Screen
        name="DetailedPost"
        component={DetailedPost}
        options={{
          headerShown: true,
          title: "Posts",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.text,
        }}
      />
    </HomeStack.Navigator>
  );
};

// Explore tab
const ExploreScreen = () => {
  const { colors } = useColorTheme();

  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="Search" component={Search} />
      <ExploreStack.Screen name="UserProfile" component={UserProfile} />
      <ExploreStack.Screen
        name="DetailedPost"
        component={DetailedPost}
        options={{
          headerShown: true,
          title: "Posts",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.text,
        }}
      />
    </ExploreStack.Navigator>
  );
};

// User profile tab
const UserProfileScreen = () => {
  const { colors } = useColorTheme();
  const { userDetails } = useSelector((state) => state.user);

  return (
    <UserProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <UserProfileStack.Screen
        name="UserProfile"
        component={UserProfile}
        initialParams={{ targetId: userDetails.userId }}
      />
      <UserProfileStack.Screen
        name="DetailedPost"
        component={DetailedPost}
        options={{
          headerShown: true,
          title: "Posts",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.text,
        }}
      />
    </UserProfileStack.Navigator>
  );
};

// Setting tab
const SettingScreen = () => {
  const { colors } = useColorTheme();

  return (
    <ProfileUpdateProvider>
      <SettingStack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.text,
        }}
      >
        <SettingStack.Screen
          name="EditUserProfile"
          component={EditUserProfile}
          options={{ title: "Edit user profile" }}
        />
        <SettingStack.Screen
          name="AppSetting"
          component={AppSetting}
          options={{ title: "Setting" }}
        />
        <SettingStack.Screen
          name="EditSongCover"
          component={EditSongCover}
          options={{ title: "Edit song cover" }}
        />
        <SettingStack.Screen
          name="EditSongAudio"
          component={EditSongAudio}
          options={{ title: "Trim song audio" }}
        />
      </SettingStack.Navigator>
    </ProfileUpdateProvider>
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
        component={Notify}
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
      <FunctionStack.Screen name="Upload" component={Upload} />
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
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const { loginStatus, userDetails } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const initializePlayer = async () => {
      try {
        if (mounted) {
          await setupPlayer();
          setIsPlayerReady(true);
        }
      } catch (error) {
        console.error("Error initializing player:", error);
      }
    };

    initializePlayer();

    // Cleanup function
    return () => {
      mounted = false;
      // Only destroy when the app is actually closing
      if (!__DEV__) {
        // Check if not in development mode
        TrackPlayer.destroy().catch(() => {
          // Ignore destroy errors during cleanup
        });
      }
    };
  }, []);

  // when user info is ready, login user
  useEffect(() => {
    if (userDetails && Object.keys(userDetails).length > 0) {
      dispatch(reduxLogin());
      setIsUserInfoReady(true);
    }
  }, [userDetails, dispatch]);

  if (isLoading || !isPlayerReady) {
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
