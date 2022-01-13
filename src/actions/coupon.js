import axios from "axios";
import { serverUrl } from "../config/settings";
import i18n from "i18n-js";

import { GET_COUPON_SUCCESS } from "../constants/ActionTypes";

export const getCoupon = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}couponModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_COUPON_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const redeemCoupon = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${serverUrl}couponModule.php`, data);

      if (res.status === 200) {
        const body = {
          userNumber: data.userNumber,
          isGet: "1",
        };
        dispatch(getCoupon(body));
        if (res.data.message == "fail") {
          alert(i18n.t("redeemCouponErrorMessage"));
        } else if (res.data.message == "success") {
          alert(i18n.t("redeemCouponSuccessMessage"));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
};
