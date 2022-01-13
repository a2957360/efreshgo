import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

//react navigation
import { useNavigation } from "@react-navigation/native";

//style
import { Colors } from "../../styles";

//package
import { MaterialIcons } from "@expo/vector-icons";
import i18n from "i18n-js";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getContactUs } from "../../actions/contactUs";

//component
import ListItem from "../../components/ListItem";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Contact() {
  const dispatch = useDispatch();

  const userDataRedux = useSelector((state) => state.accountData.userInfo);

  const getContactUsResultData = useSelector(
    (state) => state.contactUsData.getContactUsResultData
  );

  useEffect(() => {
    const data = {
      isGet: "1",
      userNumber: userDataRedux.userNumber,
    };
    dispatch(getContactUs(data));
  }, []);

  if (getContactUsResultData == "") {
    getContactUsResultData[0];
    return <LoadingSpinner />;
  } else {
    return (
      <View style={styles.cardContainer}>
        <ListItem
          title={i18n.t("Hotline")}
          data={getContactUsResultData[0].infoContent}
        />

        <ListItem
          title={i18n.t("Address")}
          data={getContactUsResultData[1].infoContent}
          lastItem={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
    backgroundColor: Colors.white,
  },
  titleContainer: {
    flexDirection: "row",
    paddingVertical: 18,
    borderBottomColor: Colors.midGrey,
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomColor: Colors.midGrey,
    borderBottomWidth: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 25,
  },
});
