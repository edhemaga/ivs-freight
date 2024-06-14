import { DetailsDropdownOptions } from '@pages/driver/pages/driver-details/models/details-dropdown-options.model';

export class DriverDetailsHelper {
    static getCdlOptionsDropdownList(
        isCdlRenewArray: boolean[],
        isCdlActivateDeactivateArray: boolean[],
        isCdlExpiredArray: boolean[],
        currentCdlIndex: number
    ): DetailsDropdownOptions {
        return JSON.parse(
            JSON.stringify({
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
                        name: 'edit',
                        svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                        iconName: 'edit',
                        show: true,
                    },
                    {
                        title: 'border',
                    },
                    {
                        title: 'View Details',
                        name: 'view-details',
                        svg: 'assets/svg/common/ic_hazardous-info.svg',
                        iconName: 'view-details',
                        show: true,
                    },
                    {
                        title: 'Renew',
                        name: 'renew',
                        svg: 'assets/svg/common/ic_reload_renew.svg',
                        iconName: 'renew',
                        disabled: isCdlRenewArray[currentCdlIndex],
                    },
                    {
                        title: 'border',
                    },
                    {
                        title: 'Share',
                        name: 'share',
                        svg: 'assets/svg/common/share-icon.svg',
                        iconName: 'share',
                        show: true,
                    },
                    {
                        title: 'Print',
                        name: 'print',
                        svg: 'assets/svg/common/ic_fax.svg',
                        iconName: 'print',
                        show: true,
                    },
                    {
                        title: 'border',
                    },
                    {
                        title: isCdlActivateDeactivateArray[currentCdlIndex]
                            ? 'Activate'
                            : 'Void',
                        name: isCdlActivateDeactivateArray[currentCdlIndex]
                            ? 'activate-item'
                            : 'deactivate-item',
                        iconName: isCdlActivateDeactivateArray[currentCdlIndex]
                            ? 'activate-item'
                            : 'deactivate-item',
                        svg: isCdlActivateDeactivateArray[currentCdlIndex]
                            ? 'assets/svg/common/ic_deactivate.svg'
                            : 'assets/svg/common/ic_cancel_violation.svg',
                        show: !isCdlExpiredArray[currentCdlIndex],
                        redIcon: isCdlActivateDeactivateArray[currentCdlIndex],
                        blueIcon: isCdlActivateDeactivateArray[currentCdlIndex],
                        disabled:
                            !isCdlActivateDeactivateArray[currentCdlIndex] &&
                            isCdlExpiredArray[currentCdlIndex],
                    },
                    {
                        title: 'Delete',
                        name: 'delete-item',
                        type: 'driver',
                        text: 'Are you sure you want to delete driver(s)?',
                        svg: 'assets/svg/common/ic_trash_updated.svg',
                        iconName: 'delete',
                        danger: true,
                        show: true,
                        redIcon: true,
                    },
                ],
                export: true,
            })
        );
    }
}
