import { Task } from "./task";
import { roomMemory } from "room/memory";

export class BuildTask implements Task {

    private carry = 50;
    private sites: ConstructionSite[] = [];

    canExecute(room: Room): boolean {
        this.sites = room.find(FIND_MY_CONSTRUCTION_SITES);
        if (this.sites.length > 0) {
            return true;
        }
        const memory = roomMemory(room);
        if (memory.needs.creeps.builder !== 0) {
            memory.needs.creeps.builder = 0;
            console.log(`[BuildTask] update needs for harvesters to [${memory.needs.creeps.builder}]`);
        }
        return false;
    }

    execute(room: Room): ScreepsReturnCode {
        const memory = roomMemory(room);
        let builders = this.sites.reduce(
            (builders, site) => builders + (site.progressTotal / this.carry),
            0
        );
        builders = Math.min(memory.harvestSpots, builders);
        if (memory.needs.creeps.builder !== builders) {
            memory.needs.creeps.builder = builders;
            console.log(`[BuildTask] update needs for builders to [${roomMemory(room).needs.creeps.builder}]`);
        }
        return OK;
    }

}
