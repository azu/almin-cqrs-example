// LICENSE : MIT
"use strict";
import { appRepository, AppRepository } from "../../repository/AppRepository";
import { AppUseCase } from "../AppUseCase";
export const createDecrementalCounterUseCase = () => {
    return new DecrementalCounterUseCase(appRepository);
};
export default class DecrementalCounterUseCase extends AppUseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    execute() {
        const app = this.appRepository.get();
        app.counter.decrement();
        this.appRepository.save(app);
    }
}