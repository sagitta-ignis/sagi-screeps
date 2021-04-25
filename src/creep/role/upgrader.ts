import { Roles } from "../roles.enum";
import { Worker } from "./worker";

export class Upgrader extends Worker<StructureController> {
  public constructor() {
    super(Roles.Upgrader);
  }

  protected sayWork(creep: Creep): void {
    creep.say("⚡ upgrade");
  }

  protected findWorkTarget(creep: Creep): StructureController | null {
    return creep.room.controller || null;
  }

  protected work(creep: Creep, target: StructureController): ScreepsReturnCode {
    return creep.upgradeController(target);
  }

  protected failedToWork(creep: Creep, code: ScreepsReturnCode): void {
    console.log(`[${creep.name}]: upgrade failed with [${code}]`);
  }
}
