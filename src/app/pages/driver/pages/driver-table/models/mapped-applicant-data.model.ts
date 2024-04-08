import { DropdownItem } from 'src/app/shared/models/dropdown-item.model';

export interface MappedApplicantData {
    isSelected: boolean;
    invitedDate?: string | null;
    acceptedDate: string;
    doB: string;
    applicationStatus: string;
    mvrStatus: string;
    pspStatus: string;
    sphStatus: string;
    hosStatus: string;
    ssnStatus: string;
    medicalDaysLeft: number;
    medicalPercentage: number;
    cdlDaysLeft: number;
    cdlPercentage: number;
}

export interface MappedApplicantData {
    tableInvited: string;
    isSelected: boolean;
    tableAccepted: string | null;
    tableDOB: string | null;
    tableApplicantProgress: {
        title: string;
        status: string | null;
        width: number;
        class: string;
        percentage: number;
    }[];
    tableMedical: {
        class: string;
        hideProgres: boolean;
        isApplicant: boolean;
        expirationDays: string | null;
        percentage: number | null;
    };
    tableCdl: {
        class: string;
        hideProgres: boolean;
        isApplicant: boolean;
        expirationDays: string | null;
        percentage: number | null;
    };
    tableRev: {
        title: string;
        iconLink: string;
    };
    hire: boolean;
    isFavorite: boolean;
    tableDropdownContent: {
        hasContent: boolean;
        content: DropdownItem[];
    };
}
