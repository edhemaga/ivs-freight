import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

export class PayrollReportHelper {
    static getPayrollDropdownContent(
        isTabChange: boolean,
        selectedTab: string,
        isEditLoadDropdownActionActive: boolean,
        loadList?: { id: number; title: string }[]
    ): IDropdownMenuItem[] {
        const isOpenPayroll = selectedTab === ePayrollTablesStatus.OPEN;

        return isTabChange || !isEditLoadDropdownActionActive
            ? DropdownMenuContentHelper.getPayrollDropdownContent(isOpenPayroll)
            : DropdownMenuContentHelper.getPayrollSelectLoadDropdownContent(
                  loadList
              );
    }
}
