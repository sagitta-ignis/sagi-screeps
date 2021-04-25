export interface Assigner {
  assign(creep: Creep): void;
  unassign(creep: Creep): void;
}

export interface RoleManager extends Assigner {
  hasRole(creep: Creep): boolean;
  run(creep: Creep): ScreepsReturnCode | null;
}
