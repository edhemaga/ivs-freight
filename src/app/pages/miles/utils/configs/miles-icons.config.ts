import { SharedSvgRoutes } from '@shared/utils/svg-routes';

export class MilesIconsConfig {
    static IconConfig: { [key: string]: { icon: string; color: string } } = {
        pickup: {
            icon: SharedSvgRoutes.PICKUP_ICON,
            color: 'svg-fill-green',
        },
        delivery: {
            icon: SharedSvgRoutes.DELIVERY_ICON,
            color: 'svg-fill-orange-4',
        },
        fuel: { icon: SharedSvgRoutes.FUEL_ICON, color: 'svg-fill-blue-13' },
        deadhead: {
            icon: SharedSvgRoutes.MILEAGE_ICON,
            color: 'svg-fill-light-grey-2',
        },
        parking: {
            icon: SharedSvgRoutes.PARKING_ICON,
            color: 'svg-fill-blue-26',
        },
        repair: {
            icon: SharedSvgRoutes.REPAIR_ICON,
            color: 'svg-fill-orange-5',
        },
        towing: { icon: SharedSvgRoutes.TOWING_ICON, color: 'svg-fill-bw-9' },
    };
}
