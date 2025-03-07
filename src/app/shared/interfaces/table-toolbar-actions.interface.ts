import { IViewModeOption } from "@shared/models/index";

export interface ITableToolbarActions {
    hideActivationButton?: boolean;
    showTimeFilter?: boolean,
    showStatusFilter?: boolean,
    showMoneyFilter?: boolean,
    loadMoneyFilter?: boolean,
    showLabelFilter?: boolean,
    hideDeleteButton?: boolean,
    viewModeOptions?: IViewModeOption[],
    showCountSelectedInList?: boolean,
    hideWidth?: string | number,
    hideOpenModalButton?: boolean,
    showGeneralPmBtn?: boolean,
    showDispatchAdd?: boolean,
    showDispatchSettings?: boolean,
    hideListColumn?: boolean,
    hidePrintButton?: boolean,
    showHireApplicantButton?: boolean,
    showDropdown?: boolean,
    hideDataCount?: boolean,
}