// example declaration file - remove these and add your own custom typings

import { Types } from "creep/types.enum";
import { Roles } from "creep/roles.enum";

// memory extension samples
interface CreepMemory {
  type: Types;
  role: Roles;
  room: string;
  working: boolean;
}

interface Memory {
  uuid: number;
  log: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
