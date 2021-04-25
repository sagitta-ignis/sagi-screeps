import { CreepFactory } from "creep/factory/factory.interface";
import { Factories } from "creep/factory/factories";
import { RoleManagers } from "creep/role/managers";
import { Roles } from "creep/roles.enum";
import { Task } from "./task";
import { Types } from "creep/types.enum";

export class SpawnTask implements Task {
  private spawn?: StructureSpawn;
  private factory: CreepFactory;

  public constructor(private type: Types, private role: Roles) {
    this.factory = Factories.findBy(this.type);
  }

  public canExecute(room: Room): boolean {
    const allSpawns = room
      .find(FIND_MY_SPAWNS, {
        filter: spawn => !spawn.spawning && !spawn.memory.task && spawn.energy >= this.factory.cost
      })
      .sort((a, b) => b.energy - a.energy);
    if (allSpawns.length > 0) {
      this.spawn = allSpawns[0];
      this.spawn.memory.task = true;
      return true;
    }
    return false;
  }

  public execute(room: Room): ScreepsReturnCode {
    if (!this.spawn && !this.canExecute(room)) {
      return ERR_NOT_FOUND;
    }
    if (this.spawn) {
      const result = this.factory.buildIn(this.spawn);
      if (result.creep) {
        RoleManagers.findBy(this.role).assign(result.creep);
        console.log(`[SpawnTask] Spawning at ${this.spawn.name} creep [${result.creep.name}] with role [${this.role}]`);
      }
      if (result.code !== OK) {
        console.log(`[SpawnTask] Spawning at ${this.spawn.name} failed with [${result.code}]`);
      }
      delete this.spawn.memory.task;
      return result.code;
    }
    return ERR_NOT_FOUND;
  }
}
