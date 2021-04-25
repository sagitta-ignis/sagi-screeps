import { CreepFactory } from "./factory.interface";
import { Types } from "../types.enum";

export class Factories {
  public static byTypes = new Map<Types, CreepFactory>();

  public static add(type: Types, factory: CreepFactory): void {
    this.byTypes.set(type, factory);
  }

  public static findBy(type: Types): CreepFactory {
    const factory = this.byTypes.get(type);
    if (!factory) {
      console.log(`[ERROR] Missing factory for type [${type}]`);
    }
    return factory || { cost: 0, buildIn: () => ({ code: ERR_INVALID_ARGS }) };
  }
}
