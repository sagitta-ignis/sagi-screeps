export function freeSpaceAround(object: RoomObject) {
    if (object.room) {
        const pos = object.pos;
        const area = object.room.lookAtArea(
            pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1, true
        )
        return area.filter((res) => !res.structure && res.type === LOOK_TERRAIN && res.terrain !== 'wall')
    }
    return [];
}
