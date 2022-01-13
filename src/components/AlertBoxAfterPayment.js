import React from "react";

import { StyleSheet, View, ActivityIndicator } from "react-native";

//packages
import { Overlay } from "react-native-elements";


export default function LoadingSpinner(props) {
  return (
    <View style={styles.container}>
      <Overlay
        isVisible={props.isVisible === undefined ? true : props.isVisible}
        backdropStyle={{ backgroundColor: "transparent" }}
        overlayStyle={styles.spinnerContainer}
      >
        <Text>test this</Text>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    width: 90,
    height: 90,
    backgroundColor: "grey",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
