import axios from "axios";
import { serverUrl } from "../config/settings";

import { GET_CONTACT_US_SUCCESS } from "../constants/ActionTypes";

export const getContactUs = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}infoModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_CONTACT_US_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
