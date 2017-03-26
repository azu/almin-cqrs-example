// LICENSE : MIT
"use strict";
import { appRepository } from "../../repository/AppRepository";
import { AppUseCase } from "../AppUseCase";
export default class DecrementalCounterUseCase extends AppUseCase {
    execute() {
        const app = appRepository.get();
        app.counter.decrement();
        appRepository.save(app);
    }
}