import { Task } from "./task";
import { roomMemory } from "room/memory";
import { pathCost } from "utils/path-cost";
import { harvestAndMoveRate } from "utils/rate";
import { Roles } from "creep/roles.enum";
import { creepMemory } from "creep/memory";

export class UpgradeControllerTask implements Task {

    constructor(private controller: StructureController) { }

    canExecute(room: Room) { return this.controller.my; }

    execute(room: Room): ScreepsReturnCode {
        const memory = roomMemory(room);
        if (memory.needs.creeps.upgrader < 0 || Game.time % 100 === 0) {
            const progressLeft = 100 - (this.controller.progress / this.controller.progressTotal * 100);
            const delay = this.controller.ticksToDowngrade / Math.pow(10, (8 - this.controller.level) % 3);
            const sources = room.find(FIND_SOURCES);
            const travelAvg = sources
                .map(source => pathCost(room, this.controller.pos.findPathTo(source, { range: 1 })))
                .reduce((travel, cost, i, arr) => travel + (2 * cost / arr.length), 0);
            const upgradeRate = room.find(FIND_MY_CREEPS, { filter: c => creepMemory(c).role === Roles.Upgrader })
                .reduce((rate, creep, i, arr) => rate + (harvestAndMoveRate(creep, travelAvg) / arr.length), 0);
            const progressRate = upgradeRate / this.controller.progressTotal * 100;
            const underUpgrading = progressLeft >= progressRate * delay;
            console.log(`[UpgradeControllerTask] calculation is ${progressLeft} ${underUpgrading ? '>=' : '<'} ${progressRate} * ${delay}`);
            if (underUpgrading) {
                let creeps = Math.ceil(progressLeft / (progressRate * delay)) % sources.length;
                creeps = Number.isInteger(creeps) && creeps ? creeps : 1;
                if (creeps != memory.needs.creeps.upgrader) {
                    memory.needs.creeps.upgrader = creeps;
                    console.log(`[UpgradeControllerTask] update needs for upgraders to [${memory.needs.creeps.upgrader}]`);
                }
            }
        }
        return OK;
    }

}
