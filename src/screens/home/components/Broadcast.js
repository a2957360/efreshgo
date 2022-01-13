import React from "react";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Spacing from "../../../components/Spacing";

//package
import { AntDesign } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";

//styles
import { Colors } from "../../../styles";
import { screenHeight, screenWidth } from "../../../config/settings";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  setRecipeNavigationParams,
  setRecipeDetailNavigationParams,
} from "../../../actions/recipe";

export default function Broadcast(props) {
  const { data } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const languageCode = useSelector((state) => state.accountData.language);

  // console.log('this is data',data)

  const handlePress = (item) => {
    //一级分类
    if (item.target == "productMain") {
      navigation.navigate("CategoryStack", {
        targetCategoryNumber: item.categoryNumber,
      });
    }
    //二级分类
    else if (item.target == "productSub") {
      navigation.navigate("ProductList", {
        targetCategoryNumber: item.categoryNumber,
      });
    }
    //菜谱分类
    else if (item.target == "recipeCat") {
      navigation.navigate("Recipe");
      dispatch(setRecipeNavigationParams(item.categoryNumber));
    }
    //菜谱详情
    else if (item.target == "recipe") {
      navigation.navigate("RecipeDetail");
      dispatch(setRecipeDetailNavigationParams(item.categoryNumber));
    }
    //产品详情
    else if (item.target == "product") {
      navigation.navigate("ProductDetail", {
        targetItemNumber: item.itemNumber,
      });
    }
  };

  return (
    <View style={styles.broadcastContainer}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <AntDesign name="sound" size={30} color={Colors.primary} />
        </View>

        <Swiper
          containerStyle={styles.swiperContainer}
          horizontal={false}
          autoplay
          autoplayTimeout={5}
          showsPagination={false}
        >
          {data &&
            data[languageCode] &&
            data[languageCode].map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={{ flex: 1 }}
                  activeOpacity={1}
                  onPress={() => handlePress(item)}
                >
                  <View style={styles.textContainer}>
                    <Text style={styles.text}>{item.text}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </Swiper>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexDirection: "row",
  },
  broadcastContainer: {
    height: screenHeight * 0.06,
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRightColor: Colors.midGrey,
    borderRightWidth: 1,
  },
  swiperContainer: {
    flex: 5,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
  },
});
