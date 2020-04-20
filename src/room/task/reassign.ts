import { Task } from "./task";
import { Roles } from "creep/roles.enum";
import { RoleManagers } from "creep/role/managers";
import { roomMemory } from "room/memory";
import { creepMemory } from "creep/memory";
import { CreepCounters } from "room/needs/creep";
import { harvestSpots, availableEnergy } from "utils/source";

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
        if (this.idleCreeps.length > 0) {
            const availableSources = room.find(FIND_SOURCES_ACTIVE, { filter: availableEnergy });
            const spots = harvestSpots(availableSources);
            for (let creep of this.idleCreeps) {
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
