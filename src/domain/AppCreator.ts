import { Counter } from "./counter/Counter";
import { App } from "./App";
export class AppCreator {
    static create() {
        return new App({
            counter: new Counter
        });
    }
}