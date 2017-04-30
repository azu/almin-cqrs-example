// MIT © 2017 azu
import { AppState } from "./AppState";
import { AppRepository } from "../../repository/AppRepository";
import { Store, DispatchedPayload } from "almin";
export class AppStore extends Store<AppState> {
    state: AppState;
    appRepository: AppRepository;

    constructor({ appRepository }: { appRepository: AppRepository }) {
        super();
        this.state = new AppState({
            isLoading: false
        });
        this.appRepository = appRepository;
    }

    receivePayload(payload: DispatchedPayload) {
        this.setState(this.state.reduce(payload));
    }

    getState() {
        return this.state;
    }
}