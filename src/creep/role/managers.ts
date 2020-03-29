import { Roles } from "../roles.enum";
import { RoleManager } from "./manager.interface";

export class RoleManagers {

    static byRoles = new Map<Roles, RoleManager>();

    static add(role: Roles, manager: RoleManager) {
        this.byRoles.set(role, manager);
    }

    static findBy(role: Roles): RoleManager {
        const assigner = this.byRoles.get(role);
        if (!assigner) {
            console.log(`[ERROR] Missing assigner for type [${role}]`);
        }
        return assigner || { hasRole: () => false, assign: () => { }, unassign: () => { }, run: () => false };
    }
}
