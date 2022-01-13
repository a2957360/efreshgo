import { GET_CONTACT_US_SUCCESS } from "../constants/ActionTypes";

const INIT_STATE = {
  getContactUsResultData: "",
  getContactUsResultMessage: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CONTACT_US_SUCCESS: {
      return {
        ...state,
        getContactUsResultData: action.payload.data,
        getContactUsResultMessage: action.payload.message,
      };
    }

    default:
      return state;
  }
};
