import React, { useState, createRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import appStyles from "../styles";

const RegisterScreenPersonal = (props) => {
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [name, setName] = useState("")
  const [year, setYear] = useState("")
  const [major, setMajor] = useState("")
  const [campus, setCampus] = useState("")
  const [loading, setLoading] = useState(false)
  const [errortext, setErrortext] = useState("")
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false)

  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const yearInputRef = createRef();
  const majorInputRef = createRef();
  const locationInputRef = createRef();

  const [newUser, setNewUser] = useState(null); // Use a state variable to store the new user // Declare a variable to store the new user

  const handleCreateAccButton = async () => {
    setErrortext("");

    if (!userName || !userEmail || !userPassword) {
      alert("Please fill in all the fields");
      return;
    }

    try {
      const { user, error } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword,
        username: userName,
      });

      if (error) {
        console.error('Sign up error:', error.message); // Log the error message
        alert(`Registration failed: ${error.message}`);
      } else {
        setNewUser(user); // Store the new user
        setIsRegistrationSuccess(true);

        alert('Registration successful! Check your email for verification.');
      }
    } catch (error) {
      console.error('Error during sign up:', error.message);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleCreateProfileButton = async () => {
    setErrortext("");

    // Validate input fields for profile creation
    if (!name || !year || !major || !campus) {
      alert("Please fill all profile fields");
      return;
    }

    if (newUser) {
      const userId = newUser.id; // Use the new user's ID

      try {
        // Update the user's profile with the input fields
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            id: userId,
            username: userName,
            email: userEmail,
            password: userPassword,
            name: name,
            campus_location: campus,
            account_type: 'personal'
          });

        if (userError) {
          alert("Failed to update account type. " + userError.message);
          console.log(newUser)
          return;
        }

        // Insert into personal_accounts table
        const { data: personalData, error: personalError } = await supabase
          .from('personal_users')
          .insert({
            id: userId,
            name: name,
            school_year: year,
            major: major,
            // ...other properties...
          });

        if (personalError) {
          alert("Failed to insert into personal_users. " + personalError.message);
          console.log(newUser)
          return;
        }

        // Profile and account type update successful
        alert("Profile creation successful. Account type set to personal.");
        console.log(newUser)
        props.navigation.navigate("NavBar", { isCreator: false });
      } catch (error) {
        console.error("Error during profile creation:", error.message);
      }
    } else {
      alert("User is not signed in.");
    }
  };

  if (isRegistrationSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: appStyles.colors.background,
          justifyContent: "center",
          flexDirection: "column",
          rowGap: 20,
        }}
      >
        <Text
          style={[
            appStyles.fonts.headingTwo,
            { textAlign: "center", marginTop: -40 },
          ]}
        >
          Customize your {"\n"}Profile
        </Text>
        <View>
          <Image
            source={require("../images/profilePic_placeholder.png")}
            style={{
              height: 100,
              resizeMode: "contain",
              alignSelf: "center",
            }}
          />
          <Text
            style={[
              appStyles.fonts.paragraph,
              {
                textAlign: "center",
                marginTop: 5,
                textDecorationLine: "underline",
              },
            ]}
          >
            Add profile picture
          </Text>
        </View>
        <View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(name) => setName(name)}
              underlineColorAndroid="#f000"
              placeholder="Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(year) => setYear(year)}
              underlineColorAndroid="#f000"
              placeholder="School year"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(major) => setMajor(major)}
              underlineColorAndroid="#f000"
              placeholder="Major"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(campus) => setCampus(campus)}
              underlineColorAndroid="#f000"
              placeholder="Campus Location"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
        </View>
        <View
          style={[
            appStyles.layout.section,
            { flexDirection: "row", columnGap: 15 },
          ]}
        >
          <TouchableOpacity
            style={[styles.goBack, appStyles.shadow]}
            activeOpacity={0.5}
            onPress={() => props.navigation.goBack()}
          >
            <Text style={styles.buttonTextStyle}>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              appStyles.buttons.yellowNoWidth,
              appStyles.shadow,
              { width: "35%" },
            ]}
            activeOpacity={0.5}
            onPress={handleCreateProfileButton}
            disabled={!newUser}>
            <Text style={styles.buttonTextStyle}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "column",
          rowGap: 60,
        }}
      >
        <View style={{ alignItems: "center", paddingTop: 40 }}>
          <Text style={appStyles.fonts.headingTwo}>Sign Up</Text>
        </View>
        <KeyboardAvoidingView enabled>
          <View style={{ marginTop: 55 }}>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserName) => setUserName(UserName)}
                underlineColorAndroid="#f000"
                placeholder="Username"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() =>
                  emailInputRef.current && emailInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) => setUserEmail(UserEmail)}
                underlineColorAndroid="#f000"
                placeholder="UCF Email"
                placeholderTextColor="#8b9cb5"
                keyboardType="email-address"
                ref={emailInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                underlineColorAndroid="#f000"
                placeholder="Password"
                placeholderTextColor="#8b9cb5"
                ref={passwordInputRef}
                returnKeyType="next"
                secureTextEntry={true}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
              />
            </View>
          </View>
          {errortext != "" ? (
            <Text style={styles.errorTextStyle}>{errortext}</Text>
          ) : null}
          <View
            style={[
              appStyles.layout.section,
              { flexDirection: "row", columnGap: 15, marginTop: 30 },
            ]}
          >
            <TouchableOpacity
              style={[styles.goBack, appStyles.shadow]}
              activeOpacity={0.5}
              onPress={() => props.navigation.goBack()}
            >
              <Text style={styles.buttonTextStyle}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.accBttn, appStyles.shadow]}
              activeOpacity={0.5}
              onPress={handleCreateAccButton}
            >
              <Text style={styles.buttonTextStyle}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default RegisterScreenPersonal;

const styles = StyleSheet.create({
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
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "black",
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "IBMPlexSans-Medium",
  },
  inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
  goBack: {
    marginTop: 20,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E2E2E2",
    width: "35%",
    alignItems: "center",
  },
  accBttn: {
    marginTop: 20,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFC60A",
    width: "40%",
    alignItems: "center",
  },
});
