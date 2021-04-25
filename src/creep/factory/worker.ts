import { BaseCreepFactory } from "./factory.base";
import { Types } from "../types.enum";

export class WorkerFactory extends BaseCreepFactory {
  public cost: number;

  public constructor() {
    super(Types.Worker);
    this.cost = 200;
  }

  public buildIn(spawn: StructureSpawn): { code: ScreepsReturnCode; creep?: Creep } {
    const name = this.nextName();
    const code = spawn.spawnCreep([WORK, CARRY, MOVE], name, { memory: { type: Types.Worker } });
    return { code, creep: Game.creeps[name] };
  }
}
