// MIT © 2017 azu
import { AppState } from "./AppState";
import { DispatchedPayload } from "almin";
import { Reducer } from "../Reducer";
const initState = new AppState({
    isLoading: false
});
export class AppStore extends Reducer<AppState> {
    reduce(prevState = initState, payload: DispatchedPayload) {
        return prevState.reduce(payload)
    }
}