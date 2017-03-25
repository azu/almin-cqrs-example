// MIT © 2017 azu
"use strict";
import { QueuedStoreGroup } from "almin";
import { CounterStore } from "./couter/CounterStore";
// repository
import { appRepository } from "../repository/AppRepository";
export default class AppStore {
    static create() {
        return new QueuedStoreGroup([
            new CounterStore({appRepository})
        ]);
    }
}