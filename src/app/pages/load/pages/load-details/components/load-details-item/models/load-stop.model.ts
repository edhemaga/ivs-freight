import { LoadStopItem } from '@pages/load/pages/load-details/components/load-details-item/models/load-stop-item.model';
import { LoadStopResponse } from 'appcoretruckassist';

export interface LoadStop extends Omit<LoadStopResponse, 'items'> {
    items: LoadStopItem[];
}
