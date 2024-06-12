export enum OpenHourDays {
    MON_FRI = 'MON - FRI',
    Sunday = 'Sunday',
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
}

export enum RepairShopModalEnum {
    TAB_TITLE_DETAILS = "Details",
    TAB_TITLE_CONTACT = "Additional",
    TAB_TITLE_REVIEW = 'Review',
    MODAL_TITLE_ADD = "Add Repair Shop",
    MODAL_TITLE_EDIT = "Edit Repair Shop",
    EDIT_ACTION = 'edit',
    ADD_FAVORITE = 'Favorite',
    REMOVE_FAVORITE = 'Unfavorite'
}

export enum ActionTypesEnum {
    SAVE_AND_ADD_NEW = 'save and add new',
    DELETE = 'delete',
    CLOSE = 'close',
    SAVE = 'save',
    CLOSE_BUSINESS = 'CLOSE_BUSINESS',
}

export enum OpenWorkingHours {
    MIDNIGHT = '00:00:00 AM',
    EIGHTAM  = '8:00:00 AM',
    FIVEAM = '5:00:00 AM',
    FIVEPM = '5:00:00 PM',
    NOON = '00:00:00 PM'
}

export enum EditDataKey {
    REPAIR_MODAL = 'repair-modal',
}

export type WorkingHoursType = OpenHourDays[];
