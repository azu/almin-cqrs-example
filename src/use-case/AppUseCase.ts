import { UseCase } from "almin";
import { AppChangePayload } from "../AppChangePayload";
// always same ChangePayload
const appChangePayload = new AppChangePayload();
export class AppUseCase extends UseCase {
    changed() {
        // Just in time updating..
        this.dispatch(appChangePayload);
    }
}