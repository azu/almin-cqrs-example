import { Payload } from 'almin';
const AppUseCaseType = "APP_CHANGED";
export class AppChangePayload extends Payload {
    constructor() {
        super({ type: AppUseCaseType });
    }
}