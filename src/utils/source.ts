import { freeSpaceAround } from "./terrain";

export function availableEnergy(source: Source) {
    return source.energy > 0;
}

export function harvestSpots(sources: Source[]) {
    return sources.reduce(
        (spots, source) => spots + freeSpaceAround(source.room, source.pos).length,
        0
    );
}
