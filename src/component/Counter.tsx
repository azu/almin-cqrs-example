// LICENSE : MIT
"use strict";
import React from "react"
import IncrementalCounterUseCase from "../use-case/IncrementalCounterUseCase"
import DecrementalCounterUseCase from "../use-case/DecrementalCounterUseCase"
import { Context } from "almin"
import RandomCounterUseCase from "../use-case/RandomCounterUseCase";
import UpdateLoadingStatusUseCase from "../use-case/app/UpdateLoadingStatusUseCase";
export interface CounterComponentProps {
    count: number;
    context: Context;
}
export default class CounterComponent extends React.Component<CounterComponentProps, any> {
    render() {
        const {context} = this.props;
        const increment = () => {
            context.useCase(new IncrementalCounterUseCase()).execute();
        };
        const decrement = () => {
            context.useCase(new DecrementalCounterUseCase()).execute();
        };
        const random = () => {
            const callback = () => {
                return context.useCase(new UpdateLoadingStatusUseCase()).execute(false);
            };
            context.useCase(new UpdateLoadingStatusUseCase()).execute(true).then(() => {
                return context.useCase(new RandomCounterUseCase()).execute();
            }).then(callback, callback)
        };
        return (
            <div>
                <button onClick={increment}>Counter ++</button>
                <button onClick={decrement}>Counter --</button>
                <button onClick={random}>Random Counter</button>
                <p>
                    Count: {this.props.count}
                </p>
            </div>
        );
    }
};