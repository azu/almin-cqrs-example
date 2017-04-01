import { AppStateLike } from './AppState';
// MIT © 2017 azu
import { UpdateLoadingStatusUseCasePayload } from "../../use-case/app/UpdateLoadingStatusUseCase";
import { Payload } from "almin";
export interface AppStateLike {
    isLoading: boolean;
}
export class AppState implements AppStateLike {
    isLoading = false;

    constructor(state: AppStateLike) {
        this.isLoading = state.isLoading;
    }

    reduce(payload: UpdateLoadingStatusUseCasePayload | Payload): AppState {
        if (payload instanceof UpdateLoadingStatusUseCasePayload) {
            return new AppState({
                ...this as AppStateLike,
                isLoading: payload.isLoading
            });
        } else {
            return this;
        }
    }

    /**
     * Compare `this` properties and `targetState` properties
     * If all properties is matched, return true.
     */
    equals(targetState: this) {
        if (this === targetState) {
            return true;
        }
        return Object.keys(this).every((key) => {
            return (<any>this)[key] === (<any>targetState)[key];
        });
    }
}