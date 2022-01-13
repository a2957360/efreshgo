import React from "react";
import { StyleSheet, Text, View } from "react-native";

//style
import { Colors } from "react-native/Libraries/NewAppScreen";

import { DeliveryDateList } from "../../../config/data";

//const
import { screenHeight, screenWidth } from "../../../config/settings";

export default function DeliveryDate() {
  const dates = DeliveryDateList.map((item) => {
    return (
      <View key={item.id} style={styles.dateContainer}>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    );
  });
  return <View>{dates}</View>;
}

const styles = StyleSheet.create({
  dateContainer: {
    width: "100%",
    height: screenHeight * 0.07,
    backgroundColor: Colors.darkGrey,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
  },
});
