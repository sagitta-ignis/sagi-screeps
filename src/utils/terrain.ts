export function resultWithFreeSpace(res: LookAtResultWithPos) {
    return !res.structure && res.type === LOOK_TERRAIN && res.terrain !== 'wall';
}

export function freeSpaceAround(room: Room, pos: { x: number, y: number }) {
    const area = room.lookAtArea(
        pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1, true
    )
    return area.filter(resultWithFreeSpace);
}

export function freeSpaceAside(room: Room, path: PathStep[]) {
    const spaceAside = path.reduce(
        (area, step) => area.concat(freeSpaceAround(room, step)),
        [] as LookAtResultWithPos[]
    );
    return spaceAside.filter(res =>
        resultWithFreeSpace(res) &&
        !path.some(seg => seg.x === res.x && seg.y === res.y)
    )
}
