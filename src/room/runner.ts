import { findRoomObjective, prepareRoomObjectiveTasks } from "objective/room-objective.analyzer";
import { RoomObjective } from "objective/room-objective.enum";

export class RoomRunner {
  public static runAllRooms(): void {
    const rooms = Object.entries(Game.rooms);
    for (const [name, room] of rooms) {
      const runner = new RoomRunner(name, room);
      runner.execute();
    }
  }

  public constructor(private name: string, private room: Room) {}

  public execute(): void {
    const memory = this.room.memory;
    if (memory.objective === undefined) {
      memory.objective = findRoomObjective(this.room);
    }
    if (memory.objective) {
      const tasks = prepareRoomObjectiveTasks(this.room);
    }
  }
}
