export interface ConfirmationMove {
    template: string;
    type: string;
    modalTitle: string;
    modalSecondTitle?: string;
    tableType: string;
    subType: string;
    subTypeStatus: string;
    data: any;
    array?: any[];
    action?: string;
}
