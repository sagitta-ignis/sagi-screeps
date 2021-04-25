export function harvestAndMoveRate(creep: Creep, travel: number): number {
  const carry = creep.store.getCapacity("energy");
  const work = 2;
  const move = 1;
  return carry / (carry / work + travel / move);
}
