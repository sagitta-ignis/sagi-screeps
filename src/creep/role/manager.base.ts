import { Roles } from "../roles.enum";
import { RoleManagers } from "./managers";
import { RoleManager } from "./manager.interface";

export abstract class BaseRoleManager implements RoleManager {

    constructor(protected readonly role: Roles) {
        RoleManagers.add(role, this);
    };

    assign(creep: Creep): void {
        if ((creep.memory as any).role !== this.role) {
            (creep.memory as any).role = this.role;
            console.log(`Assigned [${creep.name}] as [${this.role}]`);
        }
    }
    unassign(creep: Creep): void {
        if ((creep.memory as any).role !== undefined) {
            (creep.memory as any).role = undefined;
            console.log(`Unassigned [${creep.name}] off [${this.role}]`);
        }
    }
    hasRole(creep: Creep): boolean {
        return (creep.memory as any).role == this.role;
    }
    abstract run(creep: Creep): ScreepsReturnCode;
}
