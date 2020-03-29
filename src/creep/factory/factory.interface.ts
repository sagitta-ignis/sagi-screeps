export type FactoryBuildReturn = { code: ScreepsReturnCode, creep?: Creep };

export interface CreepFactory {
    cost: number;
    buildIn(spawn: StructureSpawn): FactoryBuildReturn;
}
