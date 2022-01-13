//react
import React, { useState, useEffect } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native
import { StyleSheet, Text, View } from "react-native";

//components
import LoadingSpinner from "../../../components/LoadingSpinner";

//packages
import { TabView, TabBar } from "react-native-tab-view";
import Image from "react-native-auto-scale-image";
import i18n from "i18n-js";

//config
import { productList } from "../../../config/data";
import { screenWidth, screenHeight } from "../../../config/settings";

//style
import { Colors } from "../../../styles";

export default function ProductDescription(props) {
  const { data } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("Product Description")}</Text>
      {data &&
        data.map((item, index) => {
          return item.type == "text" ? (
            <Text key={index} style={{ paddingVertical: 20 }}>
              {item.value}
            </Text>
          ) : (
            <Image
              style={{
                width: "100%",
                height: screenHeight * 0.3,
                borderRadius: 5,
                resizeMode: "cover",
              }}
              source={{ uri: item.value }}
            />
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
  },
});

// {
//   data &&
//     data.map((item) => {
//       return (
//         <View>
//           {item.type == "text" ? (
//             <Text style={{ paddingVertical: 20 }}>{item.value}</Text>
//           ) : (
//             <Image
//               style={{
//                 width: screenWidth, // height will be calculated automatically
//                 paddingVertical: 20,
//               }}
//               uri={item.value}
//             />
//           )}
//         </View>
//       );
//     });
// }

{
  /* <Image
              style={{
                width: screenWidth - 60, // height will be calculated automatically
                paddingVertical: 20,
              }}
              uri={item.value}
            /> */
}
