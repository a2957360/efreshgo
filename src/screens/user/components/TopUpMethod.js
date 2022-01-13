import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

//redux
import { useDispatch, useSelector } from "react-redux";

//const
import { screenHeight, screenWidth } from "../../../config/settings";

//styles
import { Ionicons } from "@expo/vector-icons";
import Spacing from "../../../components/Spacing";

//react navigation
import { useNavigation } from "@react-navigation/native";

//package
import i18n from "i18n-js";

export default function TopUpMethod({ toggleOverlay, creditCardSelected }) {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const selectedPayMethod = useSelector((state) => state.paymentData.method);
  const creditCardNumber = useSelector(
    (state) => state.paymentData.creditCardNumber
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Method Title */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => toggleOverlay()}
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View style={styles.topUpMethod}>
          <Text style={styles.title}>{i18n.t("TopUp Method")}</Text>
          {!selectedPayMethod ? (
            <Ionicons
              style={{ alignSelf: "center" }}
              name="ios-arrow-forward"
              size={24}
              color="black"
            />
          ) : (
            <Text style={styles.name}>
              {selectedPayMethod == "CreditCard"
                ? i18n.t(selectedPayMethod) + creditCardSelected
                : i18n.t(selectedPayMethod)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topUpMethod: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: screenWidth * 0.04,
  },
  creditCardContainer: {
    flex: 0.44,
    paddingHorizontal: screenWidth * 0.04,
    flexDirection: "row",
    //justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
  cardNumber: {
    fontSize: 14,
  },

  name: {
    fontSize: 14,
    alignSelf: "center",
    paddingHorizontal: 15,
  },
  image: {
    height: 30,
    width: 45,
    resizeMode: "contain",
  },
  logo: {
    height: 60,
    width: 25,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
