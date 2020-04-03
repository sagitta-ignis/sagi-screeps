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

    run(creep: Creep): ScreepsReturnCode {
        const memory = this.memory(creep);
        if (memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!memory.upgrading && creep.store.getFreeCapacity() == 0) {
            memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        let code: ScreepsReturnCode = undefined as any;
        if (memory.upgrading && creep.room.controller) {
            code = creep.upgradeController(creep.room.controller);
            if (code == ERR_NOT_IN_RANGE) {
                code = creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
            if (code != OK && code != ERR_TIRED) {
                console.log(`[${creep.name}]: upgrade failed with [${code}]`);
            }
        } else if (creep.store.getFreeCapacity() != 0) {
            const sources = creep.room.find(FIND_SOURCES);
            code = creep.harvest(sources[0]);
            if (code == ERR_NOT_IN_RANGE) {
                code = creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            if (code != OK && code != ERR_TIRED) {
                console.log(`[${creep.name}]: harvest failed with [${code}]`);
            }
        }
        if (code == ERR_BUSY || code == ERR_TIRED) {
            code = OK;
        }
        return code;
    }

}
