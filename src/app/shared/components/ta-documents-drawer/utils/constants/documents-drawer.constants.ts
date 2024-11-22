import { DrawerActionColumn } from '@shared/components/ta-documents-drawer/models';

export class DocumentsDrawerConstants {
    static DRAWER_ACTION_COLUMNS: DrawerActionColumn[] = [
        {
            title: 'Download All',
            iconRoute: 'assets/svg/common/ic_download.svg',
        },
        {
            title: 'Close',
            iconRoute: 'assets/svg/applicant/close-x.svg',
        },
        {
            title: 'Options',
            iconRoute: 'assets/svg/truckassist-table/dropdown/dropdown.svg',
        },
    ];
}
