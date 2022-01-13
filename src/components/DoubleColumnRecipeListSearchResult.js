//react
import React, { useState, useEffect } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

//components
import Spacing from "../components/Spacing";
import LoadingScreen from "../components/LoadingScreen";
import EmptyCart from "../screens/cart/components/EmptyCart";

//packages
import { Ionicons } from "@expo/vector-icons";

//config
import { screenWidth } from "../config/settings";

//style
import { Colors } from "../styles";

export default function DoubleColumnRecipeListSearchResult(props) {
  const { listKey, data } = props;

  const navigation = useNavigation();

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          //navigation.push("RecipeDetail", { id: item.id, title: item.title });
          navigation.push("RecipeDetail", {
            cookBookNumber: item.cookbookNumber,
          });
        }}
        activeOpacity={1}
        key={index}
        style={styles.mainContainer}
      >
        <View style={styles.itemCardContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: item.cookbookImages.length > 0 && item.cookbookImages[0],
              }}
              //source={item.cookbookImages}
            />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {item.cookbookTitle}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
                {item.cookbookSubTitle}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return <Spacing height="medium" />;
  };

  if (!data) {
    return <EmptyCart emptyMessage={"This is empty!"} />;
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          listKey={(item, index) => listKey + index.toString()}
          keyExtractor={(item, index) => index.toString()}
          data={data}
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemCardContainer: {
    flex: 1,
  },
  imageContainer: {},
  image: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.42,
  },
  infoContainer: {
    padding: 10,
  },
  titleContainer: {},
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
  },
  textContainer: {
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 17,
    color: Colors.black,
  },
  mainContainer: {
    width: 0.5 * screenWidth,
    backgroundColor: Colors.white,
  },
});
