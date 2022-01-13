import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";

//data
import { keywordData } from "../../../config/data";

//icon
import { AntDesign } from "@expo/vector-icons";

//styles
import { Colors } from "../../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import { searchProductByText } from "../../../actions/search";

function KeyWordList({ data, type, setShowResult }) {
  const languageCode = useSelector((state) => state.accountData.language);

  //storeNumber
  const storeNumber = useSelector(
    (state) => state.accountData.deliveryStore.storeNumber
  );

  //userNumber
  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const handleHotSearchTagPress = (input) => {
    const data = {
      isGet: "1",
      storeNumber: storeNumber,
      searchText: input,
      offset: "0",
      language: languageCode,
      userNumber: userNumber,
    };

    dispatch(searchProductByText(data));
    setShowResult(true);
  };

  const handleHistorySearchTagPress = (input) => {
    const data = {
      isGet: "1",
      storeNumber: storeNumber,
      searchText: input,
      offset: "0",
      language: languageCode,
      userNumber: userNumber,
    };

    dispatch(searchProductByText(data));
    setShowResult(true);
  };

  const dispatch = useDispatch();
  if (data.length > 0 && languageCode) {
    if (type == "history") {
      return data.map((item, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          style={styles.keywordContainer}
          onPress={() => handleHistorySearchTagPress(item)}
        >
          <Text style={styles.keyword}>{item}</Text>
        </TouchableOpacity>
      ));
    } else {
      return data.map((item, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          style={styles.keywordContainer}
          onPress={() => handleHotSearchTagPress(item[languageCode])}
        >
          <Text style={styles.keyword}>{item[languageCode]}</Text>
        </TouchableOpacity>
      ));
    }
  } else {
    return (
      <View style={{ paddingHorizontal: 10 }}>
        <Text>No history search</Text>
      </View>
    );
  }
}

export default function SearchGrid(props) {
  const { mainTitle, deleteIcon, data, type, setShowResult } = props;

  return (
    <>
      <View style={styles.mainContainer}>
        {/* mainTitle */}
        <View style={styles.mainTitleContainer}>
          <Text style={styles.mainTitleText}>{mainTitle}</Text>
        </View>

        {/* icon 暂时先关掉*/}
        {/* <View style={styles.iconContainer}>
          {deleteIcon && (
            <AntDesign name="delete" size={24} color={Colors.black} />
          )}
        </View> */}
      </View>

      {/* list of keywords */}
      <View style={styles.keywordListContainer}>
        {data !== "empty" ? (
          <KeyWordList
            data={data.recommendContent}
            type={type}
            setShowResult={setShowResult}
          />
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainTitleText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  mainTitleContainer: {
    marginLeft: 10,
    marginTop: 40,
  },
  iconContainer: {
    marginRight: 10,
    marginTop: 40,
  },
  keywordListContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  keywordContainer: {
    borderColor: Colors.primary,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginLeft: 10,
    marginVertical: 5,
    borderWidth: 1,
  },
  keyword: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    color: Colors.primary,
    fontSize: 14,
  },
  row: {
    flex: 1,
    marginVertical: 10,
  },
});
