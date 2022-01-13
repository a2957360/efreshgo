//react
import React, { useState, useEffect, useLayoutEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native
import { StyleSheet, Text, View, FlatList, SafeAreaView } from "react-native";

//components
import Banner from "../../components/Banner";
import ProductInfo from "./components/ProductInfo";
import QuantitySelector from "./components/QuantitySelector";
import ProductDescription from "./components/ProductDescription";
import Spacing from "../../components/Spacing";
import CartPriceBar from "../../components/CartPriceBar";
import LoadingScreen from "../../components/LoadingScreen";
import LoadingSpinner from "../../components/LoadingSpinner";
//import { Overlay } from "react-native-elements";
//import EmptyCart from "../cart/components/EmptyCart";

//config
import i18n from "i18n-js";

//style
import { Colors } from "../../styles";
import { screenHeight, screenWidth } from "../../config/settings";
//import SingleRowItemList from "../../components/SingleRowItemList";
import SingleRowItemListGuessYouLike from "../../components/SingleRowItemListGuessYouLike";

//translation data
import { languageData } from "../../i18n/i18n";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  //getSuggestedProducts,
  getProductDetail,
  resetGetProductDetailResultMessage,
  //modifyQuantityGetProductDetail,
  //resetAddFavoriteMessage,
  //resetRemoveFavoriteMessage,
} from "../../actions/product";
import {
  //resetAddProductToCartResultMessage,
  getProductFromCart,
} from "../../actions/cart";

