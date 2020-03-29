import { Types } from "../types.enum";
import { CreepFactory } from "./factory.interface";

export class Factories {

    static byTypes = new Map<Types, CreepFactory>();

    static add(type: Types, factory: CreepFactory) {
        this.byTypes.set(type, factory);
    }

    static findBy(type: Types): CreepFactory {
        const factory = this.byTypes.get(type);
        if (!factory) {
            console.log(`[ERROR] Missing factory for type [${type}]`);
        }
        return factory || { cost: 0, buildIn: () => <any>{ code: ERR_INVALID_ARGS } };
    }
}
