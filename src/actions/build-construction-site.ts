import { Action } from "./action.enum";

export class BuildConstructionSiteAction {
  public readonly key = Action.BuildConstructionSite;
  public readonly phrase = "🚧 build";

  public assignable(creep: Creep): boolean {
    return creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
  }

  public run(creep: Creep, constructionSite: ConstructionSite): ScreepsReturnCode {
    let code: ScreepsReturnCode = ERR_INVALID_ARGS;
    if (this.assignable(creep)) {
      code = creep.build(constructionSite);
      if (code === ERR_NOT_IN_RANGE) {
        code = creep.moveTo(constructionSite, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
      if (code !== OK && code !== ERR_TIRED) {
        console.log(`[${creep.name}]: build failed with [${code}]`);
      }
    }
    if (code === ERR_BUSY || code === ERR_TIRED) {
      code = OK;
    }
    return code;
  }
}
