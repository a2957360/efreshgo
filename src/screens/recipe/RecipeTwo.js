//react
import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation, useIsFocused } from "@react-navigation/native";

//react native components
import { StyleSheet, Text, View } from "react-native";

//components
import DoubleColumnRecipeList from "../../components/DoubleColumnRecipeList";
import Spacing from "../../components/Spacing";
import LoadingScreen from "../../components/LoadingScreen";

//packages
import i18n from "i18n-js";
import { TabView, TabBar } from "react-native-tab-view";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors } from "../../styles";

//config
import { screenHeight, screenWidth } from "../../config/settings";
import { reciptList } from "../../config/data";
import { primary } from "../../styles/colors";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getRecipeCategory, getRecipe } from "../../../src/actions/recipe";

function Recipe(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [firstTime, setFirstTime] = useState(true);

  //recipe category list from api
  const recipeCategory = useSelector(
    (state) => state.recipeData.recipeCategory
  );

  //language code from api
  const languageCode = useSelector((state) => state.accountData.language);

  //recipe data from api
  const recipeData = useSelector((state) => state.recipeData.recipe);

  //loading status
  const isLoading = useSelector((state) => state.recipeData.recipeLoading);

  //一进来先获取菜谱分类
  useEffect(() => {
    const data = {
      isGet: "1",
      categoryType: "1",
      language: languageCode,
    };
    dispatch(getRecipeCategory(data));
    // console.log("here", props.route.params?.targetCategoryNumber);
  }, [isFocused]);

  //get recipe data
  useEffect(() => {
    //如果是从其他地方导航过来
    // if (props.route.params?.targetCategoryNumber != undefined) {
    if (recipeCategory && firstTime) {
      console.log("ouside", recipeCategory);
      const data = recipeCategory.map((item, index) => {
        return {
          key: index,
          title: item.categoryTitle,
          categoryNumber: item.categoryNumber,
        };
      });
      //find corresponding recipe category index
      // const autoIndex = recipeCategory.findIndex(
      //   (element) =>
      //     element.categoryNumber == props.route.params.targetCategoryNumber
      // );

      setRoutes(data);
      setFirstTime(false);
      // setIndex(autoIndex);
      // getRecipeData(props.route.params.targetCategoryNumber);
    }
    // }
  }, [recipeCategory]);

  //获取菜谱数据
  const getRecipeData = (categoryNumber) => {
    const data = {
      isGet: "1",
      cookbookCategory: categoryNumber,
      language: languageCode,
    };
    dispatch(getRecipe(data));
  };

  const handleIndexChange = (index) => {
    console.log("index changing", index);
    if (routes.length > 0) {
      setIndex(index);
      const testRoute = routes[index];
      console.log("testRoute", testRoute);
      const categoryNumber = testRoute.categoryNumber;
      console.log("categorynumber", categoryNumber);
      console.log(111, categoryNumber);
      getRecipeData(categoryNumber);
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      scrollEnabled={true}
      renderLabel={({ route, focused }) => (
        <View style={styles.tabContainer}>
          <Text
            numberOfLines={1}
            style={[
              {
                color: Colors.black,
              },
              focused
                ? { fontSize: 16, fontWeight: "bold", color: Colors.primary }
                : { fontSize: 14 },
            ]}
          >
            {route.title}
          </Text>
        </View>
      )}
      tabStyle={styles.tabStyles}
      indicatorStyle={styles.tabIndicatorContainer}
      style={{ backgroundColor: Colors.white }}
    />
  );
  if (routes.length < 0) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          onIndexChange={(index) => {
            handleIndexChange(index);
          }}
          renderScene={({ route }) => {
            return isLoading ? (
              <LoadingScreen />
            ) : (
              <DoubleColumnRecipeList data={recipeData} />
            );
          }}
        />
      </View>
    );
  }
}

export default Recipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midGrey,
  },
  tabContainer: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    width: 120,
  },
  tabIndicatorContainer: {
    backgroundColor: Colors.primary,
    width: 72,
    height: 3,
    marginHorizontal: 14,
    marginBottom: 7,
  },
  tabStyles: {
    width: 100,
  },
});
