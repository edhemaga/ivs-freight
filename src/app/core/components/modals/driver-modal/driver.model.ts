export interface CreateDriverCommand { 
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    email?: string | null;
    ssn?: string | null;
    note?: string | null;
    dateOfBirth?: string;
    offDutyLocations?: Array<CreateOffDutyLocationCommand> | null;
    isOwner?: boolean;
    ownerId?: number | null;
    ownerType?: OwnerType;
    ein?: string | null;
    bussinesName?: string | null;
    city?: string | null;
    state?: string | null;
    address?: string | null;
    country?: string | null;
    zipCode?: string | null;
    stateShortName?: string | null;
    addressUnit?: string | null;
    bankId?: number | null;
    account?: string | null;
    routing?: string | null;
    payroll?: boolean;
    payType?: number | null;
    mailNotification?: boolean | null;
    phoneCallNotification?: boolean | null;
    smsNotification?: boolean | null;
    solo: PerMileEntity;
    team: PerMileEntity;
    commissionSolo?: number | null;
    commissionTeam?: number | null;
    twic?: boolean;
    twicExpDate?: string | null;
    fuelCard?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelationship?: string | null;
}

export interface PerMileEntity { 
    emptyMile?: number | null;
    loadedMile?: number | null;
    perStop?: number | null;
}

export type OwnerType = 'Company' | 'Proprietor';

export const OwnerType = {
    Company: 'Company' as OwnerType,
    Proprietor: 'Proprietor' as OwnerType
};

export interface CreateOffDutyLocationCommand { 
    nickname?: string | null;
    city?: string | null;
    state?: string | null;
    address?: string | null;
    country?: string | null;
    zipCode?: string | null;
    stateShortName?: string | null;
    addressUnit?: string | null;
}