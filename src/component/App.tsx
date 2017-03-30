// LICENSE : MIT
"use strict";
import React from "react";
import { Context, Dispatcher } from "almin";
const AlminLogger = require("almin-logger");
import Counter from './Counter';
import Loading from './Loading/Loading';
import { Changdable } from "../use-case/AppUseCase";
import { AppStoreGroup } from "../store/AppStoreGroup";
import { AppStoreGroupState } from "../store/AppStoreGroup";
const store = AppStoreGroup.create();
const ChangedableContext = Changdable(Context);
const context = new ChangedableContext({
    dispatcher: new Dispatcher(),
    store
});

const logger = new AlminLogger();
logger.startLogging(context);

export default class App extends React.Component<{}, AppStoreGroupState> {
    constructor() {
        super();
        this.state = context.getState<AppStoreGroupState>();
    }

    componentDidMount() {
        // when change store, update component
        const onChangeHandler = () => {
            this.setState(context.getState());
        };
        context.onChange(onChangeHandler);
    }

    render() {
        const counterState = this.state.counterState;
        return <div>
            <Counter count={counterState.count} context={context} />
            <Loading hidden={!this.state.appState.isLoading} />
        </div>
    }
}
