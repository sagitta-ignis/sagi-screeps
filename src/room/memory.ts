import { CreepNeeds } from "./needs/creep";

export interface RoomMemory {
    needs: CreepNeeds;
}

export function roomMemory(room: Room) {
    return room.memory as RoomMemory;
}
