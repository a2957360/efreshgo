//react
import React, { useState, useEffect } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native
import { StyleSheet, Text, View } from "react-native";

//config
import { productList } from "../../../config/data";

//style
import { Colors } from "../../../styles";

export default function ReciptInfo({ title, subTitle }) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <View style={{ flex: 0.9 }}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          </View>
        </View>

        {/* 菜谱描述 */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{subTitle}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleContainer: {
    marginTop: 5,
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "bold",
  },
  image: {
    width: 25,
    height: 25,
  },
  tagContainer: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 25,
    marginVertical: 10,
    marginRight: 10,
  },
  tag: {
    color: Colors.primary,
    fontSize: 14,
  },
  descriptionContainer: {
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    //paddingVertical: 20,
  },
});
