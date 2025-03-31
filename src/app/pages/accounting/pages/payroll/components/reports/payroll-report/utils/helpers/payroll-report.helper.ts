import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { IDropdownMenuLoadItem } from '@pages/accounting/pages/payroll/state/models';

export class PayrollReportHelper {
    static getPayrollDropdownContent(
        isTabChange: boolean,
        selectedTab: string,
        isEditLoadDropdownActionActive: boolean,
        loadList?: IDropdownMenuLoadItem[]
    ): IDropdownMenuItem[] {
        const isOpenPayroll = selectedTab === ePayrollTablesStatus.OPEN;

        return isTabChange || !isEditLoadDropdownActionActive
            ? DropdownMenuContentHelper.getPayrollDropdownContent(isOpenPayroll)
            : DropdownMenuContentHelper.getPayrollSelectLoadDropdownContent(
                  loadList
              );
    }
}