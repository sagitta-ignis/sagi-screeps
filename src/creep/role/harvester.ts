import { BaseRoleManager } from "./manager.base";
import { Roles } from "../roles.enum";
import { availableStorage } from "utils/structure";
import { creepMemory } from "creep/memory";
import { roomMemory } from "room/memory";
import { freeSpaceAround } from "utils/terrain";

export class Harvester extends BaseRoleManager {

    constructor() {
        super(Roles.Harvester);
    }
    run(creep: Creep): ScreepsReturnCode {
        let code: ScreepsReturnCode = undefined as any;
        const memory = creepMemory(creep);
        const reservedSources = roomMemory(creep.room).reservedSources;
        if (creep.store.getFreeCapacity() > 0) {
            if (!memory.target) {
                const source = creep.pos.findClosestByRange(FIND_SOURCES, { filter: source => (reservedSources[source.id] || 0) < freeSpaceAround(source).length });
                if (source) {
                    const pos = source.pos;
                    reservedSources[source.id] += 1;
                    memory.target = {
                        x: pos.x,
                        y: pos.y
                    };
                }
            }
            if (memory.target) {
                const source = creep.room.lookForAt('source', memory.target.x, memory.target.y)[0];
                code = creep.harvest(source);
                if (code == ERR_NOT_IN_RANGE) {
                    code = creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                if (code != OK && code != ERR_TIRED) {
                    console.log(`[${creep.name}]: harvest failed with [${code}]`);
                }
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

    unassign(creep: Creep) {
        super.unassign(creep);
        const memory = creepMemory(creep);
        if (memory.target) {
            const source = creep.room.lookForAt('source', memory.target.x, memory.target.y)[0];
            if (source) {
                roomMemory(creep.room).reservedSources[source.id] -= 1;
            }
            delete memory.target;
        }

    }

}
