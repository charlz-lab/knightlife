import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Pressable,
  FlatList,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { ScrollView } from "react-native-virtualized-view"
import { Card, Icon } from "react-native-elements"
import appStyles from "../styles"
import Modal from "react-native-modal"
import Ionicon from "react-native-vector-icons/FontAwesome"
import UpdateList from "../components/UpdateList"
import AnnouncementsPost from "../components/AnnouncementsPost"
import {
  getEventStatus,
  addEventStatus,
  deleteEventStatus,
  updateEventStatus,
  subscribeToAnnouncements,
} from "../lib/utils"
import supabase from "../lib/supabase"

const EventPage = ({ route, navigation }) => {
  const { event } = route.params
  const [eventData, setEventData] = useState(event)
  const [announcements, setAnnouncements] = useState([])
  useEffect(() => {
    handleAnnouncementList()
  }, [])
  const handleAnnouncementList = async (setAnnouncements) => {
    // get user ID from the logged in user

    // fetch events created by the user
    const announcementData = await fetchAnnouncements()
    setAnnouncements(announcementData)

    // subscribe to events for real-time updates
    const subscription = subscribeToAnnouncements(setAnnouncements)

    // unsubscribe from the event subscription when the component is unmounted
    return () => {
      subscription.unsubscribe()
    }
  }
  //fetch announcements in the event_updates table

  const handleBack = () => {
    navigation.goBack()
  }

  // check if the current user is the creator of the event
  const [isCreator, setIsCreator] = useState(false)
  const checkCreator = async (setIsCreator) => {
    // get the logged in user's id
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setIsCreator(user?.id === event.creator_id)
  }
  useEffect(() => {
    checkCreator(setIsCreator)
  }, [])

  // get the event status for the logged in user
  const [status, setStatus] = useState("")
  useEffect(() => {
    getEventStatus(setStatus, event.id)
  }, [])

  // function to toggle the attending status
  const handleAttendToggle = () => {
    if (status == "attending") {
      // if the user was previously attending the event, remove the status
      setStatus("")
      deleteEventStatus(event.id)
    } else if (status == "saved") {
      // if the user previously bookmarked the event, update the status to attending
      setStatus("attending")
      updateEventStatus(event.id, "attending")
    } else {
      // if the user did not have a previous status, add the status to the database
      setStatus("attending")
      addEventStatus(event.id, "attending")
    }
  }
  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("event_updates")
      .select("*")
      .eq("event_id", event.id)

    if (error) {
      console.error(error)
      return
    }

    setAnnouncements(data)
  }
  //report modal usestate
  const [isModalReportVisible, setModalReportVisible] = useState(false)
  // info modal usestate
  const [isInfoModalVisible, setInfoModalVisible] = useState(false)
  //toggle showing modal
  const toggleReportModal = () => {
    setModalReportVisible(!isModalReportVisible)
  }
  // toggle info modal
  const toggleInfoModal = () => {
    setInfoModalVisible(!isInfoModalVisible)
  }

  useFocusEffect(
    React.useCallback(() => {
      const fetchEvent = async () => {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", event.id)
          .single()

        if (data) {
          setEventData(data)
        } else {
          console.error(error)
        }
      }

      fetchEvent()
    }, [event.id])
  )
  const handleEventUpdate = (updatedEvent) => {
    setEventData(updatedEvent)
  }
  //edit
  return (
    <ScrollView style={styles.container}>
      <View>
        <Image source={{ uri: event.image }} style={styles.image} />
        {/* close page button with icon*/}
        <TouchableOpacity onPress={handleBack} style={styles.closeButton}>
          <Icon
            name="close"
            type="ionicon"
            size={25}
            color="white"
            style={styles.close}
          />
        </TouchableOpacity>
        {isCreator ? (
          <Pressable
            onPress={() =>
              navigation.navigate("EditEvents", {
                event: eventData,
              })
            }
            style={styles.editButton}>
            {/* Your UI component for editing event */}
            <Image
              source={require("../assets/icons/fi-br-edit.png")}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </Pressable>
        ) : (
          /* report button with icon */
          <TouchableOpacity
            onPress={toggleReportModal}
            style={styles.reportButton}>
            <Icon
              name="alert-circle-outline"
              type="ionicon"
              size={25}
              color="#FFC60A"
              style={styles.report}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.dateTime}>
          {new Date(event.date).toLocaleString()}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={[styles.name, { flex: 1 }]}>{event.name}</Text>
          {/* edit event need to make it so only creator accounts have it description.*/}
        </View>
        <Text style={styles.creator}>{event.creator_name}</Text>
        {/* location pin icon*/}
        <View style={styles.locationContainer}>
          <Icon
            name="location-sharp"
            type="ionicon"
            size={13}
            color="#676464"
            style={styles.locationIcon}
          />
          <Text style={styles.locationText}>{event.location}</Text>
          {event.room_number !== "" ? (
            <Text style={styles.locationText}> - {event.room_number}</Text>
          ) : null}
        </View>

        <Pressable onPress={() => navigation.navigate("MembersGoing")}>
          <Text style={styles.membersGoing}>
            {event.membersGoing} Members Going{" "}
          </Text>
        </Pressable>


        {/* description card */}
        {/* <View style={styles.toggleContainer}> */}
        <Card borderRadius={12} style={[styles.shadow, styles.card]}>
          <Text style={{ fontFamily: "IBMPlexSans-Medium" }}>
            {event.description}
          </Text>
        </Card>

        {/* </View> */}
      </View>
      {isCreator ? (
        ""
      ) : (
        // only show the buttons if the user is not the creator of the event
        <View style={styles.buttonContainer}>
          {/* toggle attending button if isAttending true or false */}
          <Pressable
            onPress={handleAttendToggle}
            style={
              status == "attending"
                ? styles.attendingButton
                : styles.attendButton
            }>
            {status == "attending" ? (
              <Ionicon name="bookmark" size={25} color="#FFC60A" />
            ) : (
              <Ionicon name="bookmark-o" size={25} color="#080808" />
            )}

            <Text style={[styles.attendButtonText]}>
              {status == "attending" ? "Attending" : "Attend"}
            </Text>
          </Pressable>
        </View>
      )}
      {event.link !== ""
        ? (console.log(event.link),
          (
            <>
              <View style={styles.signUpContainer}>
                <View style={{ flexDirection: "row", columnGap: 10 }}>
                  <Text style={appStyles.fonts.paragraph}>Sign up link:</Text>
                  <TouchableOpacity onPress={toggleInfoModal}>
                    <Image
                      source={require("../assets/icons/infoIcon.png")}
                      style={{ marginTop: 1, width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  style={[
                    { textDecorationLine: "underline" },
                    appStyles.fonts.paragraph,
                  ]}>
                  {event.link}
                </Text>
              </View>
            </>
          ))
        : null}
      <Text style={[styles.updateTitle, appStyles.fonts.subHeadingNoSize]}>
        Announcements:
      </Text>

      {/* AnnouncementPost only for creators */}
      <View style={styles.anouncementPostContainer}>
        {isCreator && (
          <AnnouncementsPost
            fetchAnnouncements={fetchAnnouncements}
            event={event}
          />
        )}
      </View>

      <View style={styles.updateEventListContainer}>

        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            let formattedDate = ""
            if (item.timestamp) {
              const date = new Date(item.timestamp)
              formattedDate = date.toLocaleDateString() // Format the date
            }

            return (
              <Card borderRadius={12} style={[styles.shadow, styles.card]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={[appStyles.fonts.paragraph, { marginBottom: 10 }]}>{event.creator_name}</Text>

                  {item.timestamp && <Text styles={appStyles.fonts.paragraph}>{formattedDate}</Text>}

                </View>
                <Text>{item.update_text}</Text>
              </Card>
            )
          }}
        />
      </View>

      {/* modal for report button gear */}
      <Modal
        isVisible={isModalReportVisible}
        onBackdropPress={toggleReportModal}
        style={styles.modal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Report Event</Text>
          <Text style={styles.modalAlert}>
            Your safety is important to us. Our team works hard to monitor any
            suspicious behavior on our app. Please submit this report if an
            event is seen to be suspicious or unreliable. Your report will
            remain anonymous.
          </Text>
          <View style={styles.modalOptionsContainer}>
            <TouchableOpacity
              onPress={toggleReportModal}
              style={[styles.modalOption, styles.modalOption1]}>
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleReportModal}
              style={[styles.modalOption, styles.modalOption2]}>
              <Text style={styles.modalOptionText}>Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isModalReportVisible}
        onBackdropPress={toggleReportModal}
        style={styles.modal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Report Submitted!</Text>
          <Text style={styles.modalAlert}>
            Thank you for expressing your concern. The KnightLife team will be
            reviewing the report shortly.{" "}
          </Text>
          <View style={styles.modalOptionsContainer}>
            <TouchableOpacity
              onPress={toggleReportModal}
              style={[styles.modalReportOption, styles.modalOption1]}>
              <Text style={styles.modalOptionText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* modal for info button */}
      <Modal
        isVisible={isInfoModalVisible}
        onBackdropPress={toggleInfoModal}
        style={styles.modal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Disclaimer</Text>
          <Text style={styles.modalAlert}>
            Choosing to attend an event is not the same as signing up for the
            event itself. Please use the sign up link to sign up for this event
            externally.
          </Text>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: 350,
    resizeMode: "cover", // Adjust the resizeMode as needed
    backgroundColor: "#E2E2E2",
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    backgroundColor: "#fff",
  },
  reportButton: {
    position: "absolute",
    top: 300,
    right: 10,
    padding: 8,
    backgroundColor: "#080808",
    borderRadius: 8,
  },
  editButton: {
    position: "absolute",
    top: 300,
    right: 10,
    padding: 8,
    backgroundColor: "#FFC60A",
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    fontFamily: "Prompt-Bold",
  },
  creator: {
    fontSize: 20,
    marginTop: 5,
    fontFamily: "IBMPlexSans-Medium",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    left: 16,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
  },
  dateTime: {
    position: "absolute",
    top: 60,
    right: 16,
    padding: 8,
    backgroundColor: "#080808",
    color: "#FFC60A",
    borderRadius: 12,
    fontSize: 15,
  },
  locationContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  locationIcon: {
    marginRight: 3,
  },
  locationText: {
    fontSize: 13,
    color: "#676464",
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  card: {
    paddingTop: 10,
  },
  membersGoing: {
    color: "#676464",
    fontSize: 12,
    fontFamily: "IBMPlexSans-Regular",
    marginTop: 15,
    textDecorationLine: "underline",
    paddingBottom: 10,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    paddingrRight: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "IBMPlexSans-Medium",
    fontSize: 20,
  },
  modalAlert: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    alignItems: "center",
    marginBottom: 10,
    textAlign: "center",
  },
  modalOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 12,
  },
  modalOption: {
    flex: 1,
    padding: 8,
    marginHorizontal: 6,

    padding: 8,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
  },
  modalOptionText: {
    color: "#fff", //
  },

  modalOption1: {
    backgroundColor: "#080808",
    paddingTop: 10,
  },
  modalOption2: {
    backgroundColor: "#FF460C",
  },
  modalReportOption: {
    flex: 1,
    padding: 8,
    marginHorizontal: 55,
    width: 10,
    padding: 8,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
  },
  buttonContainer: {
    flexDirection: "row",
    height: 65,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    margin: 1,
  },
  attendButton: {
    width: "70%",
    borderRadius: 30,
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC60A",
    borderColor: "#FFC60A",
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  attendingButton: {
    backgroundColor: "#FDF5E6",
    borderColor: "#FFC60A",
    borderWidth: 2,
    width: "70%",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  attendButtonText: {
    color: "#080808",
    fontFamily: "IBMPlexSans-Medium",
    fontSize: 16,
  },
  toggleContainer: {
    // Add any styles for the toggle container here
  },
  anouncementPostContainer: {
    justifyContent: "center",
    backgroundColor: "white",
    paddingBottom: 20,
    marginBottom: 5,
    borderRadius: 30,
  },

  updateEventListContainer: {
    // Add any styles for the update event list container here
    justifyContent: "center",
    backgroundColor: "white",
    paddingBottom: 20,
    marginBottom: 30,
    borderRadius: 30,
  },
  updateTitle: {
    backgroundColor: "white",
    fontSize: 20,
    color: "#080808",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  signUpContainer: {
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
})

export default EventPage
