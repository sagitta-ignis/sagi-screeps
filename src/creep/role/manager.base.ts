import { Roles } from "../roles.enum";
import { RoleManagers } from "./managers";
import { RoleManager } from "./manager.interface";

export abstract class BaseRoleManager implements RoleManager {

    constructor(private role: Roles) {
        RoleManagers.add(role, this);
    };

    assign(creep: Creep): void {
        (creep.memory as any).role = this.role;
    }
    unassign(creep: Creep): void {
        (creep.memory as any).role = undefined;
    }
    hasRole(creep: Creep): boolean {
        return (creep.memory as any).role == this.role;
    }
    abstract run(creep: Creep): ScreepsReturnCode;
}
