import React, { useEffect } from "react";
import { Alert } from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducers from "./src/reducers/index";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MainApp from "./src/MainApp";

import * as WeChat from "react-native-wechat-lib";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

function App() {
  useEffect(() => {
    console.log("test start");

    WeChat.registerApp("wx25609b0762f5450c", "https://efreshgo.com/client/")
      .then((registerApp) => {
        console.log("registerApp ahhahahahhahahha", registerApp);
      })
      .catch((error) => {
        console.log("error", error);
      });
    // WeChat.openWXApp();
    console.log("test end");
  }, []);
  return (
    <ActionSheetProvider>
      <Provider store={store}>
        <MainApp />
      </Provider>
    </ActionSheetProvider>
  );
}

export default App;
