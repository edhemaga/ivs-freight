import { DriverDetailsFuelCardResponse } from 'appcoretruckassist';

export interface AdditionalInfoItem {
    title: string;
    content: string | DriverDetailsFuelCardResponse;
}
