import { RoleManager } from "./role/manager.interface";
import { RoleManagers } from "./role/managers";

export const IDLE = "idle";

export class CreepManager {
  public run(): void {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (!creep.spawning) {
        const role = creep.memory.role;
        if (role) {
          this.execute(creep, RoleManagers.findBy(role));
        } else {
          const move = creep.moveTo(creep.room.find(FIND_FLAGS, { filter: flag => flag.name === IDLE })[0]);
          if (Game.time % 5) {
            if (move === ERR_NO_BODYPART) {
              creep.say(`I'm crippled`);
            } else {
              creep.say(`I'm idle`);
            }
          }
        }
      }
    }
  }

  public execute(creep: Creep, manager: RoleManager): void {
    if (manager.run(creep) !== OK) {
      manager.unassign(creep);
    }
  }
}
