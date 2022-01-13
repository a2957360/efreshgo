import React from "react";

//react native components
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Spacing from "./Spacing";

//packages
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";

//config
import { screenHeight, screenWidth } from "../config/settings";

//styles
import { Colors } from "../styles";

//components
import LoadingScreen from "../components/LoadingScreen";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  setRecipeNavigationParams,
  setRecipeDetailNavigationParams,
} from "../actions/recipe";

export default function Banner(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data, resizeMode } = props;

  //langauge code
  const languageCode = useSelector((state) => state.accountData.language);

  const handlePress = (item) => {
    if (item.target == "productMain") {
      navigation.navigate("CategoryStack", {
        targetCategoryNumber: item.categoryNumber,
      });
    } else if (item.target == "productSub") {
      navigation.navigate("ProductList", {
        targetCategoryNumber: item.categoryNumber,
      });
    } else if (item.target == "recipeCat") {
      navigation.navigate("Recipe");
      dispatch(setRecipeNavigationParams(item.categoryNumber));
    } else if (item.target == "recipe") {
      navigation.navigate("RecipeDetail");
      dispatch(setRecipeDetailNavigationParams(item.categoryNumber));
    } else if (item.target == "product") {
      navigation.navigate("ProductDetail", {
        targetItemNumber: item.itemNumber,
      });
    }
  };

  if (!data) {
    if (loading === true) {
      return <LoadingScreen />;
    }
  } else {
    return (
      <View style={styles.swiperContainer}>
        <Swiper
          autoplay
          dotColor={Colors.white}
          activeDotColor={Colors.primary}
          paginationStyle={{ bottom: "5%" }}
        >
          {data
            ? data[languageCode].map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => handlePress(item)}
                    key={index}
                    activeOpacity={1}
                  >
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 5,
                        resizeMode: "stretch",
                      }}
                      source={{ uri: item.uri }}
                      //resizeMode={resizeMode}
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
}

const styles = StyleSheet.create({
  swiperContainer: {
    height: screenHeight * 0.25,
  },
});
