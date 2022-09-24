declare global {
  interface RoomMemory {
    objective: RoomObjective | undefined;
  }
}

export enum RoomObjective {
  UpgradeController
}
