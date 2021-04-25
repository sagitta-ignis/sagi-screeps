import { availableEnergy, harvestSpots } from "utils/source";
import { BuildExtensionTask } from "./task/build-extension";
import { BuildTask } from "./task/build";
import { CreepCounters } from "./needs/creep";
import { HarvestTask } from "./task/harvest";
import { ReassignTask } from "./task/reassign";
import { Roles } from "creep/roles.enum";
import { SpawnTask } from "./task/spawn";
import { Task } from "./task/task";
import { Types } from "creep/types.enum";
import { UpgradeControllerTask } from "./task/upgrader-controller";

export class RoomManager {
  public constructor(private room: Room) {
    const memory = room.memory;
    if (!memory.needs) {
      memory.needs = {
        creeps: {
          harvester: 1,
          upgrader: -1,
          builder: 0
        }
      };
    }
    if (!memory.harvestSpots) {
      memory.harvestSpots = this.countHarvestSpots();
    }
    if (!memory.harvestSource) {
      memory.harvestSource = this.findHarvestSource();
    }
    if (!memory.reservedSources) {
      memory.reservedSources = {};
    }
  }

  public analyze(): Task[] {
    const tasks: Task[] = [];
    const memory = this.room.memory;

    const counter = {
      creeps: this.countCreeps()
    };

    const reassign = new ReassignTask(counter.creeps);
    if (reassign.canExecute(this.room)) {
      reassign.execute(this.room);
    }

    if (this.needCreeps(counter.creeps)) {
      const isSpawning = this.room.find(FIND_MY_SPAWNS, { filter: spawn => spawn.spawning }).length > 0;
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

    const build = new BuildTask();
    if (build.canExecute(this.room)) {
      tasks.push(build);
    }

    const buildExtensionTask = new BuildExtensionTask(counter.creeps);
    if (buildExtensionTask.canExecute(this.room)) {
      tasks.push(buildExtensionTask);
    }

    return tasks;
  }

  private countCreeps() {
    return this.room.find(FIND_MY_CREEPS).reduce(
      (counter, creep) => {
        if (creep.memory.role) {
          const role = creep.memory.role;
          return { ...counter, [role]: counter[role] + 1 };
        }
        return counter;
      },
      Object.values(Roles).reduce((counter, role) => ({ ...counter, [role]: 0 }), {} as CreepCounters)
    );
  }

  private needCreeps(counters: CreepCounters) {
    const memory = this.room.memory;
    for (const need in memory.needs.creeps) {
      if (memory.needs.creeps[need as Roles] > counters[need as Roles]) {
        return true;
      }
    }
    return false;
  }

  private countHarvestSpots() {
    const availableSources = this.room.find(FIND_SOURCES_ACTIVE, { filter: availableEnergy });
    return harvestSpots(availableSources);
  }

  private findHarvestSource(): { x: number; y: number } {
    const spawn = this.room.find(FIND_MY_SPAWNS)[0];
    const source = spawn.pos.findClosestByPath(FIND_SOURCES);
    if (source) return { x: source.pos.x, y: source.pos.y };
    else return { x: -1, y: -1 };
  }

  public run(): void {
    const currentTasks = this.analyze();
    for (const task of currentTasks) {
      task.execute(this.room);
    }
  }
}
