import { Task } from "./task";
import { Types } from "creep/types.enum";
import { Roles } from "creep/roles.enum";
import { CreepFactory } from "creep/factory/factory.interface";
import { Factories } from "creep/factory/factories";
import { RoleManagers } from "creep/role/managers";
import { roomMemory } from "room/memory";

export class SpawnTask implements Task {

    constructor(private room: Room, private spawns: StructureSpawn[], private type: Types, private role: Roles) { }

    execute(): ScreepsReturnCode {
        const factory: CreepFactory = Factories.findBy(this.type);
        const allSpawns = this.spawns.filter((spawn) => spawn.energy >= factory.cost).sort((a, b) => b.energy - a.energy);
        if (allSpawns.length > 0) {
            const spawn = allSpawns[0];
            const result = factory.buildIn(spawn);
            if (result.creep) {
                RoleManagers.findBy(this.role).assign(result.creep);
                roomMemory(this.room).needs[this.role]--;
                console.log(`Spawning at ${spawn.name} creep [${result.creep.name}] with role [${this.role}]`);
            }
            return result.code;
        }
        return ERR_NOT_FOUND;
    }
}
