// MIT © 2017 azu
import { UseCase, Payload } from "almin";
export class UpdateLoadingStatusUseCasePayload extends Payload {
    constructor(public isLoading: boolean) {
        super({type: "UpdateLoadingStatusUseCasePayload"});
    }
}
export default class UpdateLoadingStatusUseCase extends UseCase {
    execute(isLoading: boolean) {
        this.dispatch(new UpdateLoadingStatusUseCasePayload(isLoading));
    }
}