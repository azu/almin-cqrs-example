// MIT © 2017 azu
import { ReduceStore } from 'almin-reduce-store/lib';
import { AppState } from "./AppState";
import { AppRepository } from "../../repository/AppRepository";
export class AppStore extends ReduceStore {
    state: AppState;
    appRepository: AppRepository;

    constructor({ appRepository }: { appRepository: AppRepository }) {
        super();
        this.state = new AppState({
            isLoading: false
        });
        this.appRepository = appRepository;
        this.onDispatch((payload) => {
            const newState = this.state.reduce(payload);
            this.setState(newState);
        });
    }

    getState() {
        return {
            appState: this.state
        };
    }
}