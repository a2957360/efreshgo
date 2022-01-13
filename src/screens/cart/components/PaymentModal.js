import React from "react";
import { StyleSheet, Text, View, TouchableOpacity,ScrollView } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../../../styles";
import PaymentMethod from "./PaymentMethod";

//package
import i18n from "i18n-js";

export default function PaymentModal(props) {
  const { togglePaymentOverlay } = props;
  return (
    <ScrollView style={{ flex: 1 }}>
    <View style={{ flex:1}}>
      {/* header */}
      <View style={styles.ModalHeader}>
        <View style={styles.emptySpace}></View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {i18n.t("Select Payment Method")}
          </Text>
        </View>

        {/* cancel button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => togglePaymentOverlay()}
        >
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* payment method list */}
      <View style={{ flex: 0.88 }}>
        <PaymentMethod
          togglePaymentOverlay={togglePaymentOverlay}
          // setCreditCardSelected={setCreditCardSelected}
        />
      </View>
      
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ModalHeader: {
    flex: 0.12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.darkGrey,
  },
  headerContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  headerText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  emptySpace: { flex: 0.2 },
});
