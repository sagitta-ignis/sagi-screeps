import { RoleManager } from "./manager.interface";
import { RoleManagers } from "./managers";
import { Roles } from "../roles.enum";

export abstract class BaseRoleManager implements RoleManager {
  public constructor(protected readonly role: Roles) {
    RoleManagers.add(role, this);
  }

  public assign(creep: Creep): void {
    if (creep.memory.role !== this.role) {
      creep.memory.role = this.role;
      console.log(`Assigned [${creep.name}] as [${this.role}]`);
    }
  }
  public unassign(creep: Creep): void {
    if (creep.memory.role !== undefined) {
      creep.memory.role = undefined;
      console.log(`Unassigned [${creep.name}] off [${this.role}]`);
    }
  }
  public hasRole(creep: Creep): boolean {
    return creep.memory.role === this.role;
  }
  abstract run(creep: Creep): ScreepsReturnCode | null;
}
