// MIT © 2017 azu
"use strict";
export class Counter {
    public count = 0;
    public id = "Counter";

    history: Array<number> = [];

    setCount(count: number): void {
        this.history.push(count);
        this.count = count;
    }

    random() {
        this.setCount(Math.round(Math.random() * Math.random() * 100));
    }

    increment() {
        this.setCount(this.count + 1);
    }

    decrement() {
        this.setCount(this.count - 1);
    }
}