import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";

//package
import i18n from "i18n-js";

//style
import { Colors } from "../../../styles";

//config
import { screenHeight, screenWidth } from "../../../config/settings";

export default function AccountSummary(props) {
  const { credit, point } = props.data;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("Balance", { credit: credit })}
        > */}
        <Text
          style={{
            fontSize: 25,
            color: Colors.black,
            alignSelf: "center",
          }}
        >
          {credit}
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: Colors.primary,
            fontWeight: "bold",
            marginBottom: 5,
          }}
        >
          {i18n.t("Balance")}
        </Text>
        {/* </TouchableOpacity> */}
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 25,
            color: Colors.black,
            alignSelf: "center",
          }}
        >
          {point}
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: Colors.primary,
            fontWeight: "bold",
            marginBottom: 5,
          }}
        >
          {i18n.t("Points")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: screenWidth * 0.9,
    height: screenHeight * 0.1,
    marginTop: screenHeight * 0.03,
    borderRadius: 10,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});
