import React from "react"
import { StatusBar } from "expo-status-bar"
import { useFonts } from "expo-font"
import {
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  View,
  Pressable,
  Image,
} from "react-native"
import { SearchBar } from "@rneui/themed"
import Modal from "react-native-modal"
import appStyles from "../styles"
import filterIcon from "../assets/icons/fi-filter.png"
import EventCard from "../components/EventCard"
import EventList from "../components/EventList"
import FilterSection from "../components/FilterSection"

const HOME = ({ navigation }) => {
  // list events
  const [events, setEvents] = React.useState([])
  const addEvent = (newEvent) => {
    // Update the events state with the new event
    setEvents((prevEvents) => [...prevEvents, newEvent])
  }

  // enable filter modal
  const [isModalVisible, setModalVisible] = React.useState(false)
  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter & search section */}
      <View
        style={[
          appStyles.layout.horizontal,
          { paddingHorizontal: 10, width: "100%" },
        ]}>
        <SearchBar
          platform="ios"
          containerStyle={{
            borderRadius: 100,
            borderWidth: 0,
            flex: 3,
          }}
          inputContainerStyle={{
            borderWidth: 0,
            borderRadius: 100,
          }}
        />
        {/* note: "pressable" is more customizable than "button" */}
        <Pressable
          onPress={toggleModal}
          style={{ flex: 0.5, alignItems: "center" }}>
          <Image source={filterIcon} style={{ height: 24, width: 24 }} />
        </Pressable>
      </View>
      {/* List of event cards */}
      <View>
        <EventList events={events} navigation={navigation} />
      </View>
      {/* Filter modal */}
      <Modal
        isVisible={isModalVisible}
        animationInTiming={300}
        animationOutTiming={300}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={400}
        onBackdropPress={toggleModal}
        hideModalContentWhileAnimating={true}
        style={styles.modal}>
        <View style={styles.modalCard}>
          <View style={appStyles.layout.horizontal}>
            <View style={appStyles.layout.horizontal}>
              <Image source={filterIcon} style={{ height: 24, width: 24 }} />
              <Text style={appStyles.fonts.subHeading}>Filter</Text>
            </View>
            <Pressable onPress={toggleModal}>
              <Text>Close</Text>
            </Pressable>
          </View>
          <ScrollView>
            <FilterSection
              title="Campus Location"
              options={["Main Campus", "Downtown", "Rosen", "Cocoa"]}
            />
            <FilterSection
              title="Event Category"
              options={[
                "Academic",
                "Arts",
                "Career",
                "Entertainment",
                "Recreation",
                "Social",
                "Sports",
                "Volunteer",
                "Other",
              ]}
            />
          </ScrollView>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    backgroundColor: appStyles.colors.background,
    alignItems: "center",
  },
  modal: {
    margin: 0,
    padding: 0,
    justifyContent: "flex-end",
  },
  modalCard: {
    padding: 40,
    backgroundColor: appStyles.colors.background,
    borderRadius: 25,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    width: "100%",
    maxHeight: "70%",
    gap: 30,
  },
})
export default HOME
