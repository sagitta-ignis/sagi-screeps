import { Types } from "creep/types.enum";
import { Roles } from "creep/roles.enum";
import { SpawnTask } from "./task/spawn";
import { Task } from "./task/task";
import { roomMemory } from "./memory";

export class RoomManager {

    private tasks: Task[] = [];

    constructor(private room: Room) {

    }

    analyze(): Task[] {
        const memory = roomMemory(this.room);

        if (!memory.needs) {
            memory.needs = {
                harvester: this.countAvailableEnergySpots(),
                upgrader: 2,
                builder: 0
            };
        }

        if (memory.needs.harvester > 0 || memory.needs.upgrader > 0 || memory.needs.builder > 0) {
            const allInactiveSpawns = this.room.find(FIND_MY_SPAWNS, { filter: (spawn) => !spawn.spawning });
            let available = allInactiveSpawns.length;
            while (available > 0) {
                if (memory.needs.harvester > 0) {
                    this.tasks.push(new SpawnTask(this.room, allInactiveSpawns, Types.Worker, Roles.Harvester));
                } else if (memory.needs.upgrader > 0) {
                    this.tasks.push(new SpawnTask(this.room, allInactiveSpawns, Types.Worker, Roles.Upgrader));
                } else if (memory.needs.builder > 0) {
                    this.tasks.push(new SpawnTask(this.room, allInactiveSpawns, Types.Worker, Roles.Builder));
                }
                available--;
            }
        }

        return this.tasks;
    }

    private countAvailableEnergySpots() {
        return 3;
    }

    run(): void {
        let currentTasks = this.analyze();
        let nextTasks = [];
        for (let index in currentTasks) {
            const task = currentTasks[index];
            if (task.execute(this.room) !== OK) {
                nextTasks.push(task);
            }
        }
        this.tasks = nextTasks;
    }
}
