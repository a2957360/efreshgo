import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

//style
import { Colors } from "../../../styles";

//config
import { screenHeight, screenWidth } from "../../../config/settings";

export default function NameCard(props) {
  const { avatar, name, phone } = props.data;

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={
          avatar == ""
            ? require("../../../assets/user/avatarEmpty.png")
            : {
                uri: avatar,
              }
        }
        // source={{uri:"http://efresh.finestudiodemo.com/include/pic/userImages/202012111455351.png",}}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.text}>{name}</Text>
        <Text style={styles.text}>{phone}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: screenHeight * 0.13,
    flexDirection: "row",
    width: screenWidth * 0.9,
    height: screenWidth * 0.2,
  },
  image: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    resizeMode: "cover",
    borderRadius: 50
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 22,
    color: Colors.white,
  },
});
