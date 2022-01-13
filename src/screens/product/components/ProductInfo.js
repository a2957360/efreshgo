//react
import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native
import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

//packages
import { TabView, TabBar } from "react-native-tab-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";

//config
//import { productList } from "../../../config/data";

//style
import { Colors } from "../../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  //getFavoriteProduct,
  removeFavoriteProduct,
} from "../../../actions/product";

export default function ProductInfo(props) {
  const dispatch = useDispatch();
  const { title, subTitle, tags, itemNumber, isSavedFavorite } = props;
  const [redHeartShown, setRedHeartShown] = useState();

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const savedItemNumber = useSelector(
    (state) => state.productData.savedItemNumber
  );

  useEffect(() => {
    setRedHeartShown(savedItemNumber ? true : false);
  }, []);

  const addItemToFavorite = () => {
    //添加收藏
    if (!redHeartShown) {
      const data = {
        savedItemType: "0",
        userNumber: userNumber,
        itemNumber: itemNumber,
      };
      setRedHeartShown(true);
      dispatch(addFavorite(data));
    }
    //取消收藏，弹窗提醒是否确认要取消收藏
    else {
      const data = {
        isDelete: "1",
        savedItemNumber: [isSavedFavorite],
        itemNumber: itemNumber,
        userNumber: userNumber,
      };

      Alert.alert(i18n.t("Warning"), i18n.t("removeFavoriteMessage"), [
        {
          text: i18n.t("Cancel"),
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        {
          text: i18n.t("Confirm"),
          onPress: () => {
            setRedHeartShown(false);
            //setIsSavedFavorite();
            dispatch(removeFavoriteProduct(data));
          },
          style: "ok",
        },
      ]);
    }
  };

  //item tag
  const renderTag = ({ item, index }) => {
    return (
      <View style={styles.tagContainer}>
        <Text style={styles.tag}>{item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <View style={{ flex: 0.9 }}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          </View>

          {/* add to favorite */}
          <TouchableOpacity
            onPress={() => addItemToFavorite()}
            style={styles.addToFavoriteContainer}
          >
            {redHeartShown ? (
              <MaterialCommunityIcons name="heart" size={25} color="red" />
            ) : (
              <MaterialCommunityIcons
                name="heart"
                size={25}
                color={Colors.primary}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* 商品小标签 */}
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={tags}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderTag}
        />

        {/* 商品描述 */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description} numberOfLines={2}>
            {subTitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleContainer: {
    marginTop: 5,
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "bold",
  },
  image: {
    width: 25,
    height: 25,
  },
  tagContainer: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 25,
    marginVertical: 10,
    marginRight: 10,
  },
  tag: {
    color: Colors.primary,
    fontSize: 14,
  },
  descriptionContainer: {
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
  },
  addToFavoriteContainer: { flex: 0.1, marginLeft: 20 },
});

//  <Image
//                 style={styles.image}
//                 source={require("../../../assets/product/heart.png")}
//                 resizeMode="contain"
//               />
