// LICENSE : MIT
"use strict";
import { appRepository, AppRepository } from "../../repository/AppRepository";
import { AppUseCase } from "../AppUseCase";
export const createIncrementalCounterUseCase = () => {
    return new IncrementalCounterUseCase(appRepository);
};
export default class IncrementalCounterUseCase extends AppUseCase {
    constructor(public appRepository: AppRepository) {
        super();
    }

    execute() {
        const app = this.appRepository.get();
        app.counter.increment();
        this.appRepository.save(app);
    }
}