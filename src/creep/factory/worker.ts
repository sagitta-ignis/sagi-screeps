import { Types } from "../types.enum";
import { BaseCreepFactory } from "./factory.base";

export class WorkerFactory extends BaseCreepFactory {

    cost: number;

    constructor() {
        super(Types.Worker);
        this.cost = 150;
    }

    buildIn(spawn: StructureSpawn): { code: ScreepsReturnCode, creep?: Creep } {
        const name = this.nextName();
        const code = spawn.spawnCreep([WORK, CARRY, MOVE], name, { memory: { type: Types.Worker } });
        return { code, creep: Game.creeps[name] };
    }
}
