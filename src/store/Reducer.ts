import { Payload, Store } from "almin";
/**
 * Internal Payload
 */
class InitPayload extends Payload {
    constructor() {
        super({ type: "@@init" });
    }
}
/**
 * Redux reducer-like Store implementation
 */
export abstract class Reducer<T> extends Store<T> {
    state: T;

    abstract reduce(prevState: T | undefined, payload: Payload): T;

    constructor() {
        super();
        this.state = this.reduce(undefined, new InitPayload());
    }

    receivePayload(payload: Payload) {
        this.setState(this.reduce(this.state, payload));
    }

    getState() {
        return this.state;
    }
}