// MIT © 2017 azu
"use strict";
import * as assert from "assert";
import { Store, Payload, DidExecutedPayload, CompletedPayload } from "almin";
import { AppChangePayload } from "../AppChangePayload";
const CHANGE_STORE_GROUP = "CHANGE_STORE_GROUP";
export class CQRSStoreGroup extends Store {
    public stores: Array<Store>;
    private _releaseHandlers: Array<Function> = [];

    constructor(stores: Array<Store>) {
        super();
        this.stores = stores;
        this._startObservePayload();
        stores.forEach(store => {
            this._registerStore(store);
        });
    }

    /**
     * return the state object that merge each stores's state
     * @returns {Object} merged state object
     * @public
     */
    getState<T>(): T {
        const stateMap = this.stores.map(store => {
            const nextState = store.getState();
            if (process.env.NODE_ENV !== "production") {
                assert.ok(typeof nextState == "object", `${store}: ${store.name}.getState() should return Object.
e.g.)

 class ExampleStore extends Store {
     getState(prevState) {
         return {
            StateName: state
         };
     }
 }
 
Then, use can access by StateName.

StoreGroup#getState()["StateName"]; // state

`);
            }
            return nextState;
        });
        return Object.assign({}, ...stateMap);
    }

    /**
     * emit change event
     * @public
     */
    emitChange(): void {
        this.emit(CHANGE_STORE_GROUP, this.stores.slice());
    }

    /**
     * listen changes of the store group.
     * @param {function(stores: Store[])} handler the callback arguments is array of changed store.
     * @returns {Function} call the function and release handler
     * @public
     */
    onChange(handler: (stores: Array<Store>) => void): () => void {
        this.on(CHANGE_STORE_GROUP, handler);
        const releaseHandler = this.removeListener.bind(this, CHANGE_STORE_GROUP, handler);
        this._releaseHandlers.push(releaseHandler);
        return releaseHandler;
    }

    /**
     * release all events handler.
     * You can call this when no more call event handler
     * @public
     */
    release(): void {
        this._releaseHandlers.forEach(releaseHandler => releaseHandler());
        this._releaseHandlers.length = 0;
    }

    /**
     * register store and listen onChange.
     * If you release store, and do call {@link release} method.
     * @param {Store} store
     * @private
     */
    private _registerStore(store: Store) {
        // if anyone store is changed, will call `emitChange()`.
        const releaseOnChangeHandler = store.onChange(() => {
            this.emit(CHANGE_STORE_GROUP, [store]);
        });
        // Implementation Note:
        // Delegate dispatch event to Store from StoreGroup
        // Dispatcher -> StoreGroup -> Store
        const releaseOnDispatchHandler = this.pipe(store);
        // add release handler
        this._releaseHandlers = this._releaseHandlers.concat([releaseOnChangeHandler, releaseOnDispatchHandler]);
    }

    // register changed events
    _startObservePayload() {
        this.onDispatch((payload: Payload | AppChangePayload) => {
            if (payload instanceof DidExecutedPayload
                || payload instanceof CompletedPayload
                || payload instanceof AppChangePayload) {
                this.emitChange();
            }
        });
    }
}
