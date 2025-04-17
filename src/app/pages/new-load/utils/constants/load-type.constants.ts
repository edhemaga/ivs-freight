// Models
import { LoadType } from 'appcoretruckassist';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

export class LoadTypeConstants {
    static LOAD_TYPE_ICON: Record<LoadType, string> = {
        FTL: SharedSvgRoutes.LOAD_FILLED,
        LTL: SharedSvgRoutes.LTL_FILLED,
        Combo: SharedSvgRoutes.LTLC_FILLED,
    };
}
