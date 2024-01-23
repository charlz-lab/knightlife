import React from "react"
import { StyleSheet, Text, View, StatusBar } from "react-native"

const HOME = () => {
  // insert code here
  return (
    <View style={styles.container}>
      <Text>Home page</Text>
      <StatusBar style="auto" />
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

})
export default Home;
