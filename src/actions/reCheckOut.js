import axios from "axios";
import { serverUrl } from "../config/settings";

import {
  RECHECKOUT_UPDATE_CART,
  RECHECKOUT_MAKE_ORDER,
  RECHECKOUT_MAKE_ORDER_END,
} from "../constants/ActionTypes";

export const reCheckOutUpdateCart = (data) => {
  return (dispatch) => {
    // console.log("reCheckOutUpdateCart input", data);
    axios
      .post(`${serverUrl}cartModule.php`, data)
      .then((res) => {
        // console.log("reCheckOutUpdateCart result", res.data);
        dispatch({
          type: RECHECKOUT_UPDATE_CART,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const reCheckOutMakeOrder = (data) => {
  return (dispatch) => {
    console.log("reCheckOutMakeOrder input", data);
    axios
      .post(`${serverUrl}orderModule.php`, data)
      .then((res) => {
        console.log("reCheckOutMakeOrder result", res.data);
        dispatch({
          type: RECHECKOUT_MAKE_ORDER,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const reCheckOutMakeOrderEnd = () => {
  return (dispatch) => {
    dispatch({ type: RECHECKOUT_MAKE_ORDER_END });
  };
};
