// LICENSE : MIT
"use strict";
import { appRepository } from "../../repository/AppRepository";
import { AppUseCase } from "../AppUseCase";

const wait = (waitMS: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, waitMS);
    })
};
export default class RandomCounterUseCase extends AppUseCase {
    execute() {
        const app = appRepository.get();
        const task = (execCounter = 10): Promise<number> => {
            if (execCounter < 0) {
                return Promise.resolve(execCounter);
            }
            return wait(200).then(() => {
                app.counter.random();
                appRepository.save(app);
                this.changed(); // refresh UI
                return task(execCounter - 1);
            });
        };
        return task();
    }
}