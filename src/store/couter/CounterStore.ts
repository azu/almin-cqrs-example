// MIT © 2017 azu
"use strict";
import { CounterState } from "./CounterState";
import { AppRepository } from "../../repository/AppRepository";
import { Store, Payload } from "almin";

export class CounterStore extends Store {
    private appRepository: AppRepository;
    state: CounterState;

    constructor({ appRepository }: { appRepository: AppRepository }) {
        super();
        this.state = new CounterState({
            count: 0,
            history: []
        });
        this.appRepository = appRepository;
    }

    // 更新したstateを返す
    getState(...args: Array<any>): any; // TODO: hack will be removed
    getState({ counterState = this.state }, payload: Payload): { counterState: CounterState } {
        const app = this.appRepository.get();
        const domainToState = counterState.update({ counter: app.counter });
        const nextState = domainToState.reduce(payload);
        return {
            counterState: nextState
        };
    }
}