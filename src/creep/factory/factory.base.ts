import { Types } from "../types.enum";
import { Factories } from "./factories";
import { CreepFactory, FactoryBuildReturn } from "./factory.interface";
import { creepMemory } from "creep/memory";

export abstract class BaseCreepFactory implements CreepFactory {
    abstract cost: number;
    constructor(private type: Types) {
        Factories.add(type, this);
    }
    nextName(): string {
        let next = 1;
        const workers = _.filter(Game.creeps, (creep) => creepMemory(creep).type == this.type);
        if (workers.length) {
            const highest = _.max(workers, w => +w.name.replace(this.type, ''));
            next = +highest.name.replace(this.type, '') + 1;
        }
        return this.type + next;
    }
    abstract buildIn(spawn: StructureSpawn): FactoryBuildReturn;
}
