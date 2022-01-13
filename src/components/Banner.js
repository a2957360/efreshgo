import React from "react";

//react native components
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Spacing from "./Spacing";

//packages
import Swiper from "react-native-swiper";

//config
import { screenHeight, screenWidth } from "../config/settings";

//styles
import { Colors } from "../styles";

export default function Banner(props) {
  const { data, resizeMode } = props;

  return (
    <View style={styles.swiperContainer}>
      <Swiper
        autoplay
        dotColor={Colors.white}
        activeDotColor={Colors.primary}
        paginationStyle={{ bottom: "5%" }}
      >
        {data
          ? data.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1}
                  style={{ paddingHorizontal: 5 }}
                >
                  <Image
                    style={styles.imageStyle}
                    source={{ uri: item }}
                    //defaultSource={require("../assets/loading/default.png")}
                  />
                </TouchableOpacity>
              );
            })
          : null}
      </Swiper>
      <Spacing height="medium" />
    </View>
  );
}

const styles = StyleSheet.create({
  swiperContainer: {
    height: screenHeight * 0.3,
  },
  imageStyle: {
    width: "100%",
    height: screenHeight * 0.3,
    borderRadius: 5,
    resizeMode: "cover",
  },
});
