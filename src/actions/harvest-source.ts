import { Action } from "./action.enum";

export class HarvestSourceAction {
  public readonly key = Action.HarvestSource;
  public readonly phrase = "⛏️ harvest";

  public assignable(creep: Creep): boolean {
    return creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
  }

  public run(creep: Creep, source: Source): ScreepsReturnCode {
    let code: ScreepsReturnCode = ERR_INVALID_ARGS;
    if (this.assignable(creep)) {
      code = creep.harvest(source);
      if (code === ERR_NOT_IN_RANGE) {
        code = creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
      if (code !== OK && code !== ERR_TIRED) {
        console.log(`[${creep.name}]: harvest failed with [${code}]`);
      }
    }
    if (code === ERR_BUSY || code === ERR_TIRED) {
      code = OK;
    }
    return code;
  }
}
