import { BaseRoleManager } from "./manager.base";
import { Roles } from "../roles.enum";

export interface UpgraderMemory {
    upgrading: boolean;
}

export class Upgrader extends BaseRoleManager {

    constructor() {
        super(Roles.Upgrader);
    }

    memory(creep: Creep): UpgraderMemory {
        return creep.memory as any;
    }

    run(creep: Creep): boolean {
        const memory = this.memory(creep);
        if (memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!memory.upgrading && creep.store.getFreeCapacity() == 0) {
            memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (memory.upgrading && creep.room.controller) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else if (creep.store.getFreeCapacity() != 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            return false;
        }
        return true;
    }

}
