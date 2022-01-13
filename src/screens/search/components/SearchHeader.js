import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";

//icons
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

//styles
import { Colors } from "../../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  searchProductByText,
  searchRecipeByText,
} from "../../../actions/search";

export default function SearchHeader({ navigation, setShowResult }) {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  //langauge code
  const languageCode = useSelector((state) => state.accountData.language);

  //userNumber
  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  //storeNumber
  const storeNumber = useSelector(
    (state) => state.accountData.deliveryStore.storeNumber
  );

  const handleSearchSubmit = (input) => {
    const data = {
      isGet: "1",
      storeNumber: storeNumber,
      searchText: input,
      offset: "0",
      language: languageCode,
      userNumber: userNumber,
    };

    const recipeBody = {
      isGet: "1",
      searchText: input,
      offset: "0",
      language: languageCode,
    };

    dispatch(searchProductByText(data));
    dispatch(searchRecipeByText(recipeBody));
    setShowResult(true);
  };

  return (
    <View style={styles.mainContainer}>
      {/* leftIcon Box */}
      <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()}>
        <View style={styles.leftIconContainer}>
          <Ionicons name="ios-arrow-back" size={28} color={Colors.black} />
        </View>
      </TouchableOpacity>

      {/* search box */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.searchIcon}>
          <AntDesign name="search1" size={16} color={Colors.darkGrey} />
        </View>

        <View style={styles.textContainer}>
          <TextInput
            // placeholder="搜索最新美食"
            autoFocus={true}
            onChangeText={(text) => setInput(text)}
            value={input}
            maxLength={20}
            onSubmitEditing={() => {
              handleSearchSubmit(input);
            }}
            returnKeyType={"search"}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  leftIconContainer: {
    marginLeft: 20,
    justifyContent: "center",
  },
  searchBoxContainer: {
    flex: 1,
    backgroundColor: Colors.midGrey,
    marginLeft: 20,
    marginRight: 10,
    borderRadius: 20,
    flexDirection: "row",
  },
  searchIcon: {
    marginLeft: 10,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
});
