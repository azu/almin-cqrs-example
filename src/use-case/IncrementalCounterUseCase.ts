// LICENSE : MIT
"use strict";
import { appRepository } from "../repository/AppRepository";
import { AppUseCase } from "./AppUseCase";
export default class IncrementalCounterUseCase extends AppUseCase {
    execute() {
        const app = appRepository.get();
        app.counter.increment();
        appRepository.save(app);
    }
}