import { UseCase, Dispatcher, Payload, Context } from "almin";
export const AppUseCaseType = "APP_CHANGED";

// changed
type Constructor<T> = new (...args: Array<any>) => T;
// etends Context
class AppChangePayload extends Payload {
    constructor() {
        super({ type: AppUseCaseType });
    }
}
const appChangePayload = new AppChangePayload();
export function Changdable<T extends Constructor<Context>>(Base: T) {
    return class extends Base {
        dispatcher: Dispatcher;
        handler: () => void;
        constructor(...args: Array<any>) {
            super(...args);
            const dispatcher: Dispatcher = args[0].dispatcher;
            this.dispatcher = dispatcher;
            // UseCase#changed -> Update State
            this.dispatcher.onDispatch((payload: Payload) => {
                if (payload.type === AppUseCaseType) {
                    this.handler()
                }
            });
            this.onCompleteEachUseCase(() => {
                this.handler();
            });
        }

        onChange(handler: () => void) {
            this.handler = handler;
        }
    };
}

export class AppUseCase extends UseCase {
    changed() {
        // Just in time updating..
        this.dispatch(appChangePayload);
    }
}