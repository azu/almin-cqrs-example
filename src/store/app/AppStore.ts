// MIT © 2017 azu
import { AppState } from "./AppState";
import { AppRepository } from "../../repository/AppRepository";
import { Store, Payload } from "almin";
export class AppStore extends Store {
    state: AppState;
    appRepository: AppRepository;

    constructor({ appRepository }: { appRepository: AppRepository }) {
        super();
        this.state = new AppState({
            isLoading: false
        });
        this.appRepository = appRepository;
    }

    getState(...args: Array<any>): any; // TODO: hack will be removed
    getState({
        appState = this.state
    }, payload: Payload): { appState: AppState } {
        const payloadToState = appState.reduce(payload);
        return {
            appState: payloadToState
        };
    }
}