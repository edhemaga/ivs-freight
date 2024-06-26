import { LoadDetailsConstants } from '@pages/load/pages/load-details/utils/constants/load-details.constants';

// models
import { DetailsDropdownOptions } from '@pages/driver/pages/driver-details/models/details-dropdown-options.model';
import { DetailsConfig } from '@shared/models/details-config.model';
import { LoadResponse } from 'appcoretruckassist';
import { MultipleSelectDetailsDropdownItem } from '@pages/load/pages/load-details/components/load-details-item/models/multiple-select-details-dropdown-item.model';

export class LoadDetailsHelper {
    static getDetailsDropdownOptions(
        statusType: string
    ): DetailsDropdownOptions {
        return {
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
                    subText: statusType.toUpperCase(),
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
        };
    }

    static getLoadDetailsConfig(load: LoadResponse): DetailsConfig[] {
        return [
            {
                id: 0,
                name: 'Load Detail',
                template: 'general',
                capsulaText: false,
                hasMultipleDetailsSelectDropdown: false,
                data: load,
            },
            {
                id: 1,
                name: 'Stop',
                template: 'stop',
                req: false,
                hide: true,

                isMapDisplayed: true,
                isMapBtn: true,
                capsulaText:
                    load.stops?.length === 2
                        ? false
                        : load.stops?.length - 2 + ' EXTRA',
                hasMultipleDetailsSelectDropdown: false,
                data: load,
                length: load.stops?.length,
            },
            {
                id: 2,
                name: 'Comment',
                template: 'comment',
                hide: false,
                hasDanger: false,
                hasArrow: true,
                capsulaText: false,
                hasMultipleDetailsSelectDropdown: true,
                multipleDetailsSelectDropdown:
                    this.getMultipleSelectDetailsDropdown(load),
                data: load,
                length: load?.comments?.length,
            },
        ];
    }

    static getMultipleSelectDetailsDropdown(
        load: LoadResponse
    ): MultipleSelectDetailsDropdownItem[] {
        return LoadDetailsConstants.MULTIPLE_SELECT_DETAILS_DROPDOWN.map(
            (dropdownItem, index) => {
                return {
                    ...dropdownItem,
                    length:
                        index === 0
                            ? load?.comments?.length
                            : load?.statusHistory?.length,
                };
            }
        );
    }
}
