// MIT © 2017 azu
"use strict";
export class Counter {
    public count = 0;
    public id = "Counter";

    random() {
        this.count = Math.round(Math.random() * Math.random() * 100);
    }

    increment() {
        this.count += 1;
    }

    decrement() {
        this.count -= 1;
    }
}