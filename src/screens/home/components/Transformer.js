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
import Spacing from "../../../components/Spacing";
//config
import { screenWidth } from "../../../config/settings";

//style
import { Colors } from "../../../styles";

export default function Transformer(props) {
  const { listKey, data } = props;
  //console.log(997, data);

  const navigation = useNavigation();

  const handlePress = (item) => {
    //产品
    if (item.categoryType == "0") {
      //productList
      if (item.categoryParentId != "") {
        navigation.navigate("ProductList", {
          targetCategoryNumber: item.categoryNumber,
          targetCategoryParentId: item.categoryParentId,
        });
      }
      //一级分类
      else {
        navigation.navigate("CategoryStack", {
          targetCategoryNumber: item.categoryNumber,
        });
      }
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        activeOpacity={1}
        key={index}
        style={{ flex: 1, marginTop: 12 }}
      >
        <View style={{ alignItems: "center" }}>
          <Image style={styles.image} source={{ uri: item.categoryImages }} />

          <View style={styles.textContainer}>
            <Text style={styles.text}>{item.categoryTitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Spacing height="medium" />

      <FlatList
        listKey={(item, index) => listKey + index.toString()}
        keyExtractor={(item, index) => `transformer_${index.toString()}`}
        style={styles.transformerContainer}
        data={data}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        numColumns={4}
        renderItem={renderItem}
      />
      {/* custom spacing */}
      {/* <View
        style={{
          marginTop: 12,
          backgroundColor: Colors.midGrey,
          height: 8,
          width: screenWidth,
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    //backgroundColor: "yellow",
    paddingHorizontal: 2,
    paddingBottom: 12,
  },
  transformerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  image: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    resizeMode: "contain",
  },
  textContainer: {
    paddingTop: 5,
  },
  text: {
    fontSize: 12,
  },
});

// navigation.navigate("Category", {
//               categoryParentId: item.categoryParentId,
//               title: item.text,
//             })
