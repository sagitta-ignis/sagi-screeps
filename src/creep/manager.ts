import { RoleManagers } from "./role/managers";
import { RoleManager } from "./role/manager.interface";
import { creepMemory } from "./memory";

export const IDLE = 'idle';

export class CreepManager {

    run(): void {
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            if (!creep.spawning) {
                const role = creepMemory(creep).role;
                if (role) {
                    this.execute(creep, RoleManagers.findBy(role));
                } else if (creep.moveTo(creep.room.find(FIND_FLAGS, { filter: (flag) => (flag.memory as any).type == IDLE })[0]) == ERR_NO_BODYPART) {
                    Game.time % 5 === 0 && creep.say(`I'm crippled`);
                } else {
                    Game.time % 5 === 0 && creep.say(`I'm idle`);
                }
            }
        }
    }

    execute(creep: Creep, manager: RoleManager) {
        if (manager.run(creep) != OK) {
            manager.unassign(creep);
        }
    }
}
