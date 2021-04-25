export interface FactoryBuildReturn {
  code: ScreepsReturnCode;
  creep?: Creep;
}

export interface CreepFactory {
  cost: number;
  buildIn(spawn: StructureSpawn): FactoryBuildReturn;
}
