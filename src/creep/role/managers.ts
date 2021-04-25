import { RoleManager } from "./manager.interface";
import { Roles } from "../roles.enum";

export class RoleManagers {
  public static byRoles = new Map<Roles, RoleManager>();

  public static add(role: Roles, manager: RoleManager): void {
    this.byRoles.set(role, manager);
  }

  public static findBy(role: Roles): RoleManager {
    const assigner = this.byRoles.get(role);
    if (!assigner) {
      console.log(`[ERROR] Missing assigner for type [${role}]`);
    }
    return (
      assigner || {
        hasRole: () => false,
        assign: () => {
          return;
        },
        unassign: () => {
          return;
        },
        run: () => {
          return null;
        }
      }
    );
  }
}
