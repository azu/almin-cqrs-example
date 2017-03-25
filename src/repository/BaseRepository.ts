// MIT © 2017 azu
"use strict";
import MapLike from "map-like";
import * as assert from "assert";
interface Entity {
    id: string;
}
const key = "lastUsed";
export default class BaseRepository<T extends Entity> {
    map: MapLike<Entity["id"], T>;
    private initialEntity: T;

    constructor(entity: T) {
        this.initialEntity = entity;
        this.map = new MapLike<Entity["id"], T>();
    }

    get(): T {
        return this.map.get(key) || this.initialEntity;
    }

    findById(entityId: Entity["id"]) {
        return this.map.get(entityId);
    }

    save(entity: T) {
        this.map.set(key, entity);
        assert.ok(typeof entity.id !== "undefined", "Entity should have id property for key");
        this.map.set(entity.id, entity);
    }
}