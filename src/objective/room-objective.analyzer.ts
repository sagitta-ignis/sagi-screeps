import { RoomObjective } from "./room-objective.enum";
import { RoomTask } from "./room-task.enum";

export function findRoomObjective(room: Room): RoomObjective | undefined {
  return RoomObjective.UpgradeController;
}

export function prepareRoomObjectiveTasks(room: Room): RoomTask[] {
  return [];
}
