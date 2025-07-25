export interface TableCardBodyActions<T> {
    type: string;
    id?: number;
    data?: T;
    isFinishOrder?: boolean;
    subType?: string;
    isActive?: boolean;
}
