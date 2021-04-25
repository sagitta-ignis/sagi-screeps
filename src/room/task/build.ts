import { Task } from "./task";

export class BuildTask implements Task {
  private carry = 50;
  private sites: ConstructionSite[] = [];

  public canExecute(room: Room): boolean {
    this.sites = room.find(FIND_MY_CONSTRUCTION_SITES);
    if (this.sites.length > 0) {
      return true;
    }
    const memory = room.memory;
    if (memory.needs.creeps.builder !== 0) {
      memory.needs.creeps.builder = 0;
      console.log(`[BuildTask] update needs for harvesters to [${memory.needs.creeps.builder}]`);
    }
    return false;
  }

  public execute(room: Room): ScreepsReturnCode {
    const memory = room.memory;
    let builders = this.sites.reduce((creeps, site) => creeps + site.progressTotal / this.carry, 0);
    builders = Math.min(memory.harvestSpots, builders);
    if (memory.needs.creeps.builder !== builders) {
      memory.needs.creeps.builder = builders;
      console.log(`[BuildTask] update needs for builders to [${room.memory.needs.creeps.builder}]`);
    }
    return OK;
  }
}
