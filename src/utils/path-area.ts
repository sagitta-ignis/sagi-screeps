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
