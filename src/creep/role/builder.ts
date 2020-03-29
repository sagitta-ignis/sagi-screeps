import { BaseRoleManager } from "./manager.base";
import { Roles } from "../roles.enum";

export interface BuilderMemory {
    building: boolean;
}

export class Builder extends BaseRoleManager {

    constructor() {
        super(Roles.Builder);
    }

    memory(creep: Creep): BuilderMemory {
        return creep.memory as any;
    }

    run(creep: Creep): boolean {
        const memory = this.memory(creep);
        if (memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!memory.building && creep.store.getFreeCapacity() == 0) {
            memory.building = true;
            creep.say('🚧 build');
        }

        if (memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        return true;
    }

}
