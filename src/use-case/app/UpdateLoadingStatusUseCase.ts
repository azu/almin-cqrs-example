// MIT © 2017 azu
import { Payload, FunctionalUseCaseContext } from "almin";
import { UpdateLoadingStatusUseCaseArgs } from './UpdateLoadingStatusUseCase';
export class UpdateLoadingStatusUseCasePayload extends Payload {
    constructor(public isLoading: boolean) {
        super({ type: "UpdateLoadingStatusUseCasePayload" });
    }
}
export interface UpdateLoadingStatusUseCaseArgs {
    isLoading: boolean;
}
// Functional useCase
export const UpdateLoadingStatusUseCase = ({dispatcher}: FunctionalUseCaseContext) => {
    return (args: UpdateLoadingStatusUseCaseArgs) => {
        dispatcher.dispatch(new UpdateLoadingStatusUseCasePayload(args.isLoading));
    }
};