import { RoleManagers } from "./role/managers";
import { RoleManager } from "./role/manager.interface";
import { creepMemory } from "./memory";

export class CreepManager {

    run(): void {
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            const role = creepMemory(creep).role;
            if (role) {
                this.execute(creep, RoleManagers.findBy(role));
            } else {
                creep.say(`I'm idle`);
            }
        }
    }

    execute(creep: Creep, manager: RoleManager) {
        if (!manager.run(creep)) {
            manager.unassign(creep);
        }
    }
}
