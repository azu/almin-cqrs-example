import { Payload } from 'almin';
const AppUseCaseType = "APP_CHANGED";
// etends Context
export class AppChangePayload extends Payload {
    constructor() {
        super({ type: AppUseCaseType });
    }
}