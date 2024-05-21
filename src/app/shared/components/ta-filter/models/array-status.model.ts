export interface ArrayStatus {
    id?: number;
    name?: string;
    color?: string;
    hidden?: boolean;
    avatar?: string;
    isSelected?: boolean;
    currentSet?: boolean;
    icon?: string;
    truckNumber?: string;
    trailerNumber?: string;
    activeIcon?: string;
    image?: string;
    truckType?: TruckType;
    short?: string;
    count?: number;
}

interface TruckType {
    companyId?: string;
    id?: number;
    logoName?: string;
    name?: string;
}
