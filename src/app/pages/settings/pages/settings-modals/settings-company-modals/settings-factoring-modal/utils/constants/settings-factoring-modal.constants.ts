import { Tabs } from '@shared/models';

export class SettingsFactoringModalConstants {
    static NOTICE_OF_ASSIGNMENT_TEXT_BASE = `<span style="font-weight: bold; font-size: large;">NOTICE OF ASSIGNMENT</span><div><br></div><div>This invoice has been assigned to, and must be paid directly to:</div><div><br></div><div><span style="font-weight: bold; font-size: large;">{{CompanyName}}</span></div>`;

    static ADDRESS_TABS: Tabs[] = [
        {
            id: 1,
            name: 'Physical Address',
            checked: true,
        },
        {
            id: 2,
            name: 'PO Box',
            checked: false,
        },
    ];
}
