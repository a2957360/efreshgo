import { useNavigation } from "@react-navigation/native";
import React from "react";

import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

//components
import Spacing from "../../../components/Spacing";

//config
import { screenHeight, screenWidth } from "../../../config/settings";

//styles
import { Colors } from "../../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  setRecipeNavigationParams,
  setRecipeDetailNavigationParams,
} from "../../../actions/recipe";

export default function DoubleAdvertisement(props) {
  const { data } = props;

  //langauge code
  const languageCode = useSelector((state) => state.accountData.language);

  const navigation = useNavigation();

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
    <View style={styles.advertisementContainer}>
      <Spacing height="medium" />

      <View style={styles.container}>
        {data &&
          data[languageCode] &&
          data[languageCode].map((element, index) => (
            <View key={index} style={styles.imageContainer}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => handlePress(element)}
              >
                <Image style={styles.image} source={{ uri: element.uri }} />

                <Spacing width="medium" />
              </TouchableOpacity>
            </View>
          ))}
      </View>
      <Spacing width="medium" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  advertisementContainer: {
    height: screenHeight * 0.2,
  },
  imageContainer: {
    height: "100%",
    width: "50%",
  },
});

//  {
//    data &&
//      data.map((element) => (
//        <>
//          <Image style={styles.image} source={{ uri: element.uri }} />

//          <Spacing width="medium" />
//        </>
//      ));
//  }
