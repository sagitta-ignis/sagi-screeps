export interface Area {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function pathArea(path: PathStep[]): Area {
  return path.reduce(
    (area, tile) => ({
      top: isNaN(area.top) ? tile.y : Math.min(area.top, tile.y),
      right: isNaN(area.right) ? tile.x : Math.min(area.right, tile.x),
      bottom: isNaN(area.bottom) ? tile.y : Math.max(area.bottom, tile.y),
      left: isNaN(area.left) ? tile.x : Math.max(area.left, tile.x)
    }),
    {} as Area
  );
}
