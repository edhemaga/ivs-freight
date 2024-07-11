import { LoadStopItem } from '@pages/load/pages/load-details/components/load-details-item/models/load-stop-item.model';
import { LoadResponse } from 'appcoretruckassist';

export interface LoadStop extends LoadResponse {
    items: LoadStopItem[];
}
