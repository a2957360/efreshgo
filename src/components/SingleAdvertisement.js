import React from "react";

import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

//package
//import AutoHeightImage from 'react-native-auto-height-image';
// import Image from "react-native-auto-scale-image";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  setRecipeNavigationParams,
  setRecipeDetailNavigationParams,
} from "../actions/recipe";

//config
import { screenWidth } from "../config/settings";

//styles
import { Colors } from "../styles";

export default function SingleAdvertisement(props) {
  const { data } = props;
  const languageCode = useSelector((state) => state.accountData.language);
  const navigation = useNavigation();
  const dispatch = useDispatch();

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

  return (
    <View style={styles.container}>
      {data &&
        data[languageCode].map((element, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            onPress={() => handlePress(element)}
          >
            <Image style={styles.image} source={{ uri: element.uri }} />
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: 8,
  },
  image: {
    width: screenWidth,
    height: 150,
    resizeMode: "stretch",
  },
});
