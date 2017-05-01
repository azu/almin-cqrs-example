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
    appState: new AppStore(),
    counterState: new CounterStore({ appRepository })
};
// state mapping
const stateMapping = StoreGroupTypes.StoreToState(storeMapping);
export type AppStoreGroupState = typeof stateMapping;

export class AppStoreGroup {
    static create() {
        return new StoreGroup(storeMapping);
    }
}