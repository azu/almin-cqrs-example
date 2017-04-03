// MIT © 2017 azu
"use strict";
import { ReduceState } from "almin-reduce-store";
import { Counter } from "../../domain/counter/Counter";
export interface CounterStateLike {
    count: number;
    history: Array<number>;
}

export class CounterState extends ReduceState implements CounterStateLike {
    count: number;
    history: Array<number>;

    constructor(state: CounterStateLike) {
        super();
        this.count = state.count;
        this.history = state.history;
    }

    update({ counter }: { counter: Counter }): CounterState {
        return new CounterState({
            ...this as CounterStateLike,
            count: counter.count,
            history: counter.history
        });
    }
}