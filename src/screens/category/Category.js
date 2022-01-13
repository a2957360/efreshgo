//react
import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native components
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";

//packages
import i18n from "i18n-js";

//components
import SecondaryCategoryList from "./components/secondaryCategoryList";
import LoadingScreen from "../../components/LoadingScreen";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors } from "../../styles";

//config
import { screenWidth, screenHeight } from "../../config/settings";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getProductPrimaryCategoryList,
  getProductSecondaryCategoryList,
} from "../../actions/product";

function Category(props) {
  i18n.translations = languageData;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [menuIndex, setMenuIndex] = useState(0);
  const [firstTime, setFirstTime] = useState(true);

  //langauge code
  const languageCode = useSelector((state) => state.accountData.language);

  //primary product category list api
  const primaryProductCategoryList = useSelector(
    (state) => state.productData.getProductPrimaryCategoryResultData
  );

  //secondary product category list from api
  const secondaryProductCategoryList = useSelector(
    (state) => state.productData.getProductSecondaryCategoryResultData
  );

  //loading flag
  const loadingFlag = useSelector(
    (state) => state.productData.isGetProductSecondaryCategoryLoading
  );

  //get primaryProductCategoryList
  useEffect(() => {
    const data = {
      isGet: "1",
      noParentId: "1",
      categoryType: "0",
      language: languageCode,
    };
    dispatch(getProductPrimaryCategoryList(data));
  }, []);

  //先取一级分类里第一个的二级分类
  useEffect(() => {
    //从首页导航过来的
    if (props.route.params?.targetCategoryNumber != undefined) {
      if (primaryProductCategoryList) {
        const navigateCategoryIndex = primaryProductCategoryList.map(
          (element, index) => {
            if (
              element.categoryNumber == props.route.params.targetCategoryNumber
            ) {
              setMenuIndex(index);
            }
          }
        );
        const data = {
          isGet: "1",
          categoryType: "0",
          language: languageCode,
          categoryParentId: props.route.params.targetCategoryNumber,
        };
        dispatch(getProductSecondaryCategoryList(data));
      }
    }

    if (primaryProductCategoryList && firstTime) {
      if (primaryProductCategoryList.length > 0) {
        const firstPrimaryProductCategory = primaryProductCategoryList[0];
        //console.log(222, firstPrimaryProductCategory);

        if (firstPrimaryProductCategory.categoryNumber) {
          const data = {
            isGet: "1",
            categoryType: "0",
            language: languageCode,
            categoryParentId: firstPrimaryProductCategory.categoryNumber,
          };
          dispatch(getProductSecondaryCategoryList(data));

          setFirstTime(false);
        }
      }
    }
  }, [primaryProductCategoryList]);

  const handlePress = (index, categoryNumber) => {
    const data = {
      isGet: "1",
      categoryType: "0",
      language: languageCode,
      categoryParentId: categoryNumber,
    };
    setMenuIndex(index);
    dispatch(getProductSecondaryCategoryList(data));
  };

  const renderMenu = ({ item, index }) => {
    return (
      <View
        style={[
          styles.button,
          index === menuIndex ? styles.activeButton : styles.inactiveButton,
        ]}
      >
        {/* indicator */}
        <View
          style={[
            styles.indicator,
            index === menuIndex
              ? styles.activeIndicator
              : styles.inactiveIndicator,
          ]}
        />

        {/* button */}
        <TouchableOpacity
          onPress={() => handlePress(index, item.categoryNumber)}
          style={styles.buttonContainer}
          key={item.id}
          activeOpacity={1}
        >
          <Text
            style={
              index === menuIndex
                ? styles.activeButtonText
                : styles.inactiveButtonText
            }
          >
            {/* {item.text} */}
            {item.categoryTitle}
          </Text>
        </TouchableOpacity>

        {/* 空白填充 */}
        <View style={styles.indicator} />
      </View>
    );
  };

  if (
    !primaryProductCategoryList ||
    !secondaryProductCategoryList ||
    loadingFlag
  ) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.primaryProductCategoryContainer}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            data={primaryProductCategoryList}
            numColumns={1}
            renderItem={renderMenu}
          />
        </View>

        <View style={styles.secondaryProductCategoryContainer}>
          <SecondaryCategoryList data={secondaryProductCategoryList} />
        </View>
      </View>
    );
  }
}

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    flexDirection: "row",
  },
  button: {
    flexDirection: "row",
    height: screenHeight * 0.08,
  },
  indicator: {
    width: 4,
    height: "100%",
  },
  activeIndicator: {
    backgroundColor: Colors.primary,
  },
  inactiveIndicator: {},
  activeButton: {
    backgroundColor: Colors.white,
  },
  inactiveButton: {
    backgroundColor: Colors.midgrey,
  },
  activeButtonText: {
    color: Colors.primary,
  },
  inactiveButtonText: {
    color: Colors.black,
  },
  secondaryProductCategoryContainer: {
    width: screenWidth * 0.72,
  },
  primaryProductCategoryContainer: {
    width: screenWidth * 0.28,
    backgroundColor: Colors.midGrey,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

//如果是从主页的地方导航过来
// if (
//   props.route.params?.targetCategoryNumber != undefined &&
//   primaryProductCategoryList.length > 0
// ) {
//   const navigateCategoryIndex = primaryProductCategoryList.findIndex(
//     (element) =>
//       element.categoryNumber == props.route.params.targetCategoryNumber
//   );

//   const data = {
//     isGet: "1",
//     categoryType: "0",
//     language: languageCode,
//     categoryParentId: props.route.params.targetCategoryNumber,
//   };
//   dispatch(getProductSecondaryCategoryList(data));
//   //setMenuIndex(navigateCategoryIndex);
// }
//从tab第一次过来
// if (primaryProductCategoryList.length > 0 && firstTime) {
//   const firstPrimaryProductCategory = primaryProductCategoryList[0];

//   if (firstPrimaryProductCategory.categoryNumber) {
//     const data = {
//       isGet: "1",
//       categoryType: "0",
//       language: languageCode,
//       categoryParentId: firstPrimaryProductCategory.categoryNumber,
//     };
//     dispatch(getProductSecondaryCategoryList(data));
//     setFirstTime(false);
//   }
// }
