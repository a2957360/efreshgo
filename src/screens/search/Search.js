import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Keyboard,
} from "react-native";

//components
import SearchGrid from "./components/SearchGrid";
import SearchResult from "./components/SearchResult";
import SearchHeader from "./components/SearchHeader";
import Spacing from "../../components/Spacing";

//styles
import { Colors } from "../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getRecommendSearch,
  getHistorySearch,
  searchProductByText,
} from "../../actions/search";

export default function Search({ navigation, route }) {
  const dispatch = useDispatch();
  const [showResult, setShowResult] = useState(false);

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

  //热门搜索数据
  const recommendSearchData = useSelector(
    (state) => state.searchData.getRecommendSearchResultData
  );

  //历史搜索数据
  const historySearchData = useSelector(
    (state) => state.searchData.getHistorySearchResultData
  );

  useEffect(() => {
    const hotSearchBody = {
      isGet: "1",
      recommendType: "0",
      language: languageCode,
    };

    const historySearchBody = {
      isGet: "1",
      recommendType: "1",
      userNumber: userNumber,
      language: languageCode,
    };

    dispatch(getRecommendSearch(hotSearchBody));
    dispatch(getHistorySearch(historySearchBody));
  }, []);

  const renderLayout = () => {
    return (
      <>
        {/* hot search */}
        <SearchGrid
          mainTitle={"热门搜索"}
          data={
            recommendSearchData.length > 0 ? recommendSearchData[0] : "empty"
          }
          setShowResult={setShowResult}
        />
        {/* history search */}
        <SearchGrid
          mainTitle={"历史搜索"}
          deleteIcon={true}
          data={historySearchData.length > 0 ? historySearchData[0] : "empty"}
          type="history"
          setShowResult={setShowResult}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <SafeAreaView style={styles.whiteContainer}>
        <SearchHeader navigation={navigation} setShowResult={setShowResult} />
      </SafeAreaView>

      {/* spacing */}
      <Spacing height="line" />

      {/* search result tabView */}
      {showResult ? (
        <SearchResult />
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.whiteContainer}
          data={null}
          ListEmptyComponent={renderLayout}
          onScroll={Keyboard.dismiss}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  whiteContainer: {
    height: 90,
    backgroundColor: Colors.white,
  },
});
