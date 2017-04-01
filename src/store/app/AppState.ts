// MIT © 2017 azu
import { AppStateLike } from './AppState';
import { UpdateLoadingStatusUseCasePayload } from "../../use-case/app/UpdateLoadingStatusUseCase";
import { Payload } from "almin";
import { ReduceState } from "almin-reduce-store";
export interface AppStateLike {
    isLoading: boolean;
}
export class AppState extends ReduceState implements AppStateLike {
    isLoading = false;

    constructor(state: AppStateLike) {
        super();
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
}