import { Types } from "./types.enum";
import { Roles } from "./roles.enum";

export interface CreepMemory {
    type: Types;
    role: Roles;
}

export function creepMemory(creep: Creep) {
    return creep.memory as CreepMemory;
}
