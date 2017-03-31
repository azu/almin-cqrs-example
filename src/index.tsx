// MIT © 2017 azu
"use strict";
import React from "react";
import ReactDOM from "react-dom";
import AppLocator from "./AppLocator";
import { App } from "./component/App"
import { Context, Dispatcher } from "almin";
import AlminReactContaine from "almin-react-container";
import { AppStoreGroup } from "./store/AppStoreGroup";
import { Changdable } from "./use-case/AppUseCase";
const AlminLogger = require("almin-logger");
const store = AppStoreGroup.create();
const ChangedableContext = Changdable(Context);
const context = new ChangedableContext({
    dispatcher: new Dispatcher(),
    store
});
// set context
AppLocator.context = context;

const logger = new AlminLogger();
logger.startLogging(context);

const RootContainer = AlminReactContaine.create<AppStoreGroup>(App, context);
ReactDOM.render(<RootContainer />, document.getElementById("js-app"));