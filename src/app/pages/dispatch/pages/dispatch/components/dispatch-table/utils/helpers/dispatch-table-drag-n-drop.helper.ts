export class DispatchTableDragNDropHelper {
    static getTrailerAllowedTruckIds(trailerId: number): number[] {
        return trailerId === 16 ? [10] : [1, 2, 9, 11];
    }
}
