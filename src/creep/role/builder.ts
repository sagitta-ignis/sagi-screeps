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

    run(creep: Creep): ScreepsReturnCode {
        const memory = this.memory(creep);
        if (memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!memory.building && creep.store.getFreeCapacity() == 0) {
            memory.building = true;
            creep.say('🚧 build');
        }

        let code: ScreepsReturnCode = undefined as any;
        if (memory.building) {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                code = creep.build(targets[0]);
                if (code == ERR_NOT_IN_RANGE) {
                    code = creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
                if (code != OK && code != ERR_TIRED) {
                    console.log(`[${creep.name}]: build failed with [${code}]`);
                }
            }
        }
        else {
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
