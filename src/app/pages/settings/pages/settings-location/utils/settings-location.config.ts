// Enums
import { eGeneralActions } from '@shared/enums';

export class SettingsLocationConfig {
    static options = {
        disabledMutedStyle: null,
        toolbarActions: {
            hideViewMode: false,
        },
        config: {
            showSort: true,
            sortBy: '',
            sortDirection: '',
            disabledColumns: [0],
            minWidth: 60,
        },
        actions: [
            {
                title: 'Edit',
                name: eGeneralActions.EDIT_LOWERCASE,
                svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                show: true,
                iconName: eGeneralActions.EDIT_LOWERCASE,
            },
            {
                title: 'border',
            },
            {
                title: 'View Details',
                name: 'view-details',
                svg: 'assets/svg/common/ic_hazardous-info.svg',
                show: true,
                iconName: 'view-details',
            },
            {
                title: 'border',
            },
            {
                title: 'Share',
                name: 'share',
                svg: 'assets/svg/common/share-icon.svg',
                show: true,
                iconName: 'share',
            },
            {
                title: 'Print',
                name: 'print',
                svg: 'assets/svg/common/ic_fax.svg',
                show: true,
                iconName: 'print',
            },
            {
                title: 'border',
            },
            {
                title: 'Delete',
                name: 'delete-item',
                type: 'driver',
                svg: 'assets/svg/common/ic_trash_updated.svg',
                danger: true,
                show: true,
                redIcon: true,
                iconName: eGeneralActions.DELETE_LOWERCASE,
            },
        ],
        export: true,
    };
}
