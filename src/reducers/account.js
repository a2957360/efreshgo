import {
  SET_LANGUAGE_SUCCESS,
  SET_DELIVERY_TIME_SUCCESS,
  SET_DELIVERY_DATE_SUCCESS,
  GET_VERIFICATION_CODE_SUCCESS,
  CHECK_VERIFICATION_CODE_SUCCESS,
  SET_STORE_SUCCESS,
  GET_STORE_SUCCESS,
  SET_CURRENT_LOCATION_SUCCESS,
  FETCH_VERIFICATIONCODE_RESULT_DATA_START,
  FETCH_CHECK_VERIFICATIONCODE_RESULT_DATA_START,
  FETCH_GET_VERIFICATIONCODE_RESULT_DATA_END,
  FETCH_CHECK_VERIFICATIONCODE_RESULT_DATA_END,
  GET_USER_INFO_SUCCESS,
  UPDATE_USER_INFO_SUCCESS,
  UPDATE_USER_INFO_SUCCESS_END,
  SET_DELIVER_ADDRESS,
  CLEAR_USER_INFO,
  SET_STORE_SUCCESS_LOADING,
  THIRDPARTY_LOGIN,
  CLEAR_REDUX_DELIVERY_TIME_DATE,
  SET_LOGIN_LOADING
} from "../constants/ActionTypes";

const INIT_STATE = {
  language: "En",
  getVerificationCodeResult: "",
  checkVerificationCodeResult: "",
  userInfo: "",
  updateUserInfoResultMessage: "",
  deliveryStore: "",
  deliverAddress: "",
  deliveryTime: "",
  deliveryDate: "",
  storeList: [],
  isSetStoreSuccessLoading: false,
  isLoginLoading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_LANGUAGE_SUCCESS: {
      return {
        ...state,
        language: action.payload,
      };
    }

    case SET_LOGIN_LOADING: {
      return {
        ...state,
        isLoginLoading: action.payload,
      };
    }

    case SET_CURRENT_LOCATION_SUCCESS: {
      return {
        ...state,
        currentLocation: action.payload,
      };
    }

    case SET_STORE_SUCCESS: {
      return {
        ...state,
        deliveryStore: action.payload,
      };
    }
    case GET_STORE_SUCCESS: {
      return {
        ...state,
        storeList: action.payload.data,
      };
    }
    case SET_DELIVERY_TIME_SUCCESS: {
      return {
        ...state,
        deliveryTime: action.payload,
      };
    }

    case SET_DELIVERY_DATE_SUCCESS: {
      return {
        ...state,
        deliveryDate: action.payload,
      };
    }

    case GET_VERIFICATION_CODE_SUCCESS: {
      return {
        ...state,
        getVerificationCodeResult: action.payload,
      };
    }

    case CHECK_VERIFICATION_CODE_SUCCESS: {
      return {
        ...state,
        checkVerificationCodeResult: action.payload.message,
        userInfo: action.payload.data,
      };
    }

    case FETCH_VERIFICATIONCODE_RESULT_DATA_START: {
      return {
        ...state,
        getVerificationCodeResult: null,
      };
    }

    case FETCH_GET_VERIFICATIONCODE_RESULT_DATA_END: {
      return {
        ...state,
        getVerificationCodeResult: null,
      };
    }

    case FETCH_CHECK_VERIFICATIONCODE_RESULT_DATA_START: {
      return {
        ...state,
        checkVerificationCodeResult: null,
      };
    }
    case FETCH_CHECK_VERIFICATIONCODE_RESULT_DATA_END: {
      return {
        ...state,
        checkVerificationCodeResult: null,
      };
    }
    case GET_USER_INFO_SUCCESS: {
      return {
        ...state,
        userInfo: action.payload.data,
      };
    }
    case UPDATE_USER_INFO_SUCCESS: {
      return {
        ...state,
        userInfo: action.payload.data[0],
        updateUserInfoResultMessage: action.payload.message,
      };
    }

    case UPDATE_USER_INFO_SUCCESS_END: {
      return {
        ...state,
        updateUserInfoResultMessage: null,
      };
    }

    case SET_DELIVER_ADDRESS: {
      return {
        ...state,
        deliverAddress: action.payload,
      };
    }

    case CLEAR_USER_INFO: {
      return {
        ...state,
        userInfo: null,
      };
    }

    case SET_STORE_SUCCESS_LOADING: {
      return {
        ...state,
        isSetStoreSuccessLoading: action.payload,
      };
    }

    case THIRDPARTY_LOGIN: {
      return {
        ...state,
        checkVerificationCodeResult: action.payload.message,
        userInfo: action.payload.data,
      };
    }

    case CLEAR_REDUX_DELIVERY_TIME_DATE: {
      return {
        ...state,
        deliveryDate: "",
        deliveryTime: "",
      };
    }

    default:
      return state;
  }
};
