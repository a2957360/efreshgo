import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

//package
import i18n from "i18n-js";

import { getData } from "./src/redux/actions/data";
import { AppLoading } from "expo";

function Example() {
  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);

  const dispatch = useDispatch();

  const term = useSelector((state) => state.pageData);

  if (term === undefined) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{term.location.postal}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Example;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  button: {
    borderRadius: 8,
    marginLeft: 25,
    marginRight: 25,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: "#f01d71",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
});
