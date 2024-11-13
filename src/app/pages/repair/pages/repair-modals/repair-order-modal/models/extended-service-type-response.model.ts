import { ServiceTypeResponse } from 'appcoretruckassist';

export interface ExtendedServiceTypeResponse
    extends Omit<ServiceTypeResponse, 'serviceType'> {
    id?: number;
    serviceType: string;
    active?: boolean;
    isSelected?: boolean;
}
