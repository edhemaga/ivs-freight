import { LoadDetailsConstants } from '@pages/load/pages/load-details/utils/constants/load-details.constants';

// models
import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';
import { DetailsConfig } from '@shared/models/details-config.model';
import { LoadResponse } from 'appcoretruckassist';
import { MultipleSelectDetailsDropdownItem } from '@shared/models/multiple-select-details-dropdown-item.model';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { eGeneralActions } from '@shared/enums';

export class LoadDetailsHelper {
    static getDetailsDropdownOptions(
        load: LoadResponse
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
                    name: eGeneralActions.EDIT,
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    iconName: eGeneralActions.EDIT,
                    subText: load.statusType.name.toUpperCase(),
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
                    iconName: eGeneralActions.DELETE_LOWERCASE,
                    disabled: LoadDetailsHelper.enableDeleteButton(
                        load.statusType.name
                    ),
                    danger: true,
                    show: true,
                    redIcon: true,
                },
            ],
        };
    }

    static getLoadDetailsConfig(
        load: LoadResponse,
        dropdownItemId: number = 1
    ): DetailsConfig[] {
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
                    (load.stops[0].stopType.id === 0 &&
                        load.stops?.length === 3) ||
                    load.stops?.length === 2
                        ? false
                        : load.stops?.length - 3 + ' EXTRA',
                hasMultipleDetailsSelectDropdown: false,
                data: load,
                length:
                    load.stops[0].stopType.id === 0
                        ? load.stops?.length - 1
                        : load.stops?.length,
            },
            {
                id: 2,
                name: dropdownItemId === 1 ? 'Comment' : 'Status History',
                template: 'comment',
                hide: dropdownItemId !== 1,
                hasDanger: false,
                hasArrow: true,
                capsulaText: false,
                hasMultipleDetailsSelectDropdown: true,
                multipleDetailsSelectDropdown:
                    this.getMultipleSelectDetailsDropdown(load, dropdownItemId),
                isSearchBtn: !!load?.comments?.length,
                data: load,
                businessOpen: true,
                length:
                    dropdownItemId === 1
                        ? load?.comments?.length
                        : load?.statusHistory?.length,
            },
        ];
    }

    static getMultipleSelectDetailsDropdown(
        load: LoadResponse,
        dropdownItemId: number = 1
    ): MultipleSelectDetailsDropdownItem[] {
        let multipleSelectDetailsDropdown: MultipleSelectDetailsDropdownItem[] =
            JSON.parse(
                JSON.stringify(
                    LoadDetailsConstants.MULTIPLE_SELECT_DETAILS_DROPDOWN
                )
            );

        if (dropdownItemId) {
            multipleSelectDetailsDropdown = multipleSelectDetailsDropdown.map(
                (dropdownItem) => {
                    return {
                        ...dropdownItem,
                        isActive: dropdownItem.id === dropdownItemId,
                    };
                }
            );
        }

        return multipleSelectDetailsDropdown.map((dropdownItem, index) => {
            return {
                ...dropdownItem,
                length:
                    index === 0
                        ? load?.comments?.length
                        : load?.statusHistory?.length,
            };
        });
    }

    static enableDeleteButton(loadTypeName: string): boolean {
        return !(
            loadTypeName?.toLowerCase() === TableStringEnum.TEMPLATE ||
            loadTypeName?.toLowerCase() === TableStringEnum.PENDING
        );
    }
}
