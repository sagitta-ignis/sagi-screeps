import { ErrorMapper } from "utils/ErrorMapper";

import { RoomManager } from "room/manager";

import { instances } from "./constants";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  // Room management
  for (const name in Game.rooms) {
    const room = Game.rooms[name];
    let roomManager = instances.roomManagers.get(name);
    if (!roomManager) {
      roomManager = new RoomManager(room);
      instances.roomManagers.set(name, roomManager);
    }
    roomManager.run();
  }

  // Creep management
  instances.creepManager.run();
});
