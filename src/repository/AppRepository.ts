import BaseRepository from "./BaseRepository";
import { AppCreator } from "../domain/AppCreator";
import { App } from "../domain/App";
const app = AppCreator.create();
export type AppRepository = BaseRepository<App>;
export const appRepository = new BaseRepository<App>(app);