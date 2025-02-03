import { PayrollDeleteModal } from "@pages/accounting/pages/payroll/state/models";

export interface Confirmation {
    template: string; // examples: driver, broker, shipper, cdl.....
    type:
        | 'delete'
        | 'multiple delete'
        | 'hire'
        | 'activate'
        | 'deactivate'
        | 'info'
        | 'reset'
        | 'close'
        | 'open'
        | 'void'
        | 'delete-item'; // if type is info => subtype must be: archive | ban list | dnu | void;
    id?: number; // id for item
    data?: any;
    array?: any[]; // multiple array of objects
    subType?:
        | 'archive'
        | 'ban list'
        | 'dnu'
        | 'cdl void'
        | 'mark'
        | 'truck'
        | 'trailer'
        | 'void cdl'
        | 'active'
        | 'pending'
        | 'template'
        | 'closed'
        | 'fuel'
        | 'favorite'; // if subType set, must set and subTypeStatus (except when subType: cdl void)
    subTypeStatus?: 'move' | 'remove'; // example: move -> 'Move to Ban List', remove -> 'Remove from Ban List', void -> void
    cdlStatus?: 'New' | 'Renew' | 'Activate';
    image?: boolean; // has image or not
    svg?: boolean; // has svg or not
    rating?: boolean; // has rating or not
    modalHeader?: boolean;
    modalHeaderTitle?: string;
    action?: string;
    extras?: PayrollDeleteModal;
}
