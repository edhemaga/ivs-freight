import { RepairShopMapSvgRoutes } from '../svg-routes/repair-shop-map-svg-routes';

export class RepairShopMapMarkersHelper {
    static getMapMarker(data): string {
        let markerIconRoute = RepairShopMapSvgRoutes.defaultMarkerIcon;

        if (!data.status)
            markerIconRoute = RepairShopMapSvgRoutes.closedMarkerIcon;
        else if (data.isFavorite)
            markerIconRoute = RepairShopMapSvgRoutes.favoriteMarkerIcon;

        return markerIconRoute;
    }
}
