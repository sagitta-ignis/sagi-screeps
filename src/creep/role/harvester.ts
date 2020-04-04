import { BaseRoleManager } from "./manager.base";
import { Roles } from "../roles.enum";
import { availableStorage } from "utils/structure";

export class Harvester extends BaseRoleManager {

    constructor() {
        super(Roles.Harvester);
    }
    run(creep: Creep): ScreepsReturnCode {
        let code: ScreepsReturnCode = undefined as any;
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            code = creep.harvest(sources[0]);
            if (code == ERR_NOT_IN_RANGE) {
                code = creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            if (code != OK && code != ERR_TIRED) {
                console.log(`[${creep.name}]: harvest failed with [${code}]`);
            }
        }
        else {
            const targets = creep.room.find(FIND_STRUCTURES, { filter: availableStorage });
            if (targets.length > 0) {
                code = creep.transfer(targets[0], RESOURCE_ENERGY);
                if (code == ERR_NOT_IN_RANGE) {
                    code = creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
                if (code != OK && code != ERR_TIRED) {
                    console.log(`[${creep.name}]: transfer failed with [${code}]`);
                }
            }
        }
        if (code == ERR_BUSY || code == ERR_TIRED) {
            code = OK;
        }
        return code;
    }

}
