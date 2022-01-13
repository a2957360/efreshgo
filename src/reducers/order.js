import {
  GET_ORDERS_SUCCESS,
  GET_ORDERS_SUCCESS_START,
  CHANGE_ORDERS_STATE_SUCCESS_START,
  CHANGE_ORDERS_STATE_SUCCESS,
  CHANGE_ORDERS_STATE_SUCCESS_END,
  ADD_REVIEW_SUCCESS_START,
  ADD_REVIEW_SUCCESS,
  GET_STORE_INFO_SUCCESS,
  GET_STORE_INFO_SUCCESS_START,
  GET_DRIVER_INFO_SUCCESS,
  GET_DRIVER_INFO_SUCCESS_START,
  ADD_REVIEW_SUCCESS_END,
} from "../constants/ActionTypes";

const INIT_STATE = {
  getOrdersResultData: "",
  getOrdersResultMessage: "",
  changeOrderStateResultData: "",
  changeOrderStateResultMessage: "",
  isChangeOrderStateLoading: false,
  addReviewResultData: "",
  addReviewResultMessage: "",
  isAddReviewLoading: false,
  getStoreInfoResultData: "",
  getStoreInfoResultMessage: "",
  getDriverInfoResultData: "",
  getDriverInfoResultMessage: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ORDERS_SUCCESS: {
      return {
        ...state,
        getOrdersResultData: action.payload.data,
        getOrdersResultMessage: action.payload.message,
      };
    }

    case GET_STORE_INFO_SUCCESS: {
      return {
        ...state,
        getStoreInfoResultData: action.payload.data,
        getStoreInfoResultMessage: action.payload.message,
      };
    }

    case GET_STORE_INFO_SUCCESS_START: {
      return {
        ...state,
        getStoreInfoResultData: "",
        getStoreInfoResultMessage: "",
      };
    }

    case GET_DRIVER_INFO_SUCCESS: {
      return {
        ...state,
        getDriverInfoResultData: action.payload.data,
        getDriverInfoResultMessage: action.payload.message,
      };
    }

    case GET_DRIVER_INFO_SUCCESS_START: {
      return {
        ...state,
        getDriverInfoResultData: "",
        getDriverInfoResultMessage: "",
      };
    }

    case GET_ORDERS_SUCCESS_START: {
      return {
        ...state,
        getOrdersResultData: "",
        getOrdersResultMessage: "",
      };
    }

    case CHANGE_ORDERS_STATE_SUCCESS: {
      return {
        ...state,
        changeOrderStateResultMessage: action.payload.message,
      };
    }

    case CHANGE_ORDERS_STATE_SUCCESS_START: {
      return {
        ...state,
        isChangeOrderStateLoading: action.payload,
      };
    }

    case CHANGE_ORDERS_STATE_SUCCESS_END: {
      return {
        ...state,
        changeOrderStateResultMessage: "",
      };
    }

    case ADD_REVIEW_SUCCESS: {
      return {
        ...state,
        addReviewResultData: action.payload.data,
        addReviewResultMessage: action.payload.message,
      };
    }

    case ADD_REVIEW_SUCCESS_START: {
      return {
        ...state,
        isAddReviewLoading: action.payload,
      };
    }

    case ADD_REVIEW_SUCCESS_END: {
      return {
        ...state,
        addReviewResultMessage: "",
      };
    }
    default:
      return state;
  }
};
