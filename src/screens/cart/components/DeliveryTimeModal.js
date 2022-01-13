import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";

//component
import DeliveryDate from "./DeliveryDate";
import DeliveryTime from "./DeliveryTime";
import Spacing from "../../../components/Spacing";
import LoadingScreen from "../../../components/LoadingScreen";

import { AntDesign } from "@expo/vector-icons";

//packages
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

//style
import { Colors } from "../../../styles";

//data
import { DeliveryDateList } from "../../../config/data";
//const
import { screenHeight, screenWidth } from "../../../config/settings";

//package
import { useDispatch, useSelector } from "react-redux";
import { setDeliveryDate } from "../../../actions/account";
import EmptyCart from "./EmptyCart";

export default function DeliveryTimeModal(props) {
  const { setDeliveryTimeModalVisible, data } = props;

  const dispatch = useDispatch();

  const [menuIndex, setMenuIndex] = useState(0);
  const [selectedDateTimeList, setSelectedDateTimeList] = useState();

  //一进去先选第一个日期
  useEffect(() => {
    dispatch(setDeliveryDate(data[0].date));
    setSelectedDateTimeList(data[0].time);
  }, []);

  const handleDateButtonPress = (index) => {
    dispatch(setDeliveryDate(data[index].date));
    setSelectedDateTimeList(data[index].time);
    setMenuIndex(index);
  };

  const renderDate = ({ item, index }) => {
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
          onPress={() => handleDateButtonPress(index)}
          style={styles.dateContainer}
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
            {item.date}
          </Text>
        </TouchableOpacity>

        {/* 空白填充 */}
        <View style={styles.indicator} />
      </View>
    );
  };

  if (!data) {
    return <LoadingScreen />;
  } else if (data.length == 0) {
    return <EmptyCart emptyMessage={"No data"} />;
  } else {
    return (
      <View style={{ flex: 1 }}>
        {/* header */}
        <View style={styles.ModalHeader}>
          <View style={styles.emptySpace}></View>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              {i18n.t("Select Delivery Schedule")}
            </Text>
          </View>

          {/* cancel button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setDeliveryTimeModalVisible(false)}
          >
            <AntDesign name="close" size={26} color="black" />
          </TouchableOpacity>
        </View>

        {/* delivery schedule */}
        <View style={styles.scheduleContainer}>
          {/* available date */}
          <View style={styles.dateListContainer}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              data={data}
              numColumns={1}
              renderItem={renderDate}
            />
          </View>

          {/* available time */}
          <View style={{ flex: 0.6 }}>
            <DeliveryTime
              setDeliveryTimeModalVisible={setDeliveryTimeModalVisible}
              data={selectedDateTimeList}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ModalHeader: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.18,
    borderBottomColor: Colors.darkGrey,
  },
  headerContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  emptySpace: {
    flex: 0.2,
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
  dateListContainer: {
    flex: 0.4,
    backgroundColor: Colors.midGrey,
  },
  scheduleContainer: { flex: 0.9, flexDirection: "row" },
  dateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
