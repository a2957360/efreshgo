import { GET_COUPON_SUCCESS } from "../constants/ActionTypes";

const INIT_STATE = {
  getCouponResultMessage: "",
  getCouponResultData: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COUPON_SUCCESS: {
      return {
        ...state,
        getCouponResultData: action.payload.data,
        getCouponResultMessage: action.payload.message,
      };
    }

    default:
      return state;
  }
};
