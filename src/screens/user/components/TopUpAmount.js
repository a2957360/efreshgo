import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";

//const
import { screenHeight, screenWidth } from "../../../config/settings";

//styles
import { Colors } from "../../../styles";
import Spacing from "../../../components/Spacing";

//package
import i18n from "i18n-js";

export default function TopUpAmount() {
  const [input, setInput] = useState();
  return (
    <TouchableOpacity onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      {/* title */}
      <View style={styles.title}>
        <Text style={styles.titleText}>{i18n.t("Amount")}</Text>
      </View>

      <Spacing height="extraSmall" />

      {/* Amount Input Box */}
      <View style={styles.amountTitleContainer}>
        <TextInput
          style={styles.inputBox}
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="$100"
          keyboardType={"numeric"}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => console.log("123321")}
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{i18n.t("Top Up")}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  amountTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: screenWidth * 0.04,
  },
  inputBox: {
    height: 30,
    width: screenHeight * 0.25,
    borderColor: Colors.midGrey,
    borderWidth: 2,
    borderRadius: 20,
    paddingLeft: 15,
  },
  buttonContainer: {
    height: 30,
    width: screenHeight * 0.1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  title: {
    flex: 1,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: screenWidth * 0.04,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.white,
  },
});
