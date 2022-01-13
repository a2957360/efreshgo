import React from "react";

import { View } from "react-native";

//style
import { Colors } from "../styles";

const spacing = {
  extraSmall: 2,
  small: 6,
  medium: 8,
  large: 10,
  extraLarge: 20,
};
//spacing components
//props
//height：height of spacing
export default function Spacing(props) {
  const { height, width } = props;

  return (
    <View
      style={{
        backgroundColor: Colors.midGrey,
        height: spacing[height],
        width: spacing[width],
      }}
    />
  );
}
