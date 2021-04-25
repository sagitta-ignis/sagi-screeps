// example declaration file - remove these and add your own custom typings

import { CreepNeeds } from "room/needs/creep";
import { Roles } from "creep/roles.enum";
import { Types } from "creep/types.enum";

declare global {
  // memory extension samples
  interface CreepMemory {
    type: Types;
    role?: Roles;
    working?: boolean;
    target?: { id: string; x: number; y: number };
  }

  interface RoomMemory {
    needs: {
      creeps: CreepNeeds;
    };
    harvestSpots: number;
    harvestSource: { x: number; y: number };
    reservedSources: { [index: string]: number };
  }

  interface SpawnMemory {
    task?: boolean;
  }

  interface Memory {
    uuid: number;
    log: any;
  }
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
