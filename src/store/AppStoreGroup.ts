// MIT © 2017 azu
"use strict";
import { StoreGroup, StoreGroupTypes } from "almin";
// repository
import { appRepository } from "../repository/AppRepository";
// store
import { CounterStore } from "./couter/CounterStore";
import { AppStore } from "./app/AppStore";
// store mapping
const storeMapping = {
    appState: new AppStore({ appRepository }),
    counterState: new CounterStore({ appRepository })
};
function StoreToState<T>(mapping: StoreGroupTypes.StoreMap<T>): StoreGroupTypes.StateMap<T> {
    return mapping as any;
}
// state mapping
const stateMapping = StoreToState(storeMapping);
export type AppStoreGroupState = typeof stateMapping;

export class AppStoreGroup {
    static create() {
        return new StoreGroup(storeMapping);
    }
}