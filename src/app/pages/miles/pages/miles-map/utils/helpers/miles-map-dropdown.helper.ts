// Models
import { MilesStopDetailsResponse } from 'appcoretruckassist';
import {
    MapDropdownContent,
    MapDropdownContentItem,
} from 'ca-components/lib/components/ca-map-dropdown/models';

// Enums
import { eSharedString } from '@shared/enums';

// Constants
import { MilesMapDataConstants } from '@pages/miles/pages/miles-map/utils/constants';

export class MilesMapDropdownHelper {
    static getMilesUnitMapDropdownConfig(
        data: MilesStopDetailsResponse
    ): MapDropdownContent {
        const stopType: eSharedString = data.type.name as eSharedString;

        const typeColor = MilesMapDataConstants.MILES_MAP_STOP_COLORS[stopType];

        const baseMainContent: MapDropdownContentItem[] = [
            {
                template: 'header-title',
                field: 'location',
                secondField: 'address',
                customClassText: 'text-ellipsis text-uppercase',
            },
            {
                template: 'stop-type',
                field: 'type',
                secondField: 'name',
                customClassText: `ca-font-semi-bold text-ellipsis text-color-${typeColor}`,
            },
            { template: 'divider', field: '' },
            {
                template: 'side-by-side',
                field: '',
                sideBySideInfo: {
                    leftSide: {
                        template: 'small-subtitle',
                        customClassText: 'ca-font-bold margin-b-2',
                        field: '',
                        title: 'Empty Miles',
                    },
                    rightSide: {
                        template: 'small-subtitle',
                        customClassText: 'ca-font-bold margin-b-2',
                        field: '',
                        title: 'Travel Time',
                    },
                },
            },
            {
                template: 'side-by-side',
                field: '',
                sideBySideInfo: {
                    leftSide: {
                        template: 'text',
                        customClassText:
                            'text-size-18 text-color-black ca-font-medium',
                        field: 'empty',
                    },
                    rightSide: {
                        template: 'travel-time',
                        customClassText:
                            'text-size-18 text-color-black ca-font-medium',
                        field: 'travelHours',
                        secondField: 'travelMinutes',
                    },
                },
            },
            { template: 'divider', field: '' },
        ];

        const conditionalSection: MapDropdownContentItem[] =
            stopType === eSharedString.FUEL
                ? [
                      {
                          template: 'subtitle',
                          field: '',
                          title: 'Stop Detail',
                          customClassText: 'margin-b-8',
                      },
                      {
                          template: 'side-by-side',
                          field: '',
                          sideBySideInfo: {
                              leftSide: {
                                  template: 'small-subtitle',
                                  customClassText: 'ca-font-bold margin-b-2',
                                  field: '',
                                  title: 'Gallon',
                              },
                              rightSide: {
                                  template: 'small-subtitle',
                                  customClassText: 'ca-font-bold margin-b-2',
                                  field: '',
                                  title: 'Diesel',
                              },
                          },
                      },
                      {
                          template: 'side-by-side',
                          field: '',
                          sideBySideInfo: {
                              leftSide: {
                                  template: 'text',
                                  customClassText:
                                      'text-size-14 text-color-black-2 ca-font-regular',
                                  field: '',
                              },
                              rightSide: {
                                  template: 'text',
                                  customClassText:
                                      'text-size-14 text-color-black-2 ca-font-regular',
                                  field: '',
                              },
                          },
                      },
                  ]
                : [
                      {
                          template: 'title-count',
                          field: 'stopDuration',
                          title: 'Stop Duration',
                          customClassContainer: 'margin-b-8',
                          isDuration: true,
                      },
                      {
                          template: 'side-by-side',
                          field: '',
                          sideBySideInfo: {
                              leftSide: {
                                  template: 'small-subtitle',
                                  customClassText: 'ca-font-bold margin-b-2',
                                  field: '',
                                  title: 'Arrival',
                              },
                              rightSide: {
                                  template: 'small-subtitle',
                                  customClassText: 'ca-font-bold margin-b-2',
                                  field: '',
                                  title: 'Departure',
                              },
                          },
                      },
                      {
                          template: 'side-by-side',
                          field: '',
                          sideBySideInfo: {
                              leftSide: {
                                  template: 'text',
                                  customClassText:
                                      'text-size-14 text-color-black-2 ca-font-regular',
                                  field: 'dateTimeFrom',
                                  isDate: true,
                              },
                              rightSide: {
                                  template: 'text',
                                  customClassText:
                                      'text-size-14 text-color-black-2 ca-font-regular',
                                  field: 'dateTimeTo',
                                  isDate: true,
                              },
                          },
                      },
                  ];

        return {
            mainContent: [
                ...baseMainContent,
                ...conditionalSection,
                (data.loadNumber ||
                    data.trailerNumber ||
                    data.driverFullName) && { template: 'divider', field: '' },
                {
                    template: 'side-by-side',
                    field: '',
                    sideBySideInfo: {
                        leftSide: data.loadNumber && {
                            template: 'icon-text',
                            field: 'loadNumber',
                            url: 'assets/ca-components/svg/common/ic_load.svg',
                            iconTooltipText: 'Load Number',
                            customClassText: 'margin-b-8',
                        },
                        rightSide: data.trailerNumber && {
                            template: 'icon-text',
                            field: 'trailerNumber',
                            url: 'assets/ca-components/svg/common/ic_trailer.svg',
                            iconTooltipText: 'Trailer Number',
                            customClassText: 'margin-b-8',
                        },
                    },
                },
                data.driverFullName && {
                    template: 'icon-text',
                    field: 'driverFullName',
                    url: 'assets/ca-components/svg/common/ic_driver.svg',
                    iconTooltipText: 'Driver Name',
                },
            ],
            isAlwaysExpanded: true,
        };
    }
}
