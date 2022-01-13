import React from "react";

import { StyleSheet, View, ActivityIndicator } from "react-native";

//packages
import { Overlay } from "react-native-elements";

//等待数据加载或提交时的 loading overlay, 用户无法进行任何操作。
//样式： ios为菊花，android为圆圈
export default function LoadingSpinner(props) {
  return (
    <View style={styles.container}>
      <Overlay
        isVisible={props.isVisible === undefined ? true : props.isVisible}
        backdropStyle={{ backgroundColor: "transparent" }}
        overlayStyle={styles.spinnerContainer}
      >
        <ActivityIndicator size="large" color="white" />
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
