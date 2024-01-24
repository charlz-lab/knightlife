import { StatusBar } from "expo-status-bar"
import React from "react"
import { StyleSheet, Text, View, TouchableHighlight, Image } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Card from "../knightlife/components/EventCard"
import HOME from "./pages/HOME"
import PROFILE from "./pages/PROFILE"
import { EDIT_PROFILE } from "./pages/PROFILE"
import SEARCH from "./pages/SEARCH"
import SAVED_EVENTS from "./pages/SAVED_EVENTS"
import CREATE_EVENTS from "./pages/CREATE_EVENTS"
import appStyles from "./styles"
import {useFonts} from "expo-font"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()
var isCreator = false

// header component
const HeaderHomeToggle = () => {
  
  return (
    <View style={styles.toggle}>
      <TouchableHighlight style={[styles.highlighted, styles.options]}>
        <Text style = {styles.ibm_medium_font}>Following</Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.options}>
        <Text>Discover</Text>
      </TouchableHighlight>
    </View>
  )
}

// navigation for nav bar
function NavBar() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle:{backgroundColor: appStyles.colors.mainBackground}
    }}>
      {isCreator ? (
        <>
          <Tab.Screen name="Saved Events" component={SAVED_EVENTS} options={{
            title:"",
            tabBarIcon:({color,size})=>{
            return (
              <Image
        source={require("/assets/icons/fi-bs-calendar.png")}
        style={{ width: size, height: size }}
      />
            )
          }}}/>
          <Tab.Screen name="Create_Events" component={CREATE_EVENTS} options={{
            title:"",
            tabBarIcon:({color,size})=>{
            return (
              <Image
        source={require("/assets/icons/fi-br-add.png")}
        style={{ width: size, height: size }}
      />
            )
          }}}/>
          <Tab.Screen name="Profile" component={PROFILE} options={{
            title:"",
            tabBarIcon:({color,size})=>{
            return (
              <Image
        source={require("/assets/icons/fi-bs-profile.png")}
        style={{ width: size, height: size }}
      />
            )
          }}}/>
        </>
      ) : (
        <>
          <Tab.Screen name="Home" component={HOME} options={{
            title:"",
            tabBarIcon:({color,size})=>{
            return (
              <Image
        source={require("/assets/icons/fi-ss-home.png")}
        style={{ width: size, height: size }}
      />
            )
          }}}/>
          <Tab.Screen name="Search" component={SEARCH}  options={{
            title:"",
            tabBarIcon:({color,size})=>{
            return (
              <Image
        source={require("/assets/icons/fi-br-search.png")}
        style={{ width: size, height: size }}
      />
            )
          }}}/>
          <Tab.Screen name="Saved Events" component={SAVED_EVENTS}  options={{
            title:"",
            tabBarIcon:({color,size})=>{
            return (
              <Image
        source={require("/assets/icons/fi-bs-calendar.png")}
        style={{ width: size, height: size }}
      />
            )
          }}}/>
          <Tab.Screen name="Profile" component={PROFILE}  options={{
            title:"",
            tabBarIcon:({color,size})=>{
            return (
              <Image
        source={require("/assets/icons/fi-bs-profile.png")}
        style={{ width: size, height: size }}
      />
            )
          }}}/>
        </>
      )}
    </Tab.Navigator>
  )
}

// navigation outside of nav bar
export default function App() {
  const [fontsLoaded] = useFonts({
  "IBMPlexSans-Medium": require("./assets/fonts/IBMPlexSans-Medium.ttf"),
  "IBMPlexSans-Regular": require("./assets/fonts/IBMPlexSans-Regular.ttf"),
});
if(!fontsLoaded){
  return <Text>
    Loading...
  </Text>
}
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
          component={EDIT_PROFILE}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
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
  }
})
