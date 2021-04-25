export function availableStorage(structure: AnyStoreStructure): boolean {
  return (
    (structure.structureType === STRUCTURE_EXTENSION ||
      structure.structureType === STRUCTURE_SPAWN ||
      structure.structureType === STRUCTURE_TOWER) &&
    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  );
}
