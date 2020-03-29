import { WorkerFactory } from "creep/factory/worker";

import { Builder } from "creep/role/builder";
import { Harvester } from "creep/role/harvester";
import { Upgrader } from "creep/role/upgrader";

import { CreepManager } from "creep/manager";
import { RoomManager } from "room/manager";

export const instances = {
    workerFactory: new WorkerFactory(),

    builder: new Builder(),
    harvester: new Harvester(),
    upgrader: new Upgrader(),

    creepManager: new CreepManager(),
    roomManagers: new Map<string, RoomManager>(),
};
