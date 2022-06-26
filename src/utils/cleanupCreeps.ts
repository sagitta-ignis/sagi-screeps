/**
 * Automatically delete memory of missing creeps
 */
export function cleanupCreeps(): void {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}
