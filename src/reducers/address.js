import {
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_SUCCESS_END,
  GET_ADDRESS_SUCCESS,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_SUCCESS_END,
  SET_ADDRESS_DEFAULT_SUCCESS,
  SET_ADDRESS_GEOMETRY_SUCCESS,
  SET_SELECTED_ADDRESS_SUCCESS,
} from "../constants/ActionTypes";

const INIT_STATE = {
  addAddressResultMessage: "",
  getAddressResult: "",
  getAddressResultData: "",
  deleteAddressResultMessage: "",
  selectedAddress: "",
  addAddressResultData: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_ADDRESS_SUCCESS: {
      return {
        ...state,
        addAddressResultMessage: action.payload.message,
        addAddressResultData: action.payload.data,
      };
    }
    case ADD_ADDRESS_SUCCESS_END: {
      return {
        ...state,
        addAddressResultMessage: null,
      };
    }
    case GET_ADDRESS_SUCCESS: {
      return {
        ...state,
        getAddressResultData: action.payload.data,
      };
    }
    case DELETE_ADDRESS_SUCCESS: {
      return {
        ...state,
        deleteAddressResultMessage: action.payload.message,
      };
    }
    case DELETE_ADDRESS_SUCCESS_END: {
      return {
        ...state,
        deleteAddressResultMessage: null,
      };
    }
    case SET_ADDRESS_DEFAULT_SUCCESS: {
      return {
        ...state,
        setAddressDefaultResultMessage: action.payload.message,
      };
    }

    case SET_ADDRESS_GEOMETRY_SUCCESS: {
      return {
        ...state,
        addressGeometry: action.payload,
      };
    }

    case SET_SELECTED_ADDRESS_SUCCESS: {
      console.log(9996,action.payload)
      return {
        ...state,
        selectedAddress: action.payload,
      };
    }

    default:
      return state;
  }
};
