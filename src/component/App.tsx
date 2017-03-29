// LICENSE : MIT
"use strict";
import React from "react";
import Counter from './Counter';
import Loading from './Loading/Loading';
import { Context, Payload, Dispatcher, DispatcherPayloadMeta } from "almin";
const AlminLogger = require("almin-logger");
import { AppUseCaseType, AppUseCase } from "../use-case/AppUseCase";
import { AppStoreGroup } from "../store/AppStoreGroup";
import { AppStoreGroupState } from "../store/AppStoreGroup";
import { DispatchedPayload } from "almin/lib/Dispatcher";
const store = AppStoreGroup.create();
const context = new Context({
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
        // UseCase#changed -> Update State
        context.onDispatch((payload: Payload) => {
            if (payload.type === AppUseCaseType) {
                this.setState(context.getState());
            }
        });
        context.onCompleteEachUseCase((_, meta) => {
            if (meta.useCase instanceof AppUseCase) {
                this.setState(context.getState());
            }
        });
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
