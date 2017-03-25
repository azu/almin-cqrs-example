// MIT © 2017 azu
"use strict";
import { Counter } from "../../domain/counter/Counter";
export interface CounterStateLike {
    count: number;
}

export class CounterState implements CounterStateLike {
    count: number;

    constructor(state: CounterStateLike) {
        this.count = state.count;
    }

    update({counter}: {counter: Counter}): CounterState {
        return new CounterState({
            count: counter.count
        });
    }

    /**
     * Compare `this` properties and `targetState` properties
     * If all properties is matched, return true.
     */
    equals(targetState: this) {
        if (this === targetState) {
            return true;
        }
        return Object.keys(this).every((key) => {
            return (<any>this)[key] === (<any>targetState)[key];
        });
    }
}