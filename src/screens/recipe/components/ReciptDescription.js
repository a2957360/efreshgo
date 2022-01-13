//react
import React, { useState, useEffect } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native
import { StyleSheet, Text, View, Image } from "react-native";

//config
import { productList } from "../../../config/data";

//style
import { Colors } from "../../../styles";

//package
import i18n from "i18n-js";

import { screenWidth, screenHeight } from "../../../config/settings";

export default function ReciptDescription({ description }) {
  //console.log(123, description);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("Description")}</Text>

      {description.length > 0 &&
        description.map((element) =>
          element.type == "text" ? (
            <Text key={element.value} style={styles.description}>
              {element.value}
            </Text>
          ) : (
            <Image
              key={element.value}
              style={{
                width: screenWidth,
                height: 300,
                resizeMode: "stretch",
              }}
              source={{
                uri: element.value,
              }}
            />
          )
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    //lineHeight: 18,
    paddingVertical: 5,
  },
});
