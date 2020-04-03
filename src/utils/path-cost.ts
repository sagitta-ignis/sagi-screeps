export function terrainSpeed(terrainType: 0 | TERRAIN_MASK_WALL | TERRAIN_MASK_SWAMP): number {
    switch (terrainType) {
        case TERRAIN_MASK_SWAMP:
            return 5;
        case TERRAIN_MASK_WALL:
            return 255;
        default:
            return 1;
    }
}

export interface Area {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export function pathArea(path: PathStep[]): Area {
    return path.reduce(
        (area, tile) => <Area>{
            top: Number.isInteger(area.top) ? Math.min(area.top, tile.y) : tile.y,
            right: Number.isInteger(area.right) ? Math.min(area.right, tile.x) : tile.x,
            bottom: Number.isInteger(area.bottom) ? Math.max(area.bottom, tile.y) : tile.y,
            left: Number.isInteger(area.left) ? Math.max(area.left, tile.x) : tile.x
        },
        <Area>{}
    );
}

export function lookForTerrainAt(look: LookForAtAreaResultMatrix<Terrain, 'terrain'>, step: PathStep) {
    if (look && look[step.y] && look[step.y][step.x]) {
        return look[step.y][step.x][0];
    }
    return undefined;
}

export function pathCost(room: Room, path: PathStep[]): number {
    let ticksRequired = 0;
    for (let step of path) {
        const terrainForStep = room.getTerrain().get(step.x, step.y);
        const defaultTicks = terrainSpeed(terrainForStep);

        // Perform calculation by looking at bodymove cost (based on body)
        // and carry cost (based on energy)
        const moveCost = 1;

        // LOGIC TO CALCULATE MOVECOST
        // ...

        // Multiply that by defaultTicks
        ticksRequired += defaultTicks * moveCost;
    }
    return ticksRequired;
}
