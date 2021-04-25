import { Task } from "./task";

export class HarvestTask implements Task {
  private carry = 50;

  public canExecute(room: Room): boolean {
    if (room.energyAvailable < room.energyCapacityAvailable) {
      return true;
    }
    const memory = room.memory;
    if (memory.needs.creeps.harvester !== 0) {
      memory.needs.creeps.harvester = 0;
      console.log(`[HarvestTask] update needs for harvesters to [${room.memory.needs.creeps.harvester}]`);
    }
    return false;
  }

  public execute(room: Room): ScreepsReturnCode {
    const memory = room.memory;
    const carriers = Math.floor((room.energyCapacityAvailable - room.energyAvailable) / this.carry);
    const harvesters = Math.min(memory.harvestSpots, isFinite(carriers) ? carriers : 0);
    if (memory.needs.creeps.harvester !== harvesters) {
      memory.needs.creeps.harvester = harvesters;
      console.log(`[HarvestTask] update needs for harvesters to [${room.memory.needs.creeps.harvester}]`);
    }
    return OK;
  }
}
