//react
import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native
import { StyleSheet, Text, View } from "react-native";

//components
import SingleColumnItemList from "../../components/SingleColumnItemList";
import Spacing from "../../components/Spacing";
import LoadingSpinner from "../../components/LoadingSpinner";

//package
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

//config
import { productList } from "../../config/data";

//style
import { Colors } from "../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getSavedItems,
  resetGetSavedItemResultMessage,
} from "../../actions/savedItem";
import {
  resetAddFavoriteMessage,
  resetRemoveFavoriteMessage,
} from "../../actions/product";

export default function Favorite() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [data, setData] = useState();

  const userDataRedux = useSelector((state) => state.accountData.userInfo);

  const language = useSelector((state) => state.accountData.language);

  const savedItemData = useSelector(
    (state) => state.savedItemData.getSavedItemResultData
  );
  const addProductFavoriteResultMessage = useSelector(
    (state) => state.productData.addProductFavoriteResultMessage
  );
  const removeFavoriteProductResultMessage = useSelector(
    (state) => state.productData.removeFavoriteProductResultMessage
  );

  useEffect(() => {
    if (userDataRedux && language) {
      const data = {
        isGet: "1",
        savedItemType: "0",
        userNumber: userDataRedux.userNumber,
        language: language,
      };
      dispatch(getSavedItems(data));
    }
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     const data = {
  //       isGet: "1",
  //       savedItemType: "0",
  //       userNumber: userDataRedux.userNumber,
  //       language: language,
  //     };
  //     dispatch(getSavedItems(data));
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  useEffect(() => {
    if (addProductFavoriteResultMessage === "success") {
      const data = {
        isGet: "1",
        savedItemType: "0",
        userNumber: userDataRedux.userNumber,
        language: language,
      };
      dispatch(getSavedItems(data));
      dispatch(resetAddFavoriteMessage());
    }
  }, [addProductFavoriteResultMessage]);

  useEffect(() => {
    if (removeFavoriteProductResultMessage === "success") {
      const data = {
        isGet: "1",
        savedItemType: "0",
        userNumber: userDataRedux.userNumber,
        language: language,
      };
      dispatch(getSavedItems(data));
      dispatch(resetRemoveFavoriteMessage());
    }
  }, [removeFavoriteProductResultMessage]);

  return (
    <View style={styles.container}>
      {savedItemData ? (
        <SingleColumnItemList data={savedItemData} />
      ) : (
        <LoadingSpinner />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
