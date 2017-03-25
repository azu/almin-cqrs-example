// MIT © 2017 azu
"use strict";
import { Store } from "almin";
import { CounterState } from "./CounterState";
import { AppRepository } from "../../repository/AppRepository";
export class CounterStore extends Store {
    private appRepository: AppRepository;
    private state: CounterState;

    constructor({appRepository}: {appRepository: AppRepository}) {
        super();
        this.state = new CounterState({
            count: 0
        });
        this.appRepository = appRepository;
    }

    getState(): {counterState: CounterState} {
        const app = this.appRepository.get();
        const newState = this.state.update({
            counter: app.counter
        });
        if (newState.equals(this.state)) {
            return {
                counterState: this.state
            };
        }
        return {
            counterState: newState
        };
    }
}