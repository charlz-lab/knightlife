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
import Modal from "react-native-modal"
import appStyles from "../styles"
import filterIcon from "../assets/icons/fi-filter.png"
import EventCard from "../components/EventCard"
import EventList from "../components/EventList"
import FilterSection from "../components/FilterSection"
import SearchBar from "../components/SearchBar"
import SavedEventList from "../components/SavedEventList"
import AttendingEventList from "../components/AttendingEventList"
import supabase from "../lib/supabase"
import { handleEventList } from "../lib/utils"

const HOME = ({ navigation }) => {
  // list events
  const [users, setUsers] = React.useState([])
  const [events, setEvents] = React.useState([])

  // fetch events from database
  React.useEffect(() => {
    handleEventList(setEvents)
  }, [])

  // enable filter modal
  const [isModalVisible, setModalVisible] = React.useState(false)
  const toggleModal = async () => {
    let { data, error } = await supabase.from("users").select("*").limit(20)

    if (error) console.log("Error: ", error)
    else setUsers(data)

    setModalVisible(!isModalVisible)
  }

  const handleSearch = (searchText) => {
    // Implement your search logic using searchText
    console.log("Search Text:", searchText)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter & search section */}
      <View
        style={[
          appStyles.layout.horizontal,
          { paddingHorizontal: 10, width: "100%" },
        ]}>
        <SearchBar onSearch={handleSearch} />
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
          {/* modal header section */}
          <View style={appStyles.layout.horizontal}>
            <View style={appStyles.layout.horizontal}>
              <Image source={filterIcon} style={{ height: 24, width: 24 }} />
              <Text style={appStyles.fonts.subHeading}>Filter</Text>
            </View>
            <Pressable onPress={toggleModal}>
              <Text>Close</Text>
            </Pressable>
          </View>
          {/* list of options */}
          <FilterSection
            title="Accounts Displayed"
            tags={["Followed Accounts only"]}
          />
          <FilterSection
            title="Campus Location"
            tags={["Main Campus", "Downtown", "Rosen", "Cocoa"]}
          />
          <FilterSection
            title="Event Category"
            tags={[
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
    maxHeight: "80%",
    gap: 5,
  },
})
export default HOME
