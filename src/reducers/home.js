import { GET_HOME_PAGE_LAYOUT_SUCCESS,GET_HOME_PAGE_LAYOUT_START,SET_SEND_NOTIFICATION_FLAG_SUCCESS } from "../constants/ActionTypes";

const INIT_STATE = {
  getHomePageLayoutResultData: "",
  getHomePageLayoutResultMessage: "",
  isFirstTimeSendNotificationToken: true
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_HOME_PAGE_LAYOUT_SUCCESS: {
      return {
        ...state,
        getHomePageLayoutResultData: action.payload.data,
        getHomePageLayoutResultMessage: action.payload.message,
      };
    }

    case GET_HOME_PAGE_LAYOUT_START: {
      return {
        ...state,
        getHomePageLayoutResultData: "",
        getHomePageLayoutResultMessage: "",
      };
    }

    case SET_SEND_NOTIFICATION_FLAG_SUCCESS: {
      return {
        ...state,
        isFirstTimeSendNotificationToken: action.payload,
      };
    }

    default:
      return state;
  }
};
