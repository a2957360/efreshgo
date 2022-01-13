import axios from "axios";
import { serverUrl } from "../config/settings";

import {
  GET_SAVED_ITEM_SUCCESS,
  GET_SAVED_ITEM_SUCCESS_END,
} from "../constants/ActionTypes";

export const getSavedItems = (data) => {
  console.log("this is get saved item input", data);
  return (dispatch) => {
    axios
      .post(`${serverUrl}savedItemModule.php`, data)
      .then((res) => {
        console.log("this is saved item list", res.data);
        dispatch({
          type: GET_SAVED_ITEM_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const resetGetSavedItemResultMessage = () => {
  return (dispatch) => {
    dispatch({ type: GET_SAVED_ITEM_SUCCESS_END });
  };
};
