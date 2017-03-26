// MIT © 2017 azu
import { Store } from "almin";
import { AppState } from "./AppState";
import { AppRepository } from "../../repository/AppRepository";
export class AppStore extends Store {
    state: AppState;
    appRepository: AppRepository;

    constructor({appRepository} : {appRepository: AppRepository}) {
        super();
        this.state = new AppState({
            isLoading: false
        });
        this.appRepository = appRepository;
        this.onDispatch((payload) => {
            const newState = this.state.reduce(payload);
            if (newState.equals(this.state)) {
                return;
            }
            this.state = newState;
            this.emitChange();
        })
    }

    getState() {
        return {
            appState: this.state
        };
    }
}