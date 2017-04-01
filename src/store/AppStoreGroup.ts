// MIT © 2017 azu
"use strict";
import { QueuedStoreGroup } from "almin";
// repository
import { appRepository } from "../repository/AppRepository";
// store
import { CounterStore } from "./couter/CounterStore";
import { CounterState } from "./couter/CounterState";
import { AppStore } from "./app/AppStore";
import { AppState } from "./app/AppState";
import { Store, Payload } from "almin";
import { AppChangePayload } from "../AppChangePayload";
function wrapAddedChangeHandler(stores: Store[]) {
    stores.forEach((store: Store) => {
        store.onDispatch((payload: Payload | AppChangePayload) => {
            if (payload instanceof AppChangePayload) {
                store.emitChange();
            }
        });
    });
    return stores;
}

export interface AppStoreGroupState {
    appState: AppState;
    counterState: CounterState;
}

export class AppStoreGroup {
    static create() {
        return new QueuedStoreGroup(wrapAddedChangeHandler([
            new AppStore({ appRepository }),
            new CounterStore({ appRepository })
        ]));
    }
}