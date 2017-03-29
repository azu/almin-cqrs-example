// LICENSE : MIT
"use strict";
import React from "react"
import { Context } from "almin"
import { createIncrementalCounterUseCase } from "../use-case/counter/IncrementalCounterUseCase"
import { createDecrementalCounterUseCase } from "../use-case/counter/DecrementalCounterUseCase"
import { createRandomCounterUseCase } from "../use-case/counter/RandomCounterUseCase";
import { UpdateLoadingStatusUseCase, UpdateLoadingStatusUseCaseArgs } from "../use-case/app/UpdateLoadingStatusUseCase";
export interface CounterComponentProps {
    count: number;
    context: Context;
}
export default class CounterComponent extends React.Component<CounterComponentProps, any> {
    render() {
        const { context } = this.props;
        const increment = () => {
            context.useCase(createIncrementalCounterUseCase()).execute();
        };
        const decrement = () => {
            context.useCase(createDecrementalCounterUseCase()).execute();
        };
        const random = () => {
            const callback = () => {
                return context.useCase(UpdateLoadingStatusUseCase).execute<UpdateLoadingStatusUseCaseArgs>({
                    isLoading: false
                });
            };
            context.useCase(UpdateLoadingStatusUseCase).execute<UpdateLoadingStatusUseCaseArgs>({
                isLoading: true
            }).then(() => {
                return context.useCase(createRandomCounterUseCase()).execute();
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