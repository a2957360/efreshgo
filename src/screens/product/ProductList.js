//react
import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation, useIsFocused } from "@react-navigation/native";

//react native
import { StyleSheet, Text, View } from "react-native";

//components
import SingleColumnItemListProductList from "../../components/SingleColumnItemListProductList";
import Spacing from "../../components/Spacing";

//packages
import { TabView, TabBar } from "react-native-tab-view";
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

//config
//import { productList } from "../../config/data";

//style
import { Colors } from "../../styles";
import { screenWidth } from "../../config/settings";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getProductList, reGetProductList } from "../../actions/product";
import { getProductFromCart, reGetProductFromCart } from "../../actions/cart";
// import {
//   resetAddFavoriteMessage,
//   resetRemoveFavoriteMessage,
// } from "../../actions/product";

//translation data
import { languageData } from "../../i18n/i18n";

export default function CategoryList(props) {
  i18n.translations = languageData;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const {
    route: {
      params: { id, title, itemData },
    },
  } = props;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 0, title: i18n.t("Normal") },
    { key: 1, title: i18n.t("New") },
    { key: 2, title: i18n.t("Popular") },
  ]);
  let indexList = ["normal", "new", "sale"];

  //langauge code
  const languageCode = useSelector((state) => state.accountData.language);

  // const selectedStore = useSelector((state) => state.accountData.deliveryStore);

  const getProductListResultData = useSelector(
    (state) => state.productData.getProductListResultData
  );

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  // const addProductFavoriteResultMessage = useSelector(
  //   (state) => state.productData.addProductFavoriteResultMessage
  // );

  // const removeFavoriteProductResultMessage = useSelector(
  //   (state) => state.productData.removeFavoriteProductResultMessage
  // );

  // const addProductToCartResultMessage = useSelector(
  //   (state) => state.cartData.addProductToCartResultMessage
  // );

  useEffect(() => {
    //change header title depends on category
    navigation.setOptions({ headerTitle: title });

    // 获取产品列表，获取购物车产品
    getProductListData();
  }, [isFocused]);

  //监测增加减少产品数量结果，如果成功重新获取数据
  // useEffect(() => {
  //   if (addProductToCartResultMessage == "success") {
  //     reGetProdcutListData();
  //   }
  // }, [addProductToCartResultMessage]);

  //获取产品列表，获取购物车产品(有loading)
  const getProductListData = (index) => {
    //从首页导航过来的,
    if (props.route.params?.targetCategoryNumber != undefined) {
      const data = {
        isGet: "1",
        orderBy: indexList[index],
        userNumber: userNumber,
        offset: "0",
        language: languageCode,
        itemCategory: props.route.params.targetCategoryNumber,
      };

      const simpleCartData = {
        isGet: "1",
        userNumber: userNumber,
      };
      dispatch(getProductList(data));
      dispatch(getProductFromCart(simpleCartData));
    }
    //不是从首页过来的
    else {
      const data = {
        isGet: "1",
        orderBy: indexList[index],
        userNumber: userNumber,
        offset: "0",
        language: languageCode,
        itemCategory: itemData.categoryNumber,
      };

      const simpleCartData = {
        isGet: "1",
        userNumber: userNumber,
      };
      dispatch(getProductList(data));
      dispatch(getProductFromCart(simpleCartData));
    }
  };

  //增加减少产品数量，重新获取产品列表，购物车产品(无loading)
  const reGetProdcutListData = () => {
    //从首页导航过来的
    if (props.route.params?.targetCategoryNumber != undefined) {
      const data = {
        isGet: "1",
        orderBy: indexList[index],
        userNumber: userNumber,
        offset: "0",
        language: languageCode,
        itemCategory: props.route.params.targetCategoryNumber,
      };

      const simpleCartData = {
        isGet: "1",
        userNumber: userNumber,
      };
      dispatch(reGetProductList(data));
      dispatch(reGetProductFromCart(simpleCartData));
    } else {
      const data = {
        isGet: "1",
        orderBy: indexList[index],
        userNumber: userNumber,
        offset: "0",
        language: languageCode,
        itemCategory: itemData.categoryNumber,
      };

      const simpleCartData = {
        isGet: "1",
        userNumber: userNumber,
      };
      dispatch(reGetProductList(data));
      dispatch(reGetProductFromCart(simpleCartData));
    }
  };

  //按tab menue，存index，获取数据
  const handleIndexChange = (index) => {
    setIndex(index);
    // 获取产品列表，获取购物车产品
    getProductListData(index);
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      scrollEnabled={true}
      renderLabel={({ route, focused }) => (
        <View style={styles.tabContainer}>
          <Text
            style={[
              { color: Colors.black },
              focused
                ? { fontSize: 14, fontWeight: "bold", color: Colors.primary }
                : { fontSize: 14 },
            ]}
          >
            {route.title}
          </Text>
        </View>
      )}
      tabStyle={{ width: screenWidth * 0.33 }}
      indicatorStyle={styles.tabIndicator}
      style={{ backgroundColor: Colors.white }}
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        onIndexChange={(index) => handleIndexChange(index)}
        renderScene={({ route }) => {
          return (
            <SingleColumnItemListProductList data={getProductListResultData} />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midGrey,
  },
  tabContainer: {
    width: 80,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  tabIndicator: {
    backgroundColor: Colors.primary,
    width: screenWidth * 0.2,
    height: 3,
    marginHorizontal: screenWidth * 0.065,
    marginBottom: 7,
  },
});

//reget data after add favorite
// useEffect(() => {
//   if (addProductFavoriteResultMessage === "success") {
//     if (props.route.params?.targetCategoryNumber != undefined) {
//       const data = {
//         isGet: "1",
//         orderBy: "normal",
//         userNumber: userNumber,
//         offset: "0",
//         language: languageCode,
//         itemCategory: props.route.params.targetCategoryNumber,
//       };

//       const simpleCartData = {
//         isGet: "1",
//         userNumber: userNumber,
//       };
//       dispatch(getProductList(data));
//       dispatch(getProductFromCart(simpleCartData));
//       dispatch(resetAddFavoriteMessage());
//     } else {
//       const data = {
//         isGet: "1",
//         orderBy: "normal",
//         userNumber: userNumber,
//         offset: "0",
//         language: languageCode,
//         itemCategory: props.route.params
//           ? props.route.params.targetCategoryNumber
//           : itemData.categoryNumber,
//       };

//       const simpleCartData = {
//         isGet: "1",
//         userNumber: userNumber,
//       };
//       dispatch(getProductList(data));
//       dispatch(getProductFromCart(simpleCartData));
//       dispatch(resetAddFavoriteMessage());
//     }
//   }
// }, [addProductFavoriteResultMessage]);

//reget data after remove favorite
// useEffect(() => {
//   if (removeFavoriteProductResultMessage === "success") {
//     const data = {
//       isGet: "1",
//       userNumber: userNumber,
//       offset: "0",
//       language: languageCode,
//       itemCategory: props.route.params
//         ? props.route.params.targetCategoryNumber
//         : itemData.categoryNumber,
//     };

//     const simpleCartData = {
//       isGet: "1",
//       userNumber: userNumber,
//     };
//     dispatch(getProductList(data));
//     dispatch(getProductFromCart(simpleCartData));
//     dispatch(resetRemoveFavoriteMessage());
//   }
// }, [removeFavoriteProductResultMessage]);

//从首页导航过来的
// if (props.route.params?.targetCategoryNumber != undefined) {
//   const data = {
//     isGet: "1",
//     orderBy: indexList[index],
//     userNumber: userNumber,
//     offset: "0",
//     language: languageCode,
//     itemCategory: props.route.params.targetCategoryNumber,
//   };

//   const simpleCartData = {
//     isGet: "1",
//     userNumber: userNumber,
//   };
//   dispatch(getProductList(data));
//   dispatch(getProductFromCart(simpleCartData));
// }
// //不是从首页导航过来
// else {
//   const data = {
//     isGet: "1",
//     orderBy: indexList[index],
//     userNumber: userNumber,
//     offset: "0",
//     language: languageCode,
//     itemCategory: itemData.categoryNumber,
//   };

//   const simpleCartData = {
//     isGet: "1",
//     userNumber: userNumber,
//   };
//   dispatch(getProductList(data));
//   dispatch(getProductFromCart(simpleCartData));
// }
