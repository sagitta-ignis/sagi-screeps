import { CreepNeeds } from "./needs/creep";

export interface RoomMemory {
    needs: {
        creeps: CreepNeeds;
    };
}

export function roomMemory(room: Room) {
    return room.memory as RoomMemory;
}
