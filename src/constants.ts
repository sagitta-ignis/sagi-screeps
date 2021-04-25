import { Builder } from "creep/role/builder";
import { CreepManager } from "creep/manager";
import { Harvester } from "creep/role/harvester";
import { RoomManager } from "room/manager";
import { Upgrader } from "creep/role/upgrader";
import { WorkerFactory } from "creep/factory/worker";

export const instances = {
  workerFactory: new WorkerFactory(),

  builder: new Builder(),
  harvester: new Harvester(),
  upgrader: new Upgrader(),

  creepManager: new CreepManager(),
  roomManagers: new Map<string, RoomManager>()
};
