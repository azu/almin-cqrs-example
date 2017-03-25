import { Counter } from "./counter/Counter";
export class App {
    readonly counter: Counter;
    readonly id = "App";

    constructor({counter}: {counter: Counter}) {
        this.counter = counter;
    }
}