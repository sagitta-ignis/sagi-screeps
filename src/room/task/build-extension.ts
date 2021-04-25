import { freeSpaceAround, freeSpaceAside } from "utils/terrain";
import { CreepCounters } from "room/needs/creep";
import { Task } from "./task";

export class BuildExtensionTask implements Task {
  public constructor(private creeps: CreepCounters) {}

  public canExecute(room: Room): boolean {
    if (!room.controller) {
      return false;
    }
    return (
      room.controller.level >= 2 &&
      room.energyAvailable >= room.energyCapacityAvailable * 0.75 &&
      room.find(FIND_MY_CONSTRUCTION_SITES, { filter: site => site.structureType === "extension" }).length === 0
    );
  }
  public execute(room: Room): ScreepsReturnCode {
    const memory = room.memory;
    const harvestSource = room.lookForAt("source", memory.harvestSource.x, memory.harvestSource.y)[0];
    let code: ScreepsReturnCode = ERR_NOT_FOUND;
    let site: LookAtResultWithPos | undefined;
    if (harvestSource) {
      const spawn = harvestSource.pos.findClosestByPath(FIND_MY_SPAWNS);
      if (spawn) {
        const paths = freeSpaceAround(room, harvestSource.pos)
          .map(spot => {
            const pos = room.getPositionAt(spot.x, spot.y);
            return pos ? pos.findPathTo(spawn, { range: 1 }) : null;
          })
          .filter(path => path !== null) as PathStep[][];
        const excludedSpace = paths
          .reduce((excluded, path) => excluded.concat(path), [] as { x: number; y: number }[])
          .concat(freeSpaceAround(room, spawn.pos))
          .concat(freeSpaceAround(room, harvestSource.pos));
        const spaceAside = paths.reduce(
          (area, path) =>
            area.concat(
              freeSpaceAside(room, path).filter(space => !excludedSpace.some(e => e.x === space.x && e.y === space.y))
            ),
          [] as LookAtResultWithPos[]
        );
        site = spaceAside.shift();
        if (site) {
          code = room.createConstructionSite(site.x, site.y, STRUCTURE_EXTENSION);
        }
      }
    }
    if (code === OK && site) {
      console.log(`[BuildExtensionTask] new construction site at (${site.x};${site.y})`);
    } else {
      console.log(`[BuildExtensionTask] failed with [${code}]${site ? ` at (${site.x};${site.y})` : ""}`);
    }
    return code;
  }
}
