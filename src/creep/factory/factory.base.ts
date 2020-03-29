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
        const count = _.filter(Game.creeps, (creep) => creepMemory(creep).type == this.type).length;
        return this.type + (count + 1);
    }
    abstract buildIn(spawn: StructureSpawn): FactoryBuildReturn;
}
