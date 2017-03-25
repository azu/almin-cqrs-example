// LICENSE : MIT
"use strict";
import React from "react";
import Counter from './Counter';
import { Context, Payload, Dispatcher } from "almin";
const AlminLogger = require("almin-logger");
import { CounterState } from "../store/couter/CounterState";
import { AppUseCaseType, AppUseCase } from "../use-case/AppUseCase";
interface AppProps {
    context: Context;
}
interface AppState {
    counterState: CounterState
}

// context
import AppStore from "../store/AppStore";
const store = AppStore.create();
const context = new Context({
    dispatcher: new Dispatcher(),
    store
});

const logger = new AlminLogger();
logger.startLogging(context);

export default class App extends React.Component<AppProps, AppState> {
    constructor() {
        super();
        this.state = context.getState<AppState>();
    }

    componentDidMount() {
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
        return <Counter count={counterState.count} context={context}/>
    }
}
