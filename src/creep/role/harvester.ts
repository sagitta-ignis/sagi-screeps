import { Worker } from "./worker";
import { Roles } from "../roles.enum";
import { roomMemory } from "room/memory";
import { availableStorage } from "utils/structure";
import { freeSpaceAround } from "utils/terrain";

export class Harvester extends Worker<AnyStructure> {

    constructor() {
        super(Roles.Harvester);
    }

    protected findClosestSourceByRange(creep: Creep): Source | null {
        const roomMem = roomMemory(creep.room);
        const reservedSources = roomMem.reservedSources;
        const harvestSource = creep.room.lookForAt('source', roomMem.harvestSource.x, roomMem.harvestSource.y)[0];
        if (harvestSource && reservedSources[harvestSource.id] < freeSpaceAround(creep.room, harvestSource.pos).length) {
            return harvestSource;
        }
        return super.findClosestSourceByRange(creep);
    }

    protected sayWork(creep: Creep): void {
        creep.say('⏬ transfer');
    }

    protected findWorkTarget(creep: Creep): AnyStructure | null {
        const targets = creep.room.find(FIND_STRUCTURES, { filter: availableStorage });
        if (targets.length > 0) {
            return targets[0];
        }
        return null;
    }

    protected work(creep: Creep, target: AnyStructure): ScreepsReturnCode {
        return creep.transfer(target, RESOURCE_ENERGY);
    }

    protected failedToWork(creep: Creep, code: ScreepsReturnCode): void {
        console.log(`[${creep.name}]: transfer failed with [${code}]`);
    }
}
