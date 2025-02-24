import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// models
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

export class PayrollReportHelper {
    static getPayrollDropdownContent(
        isTabChange: boolean,
        selectedTab: string,
        isEditLoadDropdownActionActive: boolean,
        loadList?: { id: number; title: string }[]
    ): DropdownMenuItem[] {
        const isOpenPayroll = selectedTab === ePayrollTablesStatus.OPEN;

        return isTabChange || !isEditLoadDropdownActionActive
            ? DropdownMenuContentHelper.getPayrollDropdownContent(isOpenPayroll)
            : DropdownMenuContentHelper.getPayrollSelectLoadDropdownContent(
                  loadList
              );
    }
}
