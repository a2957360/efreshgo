import { GET_DATA_SUCCESS } from "../constants/ActionTypes";
import axios from "axios";

export const getData = () => {
  return (dispatch) => {
    axios.get("https://geocoder.ca/L3R 5Y2?json=1").then((res) => {
      dispatch({ type: GET_DATA_SUCCESS, payload: res.data });
    });
    //catch error
    //using res.status
  };
};
