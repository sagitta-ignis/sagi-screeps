import { Types } from "creep/types.enum";
import { Roles } from "creep/roles.enum";
import { SpawnTask } from "./task/spawn";
import { Task } from "./task/task";
import { roomMemory } from "./memory";
import { creepMemory } from "creep/memory";
import { CreepCounters } from "./needs/creep";
import { UpgradeControllerTask } from "./task/upgrader-controller";
import { ReassignTask } from "./task/reassign";
import { HarvestTask } from "./task/harvest";

export class RoomManager {

    constructor(private room: Room) {
        const memory = roomMemory(this.room);
        if (!memory.needs) {
            memory.needs = {
                creeps: {
                    harvester: 1,
                    upgrader: -1,
                    builder: 0
                }
            };
        }
        if (!memory.reservedSources) {
            memory.reservedSources = {};
        }
    }

    analyze(): Task[] {
        const tasks: Task[] = [];
        const memory = roomMemory(this.room);

        const counter = {
            creeps: this.countCreeps()
        };

        if (this.needCreeps(counter.creeps)) {

            const reassign = new ReassignTask(counter.creeps);
            if (reassign.canExecute(this.room)) {
                reassign.execute(this.room);
            }

            const isSpawning = this.room.find(FIND_MY_SPAWNS, { filter: (spawn) => spawn.spawning }).length > 0;
            if (!isSpawning) {
                if (memory.needs.creeps.harvester > counter.creeps.harvester) {
                    const harvester = new SpawnTask(Types.Worker, Roles.Harvester);
                    if (harvester.canExecute(this.room)) {
                        tasks.push(harvester);
                    }
                }
                if (memory.needs.creeps.upgrader > counter.creeps.upgrader) {
                    const upgrader = new SpawnTask(Types.Worker, Roles.Upgrader);
                    if (upgrader.canExecute(this.room)) {
                        tasks.push(upgrader);
                    }
                }
                if (memory.needs.creeps.builder > counter.creeps.builder) {
                    const builder = new SpawnTask(Types.Worker, Roles.Builder);
                    if (builder.canExecute(this.room)) {
                        tasks.push(builder);
                    }
                }
            }
        }

        if (this.room.controller) {
            if (this.room.controller.my) {
                tasks.push(new UpgradeControllerTask(this.room.controller));
            }
        }

        const harvest = new HarvestTask();
        if (harvest.canExecute(this.room)) {
            tasks.push(harvest);
        }

        return tasks;
    }

    private countCreeps() {
        return this.room.find(FIND_MY_CREEPS).reduce(
            (counter, creep) => {
                const role = creepMemory(creep).role;
                return { ...counter, [role]: counter[role] + 1 }
            },
            Object.values(Roles).reduce((counter, role) => <any>{ ...counter, [role]: 0 }, {} as CreepCounters)
        );
    }

    private needCreeps(counters: CreepCounters) {
        const memory = roomMemory(this.room);
        for (let need in memory.needs.creeps) {
            if (memory.needs.creeps[need as Roles] > counters[need as Roles]) {
                return true;
            }
        }
        return false;
    }

    run(): void {
        let currentTasks = this.analyze();
        for (let index in currentTasks) {
            const task = currentTasks[index];
            task.execute(this.room);
        }
    }
}
