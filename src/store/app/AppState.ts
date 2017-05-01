// MIT © 2017 azu
import { AppStateLike } from './AppState';
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

    reduce(payload: UpdateLoadingStatusUseCasePayload | Payload) {
        if (payload instanceof UpdateLoadingStatusUseCasePayload) {
            return new AppState({
                ...this as AppStateLike,
                isLoading: payload.isLoading
            });
        } else {
            return this;
        }
    }
}