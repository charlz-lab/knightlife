import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Font from "expo-font";
import Card from "../knightlife/components/EventCard";
import HOME from "./pages/HOME";
import PROFILE from "./pages/PROFILE";
import { EDIT_PROFILE } from "./pages/PROFILE";
import SEARCH from "./pages/SEARCH";
import SAVED_EVENTS from "./pages/SAVED_EVENTS";
import CREATE_EVENTS from "./pages/CREATE_EVENTS";
import Settings from "./pages/Settings Folder/SETTINGS";
import Privacy from "./pages/Settings Folder/PRIVACY";
import AddSwitchAccounts from "./pages/Settings Folder/ADD_SWITCH_ACCOUNTS";
import Accessibility from "./pages/Settings Folder/ACCESSIBILITY"
import EditAccount from "./pages/Settings Folder/EDIT_ACCOUNT"
import CreateAccount from "./pages/Settings Folder/CREATEACCOUNT"


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
var isCreator = false;

// header component
const HeaderHomeToggle = () => {
  return (
    <View style={styles.toggle}>
      <TouchableHighlight style={[styles.highlighted, styles.options]}>
        <Text>Following</Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.options}>
        <Text>Discover</Text>
      </TouchableHighlight>
    </View>
  );
};

// navigation for nav bar
function NavBar() {
  return (
    <Tab.Navigator>
      {isCreator ? (
        <>
          <Tab.Screen name="Create_Events" component={CREATE_EVENTS} />
          <Tab.Screen name="Profile" component={PROFILE} />
        </>
      ) : (
        <>
          <Tab.Screen name="Home" component={HOME} />
          <Tab.Screen name="Profile" component={PROFILE} />
        </>
      )}
    </Tab.Navigator>
  );
}

// navigation outside of nav bar
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: styles.header }}>

        <Stack.Screen name="NavBar" component={NavBar}></Stack.Screen>
        <Stack.Screen
          name="HOME"
          component={HOME}
          options={{
            headerStyle: styles.header,
            headerTitle: () => <HeaderHomeToggle />,
          }}
        />

        <Stack.Screen name="SEARCH" component={SEARCH} />
        <Stack.Screen
          name="EDIT_PROFILE"
          component={EDIT_PROFILE}
        ></Stack.Screen>

        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="AddSwitchAccounts" component={AddSwitchAccounts} />
        <Stack.Screen name="Accessibility" component={Accessibility} />
        <Stack.Screen name="EditAccount" component={EditAccount} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="Settings" component={Settings} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#FFC60A",
    paddingVertical: 15,
    paddingHorizontal: 30,
    height: "100%",
    width: "100%",
  },
  toggle: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 50,
    marginVertical: 10,
    padding: 5,
  },
  options: {
    paddingHorizontal: 38,
    paddingVertical: 10,
    borderRadius: 50,
  },
  highlighted: {
    backgroundColor: "#FFC60A",
  },
});
