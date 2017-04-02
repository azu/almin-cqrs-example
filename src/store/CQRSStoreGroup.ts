// MIT © 2017 azu
"use strict";
import * as assert from "assert";
import { Store, Payload, DidExecutedPayload, CompletedPayload, DispatcherPayloadMeta, ErrorPayload } from "almin";
import { AppChangePayload } from "../AppChangePayload";
import MapLike from "map-like";
const CHANGE_STORE_GROUP = "CHANGE_STORE_GROUP";
/**
 * onChange flow
 * https://code2flow.com/N5yToZ
 */
export class CQRSStoreGroup extends Store {
    public stores: Array<Store>;
    // current changing stores for emitChange
    private _changingStores: Array<Store> = [];
    // all functions to release handlers
    private _releaseHandlers: Array<Function> = [];

    constructor(stores: Array<Store>) {
        super();
        this.stores = stores;

        // Implementation Note:
        // Dispatch -> pipe -> Store#emitChange() if it is needed
        //          -> this.onDispatch -> If anyone store is changed, this.emitChange()
        // each pipe to dispatching
        stores.forEach(store => {
            this._registerStore(store);
            // delegate dispatching
            const pipeHandler = this.pipe(store);
            this._releaseHandlers.push(pipeHandler);
        });
        // after dispatching, and then emitChange
        this._startObservePayload();
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
        this.emit(CHANGE_STORE_GROUP, this._changingStores.slice());
        this._pruneChangingStores();
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
        this._pruneChangingStores();
    }

    /**
     * register store and listen onChange.
     * If you release store, and do call `release` method.
     * @param {Store} store
     * @private
     */
    private _registerStore(store: Store): void {
        // If anyone store is changed, will call `emitChange()`.
        // It is means that
        // 1. UseCase#dispatch -> Store#onDispatch
        // 2. Store#emitChange -> Store#onChange
        // 3. StoreGroup#emitChange -> Context#onChange
        // 4. Context#getState -> get change state by dispatched
        const releaseOnChangeHandler = store.onChange(() => {
            this._addChangingStore(store);
        });
        // add release handler
        this._releaseHandlers.push(releaseOnChangeHandler);
    }

    // register changed events
    _startObservePayload(): void {
        const useCaseFinishedMap = new MapLike<string, boolean>();
        const observeChangeHandler = (payload: Payload, meta: DispatcherPayloadMeta) => {
            if (!meta.isTrusted) {
                this.emitChange();
            } else if (payload instanceof AppChangePayload) {
                this.emitChange();
            } else if (payload instanceof ErrorPayload) {
                this.emitChange(); // MayBe
            } else if (payload instanceof DidExecutedPayload && meta.useCase && meta.isUseCaseFinished) {
                useCaseFinishedMap.set(meta.useCase.id, true);
                this.emitChange(); // MayBe
            } else if (payload instanceof CompletedPayload && meta.useCase && meta.isUseCaseFinished) {
                // if the useCase is already finished, doesn't emitChange in CompletedPayload
                if (useCaseFinishedMap.has(meta.useCase.id)) {
                    useCaseFinishedMap.delete(meta.useCase.id);
                    return;
                }
                this.emitChange(); // MayBe
            }
        };
        const releaseHandler = this.onDispatch(observeChangeHandler);
        this._releaseHandlers.push(releaseHandler);
    }

    private _addChangingStore(store: Store) {
        this._changingStores.push(store);
    }

    private _pruneChangingStores() {
        this._changingStores = [];
    }

}
