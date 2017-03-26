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

export interface AppStoreGroupState {
    appState: AppState;
    counterState: CounterState;
}

export class AppStoreGroup {
    static create() {
        return new QueuedStoreGroup([
            new AppStore({appRepository}),
            new CounterStore({appRepository})
        ]);
    }
}