import React from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";

import { screenHeight, screenWidth } from "../../../config/settings";

export default function CouponSection({ type, num }) {
  const url = {
    unusedImgURL: require("../../../assets/user/coupon_unused.png"),
    usedImgURL: require("../../../assets/user/coupon_used.png"),
    expiredImgURL: require("../../../assets/user/coupon_expired.png"),
  };

  const arr = [...Array(num).keys()];

  const ListImages = arr.map((item) => {
    return (
      <Image
        key={item}
        source={url[type]}
        style={{
          height: screenHeight * 0.1,
          width: screenWidth * 0.9,
          resizeMode: "stretch",
          marginVertical: 5,
        }}
      />
    );
  });

  return <View style={styles.container}>{ListImages}</View>;
}

const styles = StyleSheet.create({
  container: {},
});
