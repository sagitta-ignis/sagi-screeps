import { Roles } from "creep/roles.enum";

export type CreepCounters = { [index in Roles]: number };
export type CreepNeeds = CreepCounters;
