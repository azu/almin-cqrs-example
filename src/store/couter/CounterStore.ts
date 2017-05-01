// MIT © 2017 azu
"use strict";
import { CounterState } from "./CounterState";
import { AppRepository } from "../../repository/AppRepository";
import { Store, DispatchedPayload } from "almin";

export class CounterStore extends Store<CounterState> {
    state: CounterState;
    private appRepository: AppRepository;

    constructor({ appRepository }: { appRepository: AppRepository }) {
        super();
        this.state = new CounterState({
            count: 0,
            history: []
        });
        this.appRepository = appRepository;
    }

    receivePayload(payload: DispatchedPayload) {
        const app = this.appRepository.get();
        const domainToState = this.state.update({ counter: app.counter });
        const nextState = domainToState.reduce(payload);
        this.setState(nextState);
    }

    getState() {
        return this.state;
    }
}