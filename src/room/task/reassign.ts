import { Task } from "./task";
import { Roles } from "creep/roles.enum";
import { RoleManagers } from "creep/role/managers";
import { roomMemory } from "room/memory";
import { creepMemory } from "creep/memory";
import { CreepCounters } from "room/needs/creep";

export class ReassignTask implements Task {

    private idleCreeps: Creep[] = [];

    constructor(private counters: CreepCounters) { }

    canExecute(room: Room): boolean {
        this.idleCreeps = room.find(FIND_MY_CREEPS, { filter: (creep) => !creepMemory(creep).role });
        return this.idleCreeps.length > 0;
    }
    execute(room: Room): ScreepsReturnCode {
        const memory = roomMemory(room);
        for (let need in memory.needs.creeps) {
            if (this.idleCreeps.length == 0) {
                break;
            }
            let creepsNeeded = memory.needs.creeps[need as Roles] - this.counters[need as Roles];
            let increase = this.idleCreeps.length > creepsNeeded ? creepsNeeded : this.idleCreeps.length;
            this.idleCreeps.splice(0, increase)
                .forEach(creep => this.reassign(creep, need as Roles));
            this.counters[need as Roles] += increase;
        }
        return OK;
    }

    private reassign(creep: Creep, role: Roles) {
        RoleManagers.findBy(role).assign(creep);
        console.log(`Reassigned [${creep.name}] as [${role}]`);
    }

}
