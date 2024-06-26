import React, { useState, useEffect, createRef } from "react"
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native"
import appStyles from "../styles"
import supabase from "../lib/supabase"
import { Session } from "@supabase/gotrue-js"
import AsyncStorage from "@react-native-async-storage/async-storage"

const LoginScreen = ({ navigation, route }) => {
  const [headerShown, setHeaderShown] = useState(true)

  useEffect(() => {
    if (route.params && route.params.headerShown !== undefined) {
      setHeaderShown(route.params.headerShown)
    }
  }, [route.params])

  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState("")

  const handleSubmitPress = async () => {
    setErrorText("")
    if (!userEmail) {
      alert("Please fill Email")
      return
    }
    if (!userPassword) {
      alert("Please fill Password")
      return
    }

    // authenticate the user
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPassword,
    })
    // if there is an error, display the error message
    if (error) {
      setErrorText(error.message)
      console.error("Error:", error)
      return
    }
    // if there is no error, check if the user has "name"
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("name")
      .eq("id", user.id);
    const { data: accountData, error: accountError } = await supabase
      .from("users")
      .select("account_type")
      .eq("id", user.id);
    if (userError) {
      console.error("Error fetching user data:", userError);
      return;
    }
    if (accountError) {
      console.error("Error fetching account type:", userError);
      return;
    }
    const name = userData[0]?.name;
    const accountType = accountData[0]?.account_type;

    // check if name is missing and account type exists
    if (!name && accountType) {
      // navigate to the appropriate profile customization screen
      if (accountType === "personal") {
        navigation.navigate("CustomizeProfilePersonal");
      } else if (accountType === "creator") {
        navigation.navigate("CustomizeProfileCreator");
      } else {
        console.error("Unknown account type:", accountType);
      }
      return;
    }

    // Navigate based on account type
    if (accountType === "personal") {
      navigation.navigate("NavBar", { isCreator: false });
    } else if (accountType === "creator") {
      navigation.navigate("NavBar", { isCreator: true });
    } else {
      console.error("Unknown account type:", accountType);
    }
  };


  return (
    <View style={styles.mainBody}>
      <ImageBackground
        source={require("../images/loginBackground.png")}
        style={{ width: "100%", height: "100%" }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}>
          <View>
            <KeyboardAvoidingView enabled>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../assets/icons/knightlife-logo-white.png")}
                  style={{
                    width: "90%",
                    height: 100,
                    resizeMode: "contain",
                    margin: 30,
                  }}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserEmail) => setUserEmail(UserEmail)}
                  placeholder="Enter Email" //dummy@abc.com
                  placeholderTextColor="black"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={true}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                  placeholder="Enter Password" //12345
                  placeholderTextColor="black"
                  keyboardType="default"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={true}
                  secureTextEntry={true}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                />
              </View>
              {errorText != "" ? (
                <Text style={styles.errorTextStyle}>{errorText}</Text>
              ) : null}
              <View style={appStyles.layout.section}>
                <TouchableOpacity
                  style={appStyles.buttons.yellowLogin}
                  activeOpacity={0.5}
                  onPress={handleSubmitPress}>
                  <Text
                    style={[
                      appStyles.fonts.paragraph,
                      { color: "black", paddingVertical: 10 },
                    ]}>
                    Login
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[
                    appStyles.fonts.paragraph,
                    {
                      color: "white",
                      marginTop: 10,
                      textDecorationLine: "underline",
                    },
                  ]}
                  onPress={() =>
                    navigation.navigate("Auth", { screen: "AccountType" })
                  }>
                  Not Registered?
                </Text>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#7DE24E",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
    backgroundColor: "white",
    ...appStyles.fonts.paragraph,
  },
  registerTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
})