//package
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductDetail(props) {
  i18n.translations = languageData;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    route: {
      params: { title, itemNumber },
    },
  } = props;

  // const [loadingVisible, setLoadingVisible] = useState(false);

  // const [localQuantity, setLocalQuantity] = useState();

  const languageCode = useSelector((state) => state.accountData.language);

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const productDetailData = useSelector(
    (state) => state.productData.getProductDetailResultData
  );

  const getProductDetailResultMessage = useSelector(
    (state) => state.productData.getProductDetailResultMessage
  );

  // const addProductToCartResultMessage = useSelector(
  //   (state) => state.cartData.addProductToCartResultMessage
  // );

  // const addProductFavoriteResultMessage = useSelector(
  //   (state) => state.productData.addProductFavoriteResultMessage
  // );

  // const removeFavoriteProductResultMessage = useSelector(
  //   (state) => state.productData.removeFavoriteProductResultMessage
  // );

  // 一进来获取产品详情
  useEffect(() => {
    //获取getProductFromCartData
    const getProductDataInput = {
      isGet: "1",
      userNumber: userNumber,
    };
    dispatch(getProductFromCart(getProductDataInput));

    //从首页过来
    if (props.route.params?.targetItemNumber != undefined) {
      const data = {
        isGet: "1",
        itemNumber: props.route.params.targetItemNumber,
        offset: "0",
        language: languageCode,
        userNumber: userNumber,
      };
      dispatch(getProductDetail(data));
    }
    //不是从首页过来
    else {
      const data = {
        isGet: "1",
        itemNumber: itemNumber,
        offset: "0",
        language: languageCode,
        userNumber: userNumber,
      };
      dispatch(getProductDetail(data));
    }
  }, []);

  //when loading data is finish, set loading to false
  useEffect(() => {
    if (getProductDetailResultMessage == "success") {
      //setLocalQuantity(productDetailData[0].itemQuantity);
      dispatch(resetGetProductDetailResultMessage());
    }
  }, [getProductDetailResultMessage]);

  const renderLayout = ({ item, index }) => {
    return (
      <View key={index} style={styles.container}>
        <>
          <View style={styles.swiperContainer}>
            <Banner data={productDetailData[0].itemImages} />
          </View>

          <ProductInfo
            title={productDetailData[0].itemTitle}
            subTitle={productDetailData[0].itemSubTitle}
            tags={productDetailData[0].itemTag}
            itemNumber={productDetailData[0].itemNumber}
            isSavedFavorite={productDetailData[0].savedItemNumber}
          />

          <Spacing height="medium" />

          <QuantitySelector
            quantity={productDetailData[0].itemQuantity}
            itemNumber={productDetailData[0].itemNumber}
            //setLocalQuantity={setLocalQuantity}
          />

          <Spacing height="medium" />

          <ProductDescription data={productDetailData[0].itemDescription} />

          <Spacing height="medium" />

          <View style={styles.recommandContainer}>
            <Text style={styles.recommandTitle}>{i18n.t("Similar Items")}</Text>
          </View>

          {/* <SingleRowItemList data={productDetailData[0].like} /> */}
          <SingleRowItemListGuessYouLike data={productDetailData[0].like} />

          <Spacing height="medium" />
        </>
      </View>
    );
  };

  if (productDetailData == "" || !productDetailData) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        {/* <Overlay isVisible={loadingVisible}>
          <LoadingSpinner />
        </Overlay> */}

        <FlatList
          keyExtractor={(item, index) => index.toString()}
          style={styles.layoutContainer}
          showsVerticalScrollIndicator={false}
          data={null}
          ListEmptyComponent={renderLayout}
        />

        <View style={styles.priceBarContainer}>
          <CartPriceBar
            data={{
              buttonText: "Checkout",
              navigationPage: "Cart",
              isProdcutDetail: true,
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layoutContainer: {
    flex: 0.9,
  },
  priceBarContainer: {
    flex: 0.1,
  },
  swiperContainer: {
    height: screenHeight * 0.3,
  },
  recommandContainer: {
    backgroundColor: Colors.white,
    borderBottomColor: Colors.midGrey,
    borderBottomWidth: 1,
  },
  recommandTitle: {
    fontSize: 20,
    padding: 15,
  },
  homeHeaderContainer: {
    height: 88,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backArrowContainer: {
    paddingLeft: 7,
    width: 25,
    height: 35,
  },
});

// useEffect(() => {
//   onPageLoadedGetProductFromCart();
// }, [isFocused]);

// const onPageLoadedGetProductFromCart = async () => {
//   const currentUser = JSON.parse(await AsyncStorage.getItem("currentUser"));

// };

// useLayoutEffect(() => {
//   console.log(props);
//   navigation.setOptions({
//     header: ({ navigation }) => {
//       return (
//         <SafeAreaView style={styles.homeHeaderContainer}>
//           {/* 返回按钮 */}
//           <Ionicons
//             name="ios-arrow-back"
//             size={32}
//             color="black"
//             onPress={() => handleBackArrowPress()}
//             style={styles.backArrowContainer}
//           />
//           {/* 页面title */}
//           <Text style={{ fontSize: 17, fontWeight: "bold" }}>
//             {i18n.t("ProductDetail")}
//           </Text>
//           {/* 空白 */}
//           <Text style={styles.backArrowContainer}></Text>
//         </SafeAreaView>
//       );
//     },
//   });
// });

// const handleBackArrowPress = () => {
//   //从外面进来的
//   if (props.route.params?.targetItemNumber != undefined) {
//     navigation.navigate("Home");
//     console.log(9999, props.route.params?.targetItemNumber);
//   } else {
//     console.log(88888);
//     navigation.goBack();
//   }
// };

// 更改产品数量后更新productdetail;
// useEffect(() => {
//   if (addProductToCartResultMessage == "success") {
//     if (props.route.params?.targetItemNumber != undefined) {
//       const data = {
//         isGet: "1",
//         itemNumber: props.route.params.targetItemNumber,
//         offset: "0",
//         language: languageCode,
//         userNumber: userNumber,
//       };

//       dispatch(modifyQuantityGetProductDetail(data));
//       dispatch(resetAddProductToCartResultMessage());
//     } else {
//       const data = {
//         isGet: "1",
//         itemNumber: itemNumber,
//         offset: "0",
//         language: languageCode,
//         userNumber: userNumber,
//       };
//       dispatch(modifyQuantityGetProductDetail(data));
//       dispatch(resetAddProductToCartResultMessage());
//     }
//   }
// }, [addProductToCartResultMessage]);

//添加收藏后更新productDetail
// useEffect(() => {
//   if (addProductFavoriteResultMessage == "success") {
//     if (props.route.params?.targetItemNumber != undefined) {
//       const data = {
//         isGet: "1",
//         itemNumber: props.route.params.targetItemNumber,
//         offset: "0",
//         language: languageCode,
//         userNumber: userNumber,
//       };

//       dispatch(modifyQuantityGetProductDetail(data));
//       dispatch(resetAddFavoriteMessage());
//     } else {
//       const data = {
//         isGet: "1",
//         itemNumber: itemNumber,
//         offset: "0",
//         language: languageCode,
//         userNumber: userNumber,
//       };
//       dispatch(modifyQuantityGetProductDetail(data));
//       dispatch(resetAddFavoriteMessage());
//     }
//   }
// }, [addProductFavoriteResultMessage]);

//取消收藏后更新productDetail
// useEffect(() => {
//   if (removeFavoriteProductResultMessage == "success") {
//     if (props.route.params?.targetItemNumber != undefined) {
//       const data = {
//         isGet: "1",
//         itemNumber: props.route.params.targetItemNumber,
//         offset: "0",
//         language: languageCode,
//         userNumber: userNumber,
//       };

//       dispatch(modifyQuantityGetProductDetail(data));
//       dispatch(resetRemoveFavoriteMessage());
//     } else {
//       const data = {
//         isGet: "1",
//         itemNumber: itemNumber,
//         offset: "0",
//         language: languageCode,
//         userNumber: userNumber,
//       };
//       dispatch(modifyQuantityGetProductDetail(data));
//       dispatch(resetRemoveFavoriteMessage());
//     }
//   }
// }, [removeFavoriteProductResultMessage]);
