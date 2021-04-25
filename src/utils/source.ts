import { freeSpaceAround } from "./terrain";

export function availableEnergy(source: Source): boolean {
  return source.energy > 0;
}

export function harvestSpots(sources: Source[]): number {
  return sources.reduce((spots, source) => spots + freeSpaceAround(source.room, source.pos).length, 0);
}
