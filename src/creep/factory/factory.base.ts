import { CreepFactory, FactoryBuildReturn } from "./factory.interface";
import { Factories } from "./factories";
import { Types } from "../types.enum";

export abstract class BaseCreepFactory implements CreepFactory {
  abstract cost: number;
  public constructor(private type: Types) {
    Factories.add(type, this);
  }
  public nextName(): string {
    let next = 1;
    const workers = _.filter(Game.creeps, creep => creep.memory.type === this.type);
    if (workers.length) {
      const highest = _.max(workers, w => +w.name.replace(this.type, ""));
      next = +highest.name.replace(this.type, "") + 1;
    }
    return `${this.type}${next}`;
  }
  abstract buildIn(spawn: StructureSpawn): FactoryBuildReturn;
}
