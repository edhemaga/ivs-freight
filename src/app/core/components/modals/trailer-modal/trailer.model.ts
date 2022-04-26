export interface CreateTrailerCommand { 
    companyOwned?: boolean;
    trailerNumber?: string | null;
    trailerTypeId?: number;
    vin?: string | null;
    trailerMakeId?: number;
    model?: string | null;
    colorId?: number | null;
    year?: number;
    trailerLengthId?: number;
    ownerId?: number | null;
    note?: string | null;
    axles?: number | null;
    suspension?: number | null;
    tireSizeId?: number | null;
    doorType?: number | null;
    reeferUnit?: number | null;
    emptyWeight?: number | null;
    mileage?: number | null;
    volume?: number | null;
    insurancePolicy?: string | null;
}