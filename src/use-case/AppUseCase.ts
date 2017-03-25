import { UseCase } from "almin";
export const AppUseCaseType = "APP_CHANGED";
export class AppUseCase extends UseCase {
    changed() {
        // Just in time updating..
        this.dispatch({
            type: AppUseCaseType
        });
    }
}