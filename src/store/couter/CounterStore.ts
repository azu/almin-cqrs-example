// MIT © 2017 azu
"use strict";
import { ReduceStore } from 'almin-reduce-store/lib';
import { CounterState } from "./CounterState";
import { AppRepository } from "../../repository/AppRepository";
export class CounterStore extends ReduceStore {
    private appRepository: AppRepository;
    state: CounterState;

    constructor({ appRepository }: { appRepository: AppRepository }) {
        super();
        this.state = new CounterState({
            count: 0
        });
        this.appRepository = appRepository;
        this.onDispatch(payload => this.setState(this.state.reduce(payload)));
    }

    getState(): { counterState: CounterState } {
        const app = this.appRepository.get();
        return {
            counterState: this.state.update({
                counter: app.counter
            })
        };
    }
}