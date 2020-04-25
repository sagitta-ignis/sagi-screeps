import { Task } from "./task";
import { availableEnergy, harvestSpots } from "utils/source";
import { roomMemory } from "room/memory";
import { freeSpaceAround } from "utils/terrain";

export class HarvestTask implements Task {

    private carry = 50;

    canExecute(room: Room): boolean {
        if (room.energyAvailable < room.energyCapacityAvailable) {
            return true;
        }
        const memory = roomMemory(room);
        if (memory.needs.creeps.harvester !== 0) {
            memory.needs.creeps.harvester = 0;
            console.log(`[HarvestTask] update needs for harvesters to [${roomMemory(room).needs.creeps.harvester}]`);
        }
        return false;
    }

    execute(room: Room): ScreepsReturnCode {
        const memory = roomMemory(room);
        const carriers = Math.floor((room.energyCapacityAvailable - room.energyAvailable) / this.carry);
        const harvesters = Math.min(memory.harvestSpots, Number.isFinite(carriers) ? carriers : 0)
        if (memory.needs.creeps.harvester !== harvesters) {
            memory.needs.creeps.harvester = harvesters;
            console.log(`[HarvestTask] update needs for harvesters to [${roomMemory(room).needs.creeps.harvester}]`);
        }
        return OK;
    }
}
