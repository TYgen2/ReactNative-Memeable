import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import home from "./screens/home";
import { useContext } from "react";
import login from "./screens/login";
import register from "./screens/register";
import { StatusBar } from "react-native";
import { store } from "./store/store";
import { Provider, useSelector } from "react-redux";
import Splash from "./screens/splash";
import { LoadingContextProvider, UpdateContext } from "./context/loading";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const Stack = createNativeStackNavigator();
const persistor = persistStore(store);

const App = () => {
  const { isLoading } = useContext(UpdateContext);
  const { loginStatus } = useSelector((state) => state.user);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <Stack.Navigator>
        {loginStatus ? (
          <Stack.Screen name="Home" component={home} />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={register}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function Root() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LoadingContextProvider>
          <App />
        </LoadingContextProvider>
      </PersistGate>
    </Provider>
  );
}
