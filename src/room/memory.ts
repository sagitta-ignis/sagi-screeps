import { CreepNeeds } from "./needs/creep";

export interface RoomMemory {
    needs: {
        creeps: CreepNeeds;
    };
    harvestSource: { x: number, y: number };
    reservedSources: { [index: string]: number };
}

export function roomMemory(room: Room) {
    return room.memory as RoomMemory;
}
