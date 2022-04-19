import { Action } from "./action.enum";

export class UpgradeControllerAction {
  public readonly key = Action.UpgradeController;
  public readonly phrase = "⚡ upgrade";

  public assignable(creep: Creep): boolean {
    return creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
  }

  public run(creep: Creep, controller: StructureController): ScreepsReturnCode {
    let code: ScreepsReturnCode = ERR_INVALID_ARGS;
    if (this.assignable(creep) && controller.my) {
      code = creep.upgradeController(controller);
      if (code === ERR_NOT_IN_RANGE) {
        code = creep.moveTo(controller, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      if (code !== OK && code !== ERR_TIRED) {
        console.log(`[${creep.name}]: upgrade failed with [${code}]`);
      }
    }
    if (code === ERR_BUSY || code === ERR_TIRED) {
      code = OK;
    }
    return code;
  }
}
