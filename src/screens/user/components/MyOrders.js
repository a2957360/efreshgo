import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

//package
import i18n from "i18n-js";

//style
import { Colors } from "../../../styles";

//config
import { screenHeight, screenWidth } from "../../../config/settings";

const orderMenu = [
  {
    image: require("../../../assets/user/wallet.png"),
    text: "Unpay",
    state: "0",
  },
  {
    image: require("../../../assets/user/package.png"),
    text: "Unship",
    state: "wait",
  },
  {
    image: require("../../../assets/user/shipping.png"),
    text: "Undeliver",
    state: "6",
  },
  {
    image: require("../../../assets/user/comment.png"),
    text: "Uncomment",
    state: "7",
  },
];

export default function MyOrders(props) {
  const navigation = useNavigation();
  const { orderTotal } = props;

  if (!orderTotal) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{i18n.t("OrderDetail")}</Text>
          {/* 全部订单 */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate("OrderDetail", {
                state: " ",
                stateText: "All Orders",
              })
            }
          >
            <Text style={styles.allOrderText}>{i18n.t("All Orders")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          {orderMenu.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{ width: 70, height: 60 }}
                activeOpacity={1}
                onPress={() =>
                  navigation.navigate("OrderDetail", {
                    state: item.state,
                    stateText: item.text,
                  })
                }
              >
                <View style={styles.orderButtonContainer}>
                  <Image
                    style={styles.image}
                    source={item.image}
                    resizeMode="contain"
                  />
                  <Text style={styles.text}>{i18n.t(item.text)}</Text>
                  {/* total number of orders */}
                  <View style={styles.totalNumberOrderContainer}>
                    <Text style={{ color: Colors.white, fontSize: 10 }}>
                      {orderTotal[item.state] < 99
                        ? orderTotal[item.state]
                        : 99 + "+"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.9,
    marginTop: screenHeight * 0.05 + 11,
    borderRadius: 10,
    backgroundColor: Colors.white,
    padding: 15,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  allOrderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.darkGrey,
  },
  more: {
    fontSize: 14,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 5,
  },
  image: {
    height: 28,
    width: 28,
  },
  text: {
    marginTop: 10,
    fontSize: 12,
  },
  orderButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  totalNumberOrderContainer: {
    height: 20,
    width: 20,
    position: "absolute",
    top: -5,
    right: 5,
    borderRadius: 10,
    borderColor: Colors.red,
    borderWidth: 1,
    backgroundColor: Colors.red,
    justifyContent: "center",
    alignItems: "center",
  },
});
