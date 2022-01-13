import axios from "axios";

import { serverUrl } from "../config/settings";

import { GET_HOME_PAGE_LAYOUT_SUCCESS,GET_HOME_PAGE_LAYOUT_START, SET_SEND_NOTIFICATION_FLAG_SUCCESS } from "../constants/ActionTypes";

export const getHomePageLayout = (data) => {
  //console.log("get home page layout input", data);
  return async (dispatch) => {
    dispatch({type: GET_HOME_PAGE_LAYOUT_START});
    try {
      const res = await axios.post(`${serverUrl}pageLayoutModule.php`, data);
      if (res.status === 200) {
        //console.log("get home page layout input", res.data);

        dispatch({
          type: GET_HOME_PAGE_LAYOUT_SUCCESS,
          payload: res.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const setSendNotificationFlag = (data) => {
  console.log("set send notification flag", data);
  return async (dispatch) => {
    dispatch({type: SET_SEND_NOTIFICATION_FLAG_SUCCESS, payload: data});

  };
};
