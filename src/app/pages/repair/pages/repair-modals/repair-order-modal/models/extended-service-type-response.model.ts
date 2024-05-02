import { ServiceTypeResponse } from 'appcoretruckassist';

export interface ExtendedServiceTypeResponse
    extends Omit<ServiceTypeResponse, 'serviceType'> {
    serviceType: string;
    active?: boolean;
    isSelected?: boolean;
}
