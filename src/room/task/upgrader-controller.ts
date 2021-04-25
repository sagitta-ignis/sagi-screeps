import { Roles } from "creep/roles.enum";
import { Task } from "./task";
import { harvestAndMoveRate } from "utils/rate";
import { harvestSpots } from "utils/source";
import { pathCost } from "utils/path-cost";

export class UpgradeControllerTask implements Task {
  public constructor(private controller: StructureController) {}

  public canExecute(room: Room): boolean {
    return room.controller?.my || false;
  }

  public execute(room: Room): ScreepsReturnCode {
    const memory = room.memory;
    if (memory.needs.creeps.upgrader < 0 || Game.time % 100 === 0) {
      const progressLeft = 100 - (this.controller.progress / this.controller.progressTotal) * 100;
      const delay = this.controller.ticksToDowngrade / Math.pow(10, (8 - this.controller.level) % 3);
      const sources = room.find(FIND_SOURCES);
      const travelAvg = sources
        .map(source => pathCost(room, this.controller.pos.findPathTo(source, { range: 1 })))
        .reduce((travel, cost, i, arr) => travel + (2 * cost) / arr.length, 0);
      const upgradeRate = room
        .find(FIND_MY_CREEPS, { filter: c => c.memory.role === Roles.Upgrader })
        .reduce((rate, creep, i, arr) => rate + harvestAndMoveRate(creep, travelAvg) / arr.length, 0);
      const progressRate = (upgradeRate / this.controller.progressTotal) * 100;
      const underUpgrading = progressLeft >= progressRate * delay;
      console.log(
        `[UpgradeControllerTask] calculation is ${progressLeft} ${
          underUpgrading ? ">=" : "<"
        } ${progressRate} * ${delay}`
      );
      if (underUpgrading) {
        let creeps = Math.ceil(progressLeft / (progressRate * delay)) % harvestSpots(sources);
        creeps = isNaN(creeps) ? 1 : creeps;
        if (creeps !== memory.needs.creeps.upgrader) {
          memory.needs.creeps.upgrader = creeps;
          console.log(`[UpgradeControllerTask] update needs for upgraders to [${memory.needs.creeps.upgrader}]`);
        }
      }
    }
    return OK;
  }
}
