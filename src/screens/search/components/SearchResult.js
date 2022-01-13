import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

//components
import DoubleColumnRecipeListSearchResult from "../../../components/DoubleColumnRecipeListSearchResult";
import SingleColumnItemList from "../../../components/SingleColumnItemList";

//data
import { reciptList } from "../../../config/data";
import { productList } from "../../../config/data";

//styles
import { Colors } from "../../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";

export default function SearchResult() {
  const dispatch = useDispatch();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "商品" },
    { key: "second", title: "菜谱" },
  ]);

  const searchedData = useSelector(
    (state) => state.searchData.searchProductByTextResultData
  );

  const searchRecipeByTextResultData = useSelector(
    (state) => state.searchData.searchRecipeByTextResultData
  );

  const FirstRoute = () => <SingleColumnItemList data={searchedData} />;

  const SecondRoute = () => (
    <DoubleColumnRecipeListSearchResult data={searchRecipeByTextResultData} />
  );

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderLabel={({ route, focused }) => (
        <View style={styles.label}>
          <Text
            style={[styles.textColor, focused ? styles.focus : styles.unFocus]}
          >
            {route.title}
          </Text>
        </View>
      )}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
    />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <View style={styles.container}>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  focus: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  unFocus: {
    fontSize: 16,
  },
  textColor: {
    color: Colors.lightBlack,
  },
  indicator: {
    backgroundColor: Colors.primary,
    width: 72,
    height: 3,
    marginHorizontal: 55,
    marginBottom: 7,
  },
  tabBar: {
    backgroundColor: Colors.white,
  },
});
