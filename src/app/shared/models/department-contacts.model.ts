import {
    BrokerContactGroupResponse,
    ShipperContactGroupResponse,
} from 'appcoretruckassist';

export interface DepartmentContacts {
    id?: number;
    name: string;
    contacts: ShipperContactGroupResponse[] | BrokerContactGroupResponse[];
}
