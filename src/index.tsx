// MIT © 2017 azu
"use strict";
import React from "react";
import ReactDOM from "react-dom";
import AppLocator from "./AppLocator";
import { App } from "./component/App"
import { Context, Dispatcher } from "almin";
import AlminReactContainer from "almin-react-container";
import { AppStoreGroup } from "./store/AppStoreGroup";
const AlminDevTools = require("almin-devtools");
const store = AppStoreGroup.create();
const context = new Context({
    dispatcher: new Dispatcher(),
    store
});
// set context
AppLocator.context = context;
// logger
if (process.env.NODE_ENV !== "production") {
    const devTools = new AlminDevTools(context);
    devTools.connect();
    devTools.init(context.getState());
}

const RootContainer = AlminReactContainer.create<AppStoreGroup>(App, context);
ReactDOM.render(<RootContainer />, document.getElementById("js-app"));