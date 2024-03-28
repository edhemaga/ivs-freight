export interface RepairData {
    id: number;
    name: string;
    checked: boolean;
}

export interface RepairTypes {
    id: number;
    name: string;
    url: string;
}

export interface RepairDescriptionResponse {
    subtotal?: number;
    description: string;
    pm?: string;
    price?: string;
    qty?: number;
}

export interface Subtotal {
    index: number;
    subtotal: number;
}
