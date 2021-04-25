import { availableEnergy, harvestSpots } from "utils/source";
import { CreepCounters } from "room/needs/creep";
import { RoleManagers } from "creep/role/managers";
import { Roles } from "creep/roles.enum";
import { Task } from "./task";

export class ReassignTask implements Task {
  private idleCreeps: Creep[] = [];

  public constructor(private counters: CreepCounters) {}

  public canExecute(room: Room): boolean {
    this.idleCreeps = room.find(FIND_MY_CREEPS, { filter: creep => !creep.memory.role });
    return this.idleCreeps.length > 0;
  }
  public execute(room: Room): ScreepsReturnCode {
    const memory = room.memory;
    for (const need in memory.needs.creeps) {
      if (this.idleCreeps.length === 0) {
        break;
      }
      const creepsNeeded = memory.needs.creeps[need as Roles] - this.counters[need as Roles];
      const increase = this.idleCreeps.length > creepsNeeded ? creepsNeeded : this.idleCreeps.length;
      this.idleCreeps.splice(0, increase).forEach(creep => this.reassign(creep, need as Roles));
      this.counters[need as Roles] += increase;
    }
    if (this.idleCreeps.length > 0) {
      const availableSources = room.find(FIND_SOURCES_ACTIVE, { filter: availableEnergy });
      const spots = harvestSpots(availableSources);
      for (const creep of this.idleCreeps) {
        if (this.counters.upgrader === spots) {
          break;
        }
        this.reassign(creep, Roles.Upgrader);
        this.counters.upgrader += 1;
      }
    }
    return OK;
  }

  private reassign(creep: Creep, role: Roles) {
    RoleManagers.findBy(role).assign(creep);
    console.log(`Reassigned [${creep.name}] as [${role}]`);
  }
}
