// MIT © 2017 azu
"use strict";
import * as assert from "assert";
import {
    Store,
    DispatcherPayloadMeta,
    Payload,
    WillExecutedPayload,
    DidExecutedPayload,
    CompletedPayload,
    ErrorPayload
} from "almin";
import { AppChangePayload } from "../AppChangePayload";
import MapLike from "map-like";
import { shallowEqual } from "./shallowEqual";
const CHANGE_STORE_GROUP = "CHANGE_STORE_GROUP";

/**
 * onChange flow
 * https://code2flow.com/UOdnfN
 */
export class CQRSStoreGroup extends Store {
    public stores: Array<Store>;
    // current changing stores for emitChange
    public changingStores: Array<Store> = [];
    // current state
    private state: any;
    // all functions to release handlers
    private _releaseHandlers: Array<Function> = [];
    // already finished UseCase Map
    private _finishedUseCaseMap: MapLike<string, boolean>;
    // current working useCase
    private _workingUseCaseMap: MapLike<string, boolean>;

    constructor(stores: Array<Store>) {
        super();
        this.stores = stores;
        this._workingUseCaseMap = new MapLike<string, boolean>();
        this._finishedUseCaseMap = new MapLike<string, boolean>();
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
        // default state
        this.state = this.collectState();
    }

    /**
     * return the state object that merge each stores's state
     * @returns {Object} merged state object
     * @public
     */
    getState<T>(): T {
        return this.state as T;
    }

    // actually getState
    private collectState<T>(): T {
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
     * Use `shouldStoreChange()` to let StoreGroup know if a event is not affected.
     * The default behavior is to emitChange on every life-cycle change, and in the vast majority of cases you should rely on the default behavior.
     *
     * @returns {boolean}
     * @example
     *
     * Want to emitChange if actually changingStore that called `Store#emitChange` is larger than 0.
     * shouldStoreChange(_, _){
     *    return changingStores.length > 0;
     * }
     */
    shouldStoreChange(prevState: any, nextState: any) {
        return !shallowEqual(prevState, nextState);
    }

    /**
     * emit change event
     * @public
     */
    emitChange(): void {
        const prevState = this.state;
        const nextState = this.collectState();
        if (this.shouldStoreChange(prevState, nextState)) {
            this.state = nextState;
            this.emit(CHANGE_STORE_GROUP, this.changingStores.slice());
            this._pruneChangingStores();
        }
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
        this.state = null;
        this._pruneChangingStores();
    }

    /**
     * register store and listen onChange.
     * If you release store, and do call `release` method.
     * @param {Store} store
     * @private
     */
    private _registerStore(store: Store): void {
        const releaseOnChangeHandler = store.onChange(() => {
            this._addChangingStore(store);
            // if not exist working UseCases, immediate invoke emitChange.
            if (!this.existWorkingUseCase) {
                this.emitChange();
            }
        });
        // add release handler
        this._releaseHandlers.push(releaseOnChangeHandler);
    }

    // register changed events
    _startObservePayload(): void {
        const observeChangeHandler = (payload: Payload, meta: DispatcherPayloadMeta) => {
            if (!meta.isTrusted) {
                this.emitChange();
            } else if (payload instanceof AppChangePayload) {
                this.emitChange(); // should be force
            } else if (payload instanceof ErrorPayload) {
                this.emitChange();
            } else if (payload instanceof WillExecutedPayload && meta.useCase) {
                this._workingUseCaseMap.set(meta.useCase.id, true);
            } else if (payload instanceof DidExecutedPayload && meta.useCase && meta.isUseCaseFinished) {
                this._finishedUseCaseMap.set(meta.useCase.id, true);
                this.emitChange(); // MayBe
            } else if (payload instanceof CompletedPayload && meta.useCase && meta.isUseCaseFinished) {
                this._workingUseCaseMap.delete(meta.useCase.id);
                // if the useCase is already finished, doesn't emitChange in CompletedPayload
                if (this._finishedUseCaseMap.has(meta.useCase.id)) {
                    this._finishedUseCaseMap.delete(meta.useCase.id);
                    return;
                }
                this.emitChange(); // MayBe
            }
        };
        const releaseHandler = this.onDispatch(observeChangeHandler);
        this._releaseHandlers.push(releaseHandler);
    }

    /**
     * if exist working UseCase, return true
     * @returns {boolean}
     */
    private get existWorkingUseCase() {
        return this._workingUseCaseMap.size > 0;
    }

    private _addChangingStore(store: Store) {
        this.changingStores.push(store);
    }

    private _pruneChangingStores() {
        this.changingStores = [];
    }

}
