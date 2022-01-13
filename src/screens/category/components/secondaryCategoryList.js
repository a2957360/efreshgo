//react
import React, { useState, useEffect } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSecondaryCategory } from "../../../actions/product";

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

//config
import { screenWidth } from "../../../config/settings";

//style
import { Colors } from "../../../styles";

//component
import EmptyCart from "../../cart/components/EmptyCart";

export default function SecondaryCategoryList(props) {
  const dispatch = useDispatch();
  const { data } = props;

  const navigation = useNavigation();

  //console.log(2234, data);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(setSelectedSecondaryCategory(item));
          navigation.navigate("ProductList", {
            id: item.id,
            title: item.text,
            itemData: item,
          });
        }}
        activeOpacity={1}
        key={index}
        style={{
          flex: 1,
        }}
      >
        <View style={styles.itemCardContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: item.categoryImages }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {/* {item.text} */}
              {item.categoryTitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={data}
        numColumns={3}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyCart emptyMessage={"This is empty!"} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginBottom: 0,
  },
  itemCardContainer: {
    // flex: 1,
    marginVertical: 10,
    marginHorizontal: 5,
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor:'red',
    width: screenWidth * 0.2,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: screenWidth * 0.18,
    height: screenWidth * 0.18,
  },
  titleContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 14,
    textAlign: "center",
  },
  priceContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
