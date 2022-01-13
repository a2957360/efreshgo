import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

//config
import { screenWidth, screenHeight } from "../../../config/settings";

//style
import { Colors } from "../../../styles";

//package
import i18n from "i18n-js";

export default function EmptyCart({ emptyMessage }) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.emptyCartImage}
        source={require("../../../assets/cart/emptyCart.png")}
      />
      <Text style={styles.statement}>{i18n.t(emptyMessage)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    alignItems: "center",
  },
  emptyCartImage: {
    marginTop: 0.15 * screenHeight,
    height: screenWidth * 0.33,
    width: screenWidth * 0.33,
    resizeMode: "contain",
  },
  statement: {
    fontSize: 23,
    color: Colors.darkGrey,
    marginTop: 20,
  },
});
