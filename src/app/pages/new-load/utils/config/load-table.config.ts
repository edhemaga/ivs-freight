// enums
import { MilesStopSortBy } from 'appcoretruckassist';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// interfaces
import { ITableColumn } from '@shared/components/new-table/interface';

export class LoadTableColumnsConfig {
    static getLoadTableColumns(
        selectedTab: eLoadStatusStringType
    ): ITableColumn[] {
        const isTemplate = selectedTab === eLoadStatusStringType.TEMPLATE;
        const isPendingOrActive =
            selectedTab === eLoadStatusStringType.PENDING ||
            selectedTab === eLoadStatusStringType.ACTIVE;
        const isClosed = selectedTab === eLoadStatusStringType.CLOSED;
        return [
            ...this.getBaseColumns(isTemplate),
            ...this.getBrokerGroup(isTemplate),
            ...this.getBaseColumnsSecond(isTemplate),
            ...this.getAssignedGroup(isPendingOrActive),
            ...this.getStatusColumn(isTemplate),
            ...this.getPickupAndRequirement(),
            ...this.getDriverMessage(),
            ...this.getMilesGroup(),
            ...this.getBillingGroup(isClosed),
            ...this.getClosedDates(isClosed),
            ...this.getFinalDates(),
        ];
    }
    private static getBaseColumns(isTemplate: boolean): ITableColumn[] {
        return [
            {
                key: 'select',
                label: '',
                pinned: 'left',
                width: 32,
                minWidth: 32,
                maxWidth: 200,
                isResizable: true,
                isDisabled: true,
                isChecked: true,
                hasSort: true,
            },
            {
                id: 1,
                key: 'loadInvoice',
                label: 'Load No',
                labelToolbar: 'Load No.',
                width: 154,
                minWidth: 60,
                maxWidth: 250,
                isResizable: true,
                isDisabled: true,
                isChecked: true,
                hasSort: true,
                pinned: 'left',
            },
            {
                key: 'type',
                label: 'Type',
                labelToolbar: 'Type',
                pinned: 'left',
                width: 82,
                minWidth: 82,
                maxWidth: 200,
                isResizable: true,
                isChecked: false,
                hasSort: true,
            },
            {
                key: 'loadDispatcher',
                label: 'Dispatcher',
                labelToolbar: 'Dispatcher',
                width: 208,
                minWidth: 50,
                maxWidth: 1020,
                isResizable: true,
                isChecked: !isTemplate,
                hasSort: true,
                sortName: MilesStopSortBy.UnitNumber,
            },
            {
                key: 'company',
                label: 'Company',
                labelToolbar: 'Company',
                width: 238,
                minWidth: 50,
                maxWidth: 1020,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: MilesStopSortBy.UnitNumber,
            },
        ];
    }
    private static getBrokerGroup(isTemplate: boolean): ITableColumn[] {
        return [
            {
                key: 'broker',
                label: 'Broker',
                labelToolbar: 'Broker Detail',
                columns: [
                    {
                        key: 'loadBroker',
                        label: 'Business Name',
                        labelToolbar: 'Business name',
                        width: 238,
                        minWidth: 50,
                        maxWidth: 1020,
                        isResizable: true,
                        isChecked: true,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'contact',
                        label: 'Contact',
                        labelToolbar: 'Contact',
                        width: 186,
                        minWidth: 50,
                        maxWidth: 550,
                        isResizable: true,
                        isChecked: isTemplate,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'phone',
                        label: 'Phone',
                        labelToolbar: 'Phone',
                        width: 188,
                        minWidth: 150,
                        maxWidth: 220,
                        isResizable: true,
                        isChecked: isTemplate,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                ],
            },
        ];
    }

    private static getBaseColumnsSecond(isTemplate: boolean): ITableColumn[] {
        return [
            {
                key: 'referenceNumber',
                label: 'REF NO',
                labelToolbar: 'Ref Number',
                width: 108,
                minWidth: 64,
                maxWidth: 160,
                isResizable: true,
                isChecked: !isTemplate,
                hasSort: true,
                sortName: MilesStopSortBy.UnitNumber,
            },
            {
                key: 'textCommodity',
                label: 'Commodity',
                labelToolbar: 'Commodity',
                width: 138,
                minWidth: 100,
                maxWidth: 140,
                isResizable: true,
                isChecked: isTemplate,
                hasSort: true,
                sortName: MilesStopSortBy.UnitNumber,
            },
            {
                key: 'textWeight',
                label: 'Weight',
                labelToolbar: 'Weight',
                width: 88,
                minWidth: 54,
                maxWidth: 110,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: MilesStopSortBy.UnitNumber,
            },
        ];
    }

    private static getAssignedGroup(
        isPendingOrActive: boolean
    ): ITableColumn[] {
        return [
            {
                key: 'brokerGroup',
                label: 'Assigned',
                labelToolbar: 'Assigned',
                hasSort: false,
                columns: [
                    {
                        key: 'tableDriver',
                        label: 'Driver',
                        labelToolbar: 'Driver',
                        width: 208,
                        minWidth: 50,
                        maxWidth: 1020,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'tableAssignedUnitTruck',
                        label: 'Truck',
                        labelToolbar: 'Truck',
                        width: 78,
                        minWidth: 30,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked: isPendingOrActive,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'tableAssignedUnitTrailer',
                        label: 'Trailer',
                        labelToolbar: 'Trailer',
                        width: 88,
                        minWidth: 30,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked: isPendingOrActive,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                ],
            },
        ];
    }
    private static getStatusColumn(isTemplate: boolean): ITableColumn[] {
        return isTemplate
            ? []
            : [
                  {
                      key: 'loadStatus',
                      label: 'Status',
                      labelToolbar: 'Status',
                      width: 138,
                      minWidth: 90,
                      maxWidth: 150,
                      isResizable: true,
                      isChecked: true,
                      hasSort: true,
                      sortName: MilesStopSortBy.UnitNumber,
                  },
              ];
    }
    private static getPickupAndRequirement(): ITableColumn[] {
        return [
            {
                key: 'loadPickup',
                label: 'Pickup',
                labelToolbar: 'Pickup & Delivery',
                width: 153,
                minWidth: 153,
                maxWidth: 238,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: MilesStopSortBy.UnitNumber,
            },
            {
                key: 'requirement',
                label: 'Requirem',
                labelToolbar: 'Requirement',
                hasSort: false,
                columns: [
                    {
                        key: 'loadTruckNumber',
                        label: 'Truck',
                        labelToolbar: 'Truck Type',
                        width: 64,
                        minWidth: 50,
                        maxWidth: 220,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'loadTrailerNumber',
                        label: 'Trailer',
                        labelToolbar: 'Trailer Type',
                        width: 64,
                        minWidth: 50,
                        maxWidth: 220,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'tabelLength',
                        label: 'ft',
                        labelToolbar: 'Length',
                        width: 52,
                        minWidth: 32,
                        maxWidth: 70,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'tableDoorType',
                        label: 'Door',
                        labelToolbar: 'Door Type',
                        width: 90,
                        minWidth: 52,
                        maxWidth: 110,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'tableSuspension',
                        label: 'Suspension',
                        labelToolbar: 'Suspension',
                        width: 92,
                        minWidth: 45,
                        maxWidth: 110,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'year',
                        label: 'Year',
                        labelToolbar: 'Year',
                        width: 58,
                        minWidth: 50,
                        maxWidth: 64,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'liftgate',
                        label: 'Liftgate',
                        labelToolbar: 'Liftgate',
                        width: 72,
                        minWidth: 50,
                        maxWidth: 78,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                ],
            },
        ];
    }
    private static getDriverMessage(): ITableColumn[] {
        return [
            {
                key: 'textDriver',
                label: 'Driver Message',
                labelToolbar: 'Driver Message',
                width: 234,
                minWidth: 100,
                maxWidth: 310,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: MilesStopSortBy.UnitNumber,
            },
        ];
    }
    private static getMilesGroup(): ITableColumn[] {
        return [
            {
                key: 'miles',
                label: 'Miles',
                labelToolbar: 'Miles',
                hasSort: false,
                columns: [
                    {
                        key: 'loaded',
                        label: 'Loaded',
                        labelToolbar: 'Loaded',
                        width: 78,
                        minWidth: 30,
                        maxWidth: 88,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'empty',
                        label: 'Empty',
                        labelToolbar: 'Empty',
                        width: 78,
                        minWidth: 30,
                        maxWidth: 88,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'total',
                        label: 'Total',
                        labelToolbar: 'Total',
                        width: 78,
                        minWidth: 30,
                        maxWidth: 88,
                        isResizable: true,
                        isChecked: true,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                ],
            },
        ];
    }
    private static getBillingGroup(isClosed: boolean): ITableColumn[] {
        const closedLoadColumns: ITableColumn[] = isClosed
            ? [
                  {
                      key: 'textPayTerms',
                      label: 'Pay Term',
                      labelToolbar: 'Pay Term',
                      width: 68,
                      minWidth: 30,
                      maxWidth: 68,
                      isResizable: true,
                      isChecked: false,
                      hasSort: true,
                      sortName: MilesStopSortBy.UnitNumber,
                  },
                  {
                      key: 'ageUnpaid',
                      label: 'Age unp.',
                      labelToolbar: 'Age - Unpaid',
                      width: 61,
                      minWidth: 30,
                      maxWidth: 68,
                      isResizable: true,
                      isChecked: true,
                      hasSort: true,
                      sortName: MilesStopSortBy.UnitNumber,
                  },
                  {
                      key: 'agePaid',
                      label: 'Age paid',
                      labelToolbar: 'Age - Paid',
                      width: 61,
                      minWidth: 30,
                      maxWidth: 68,
                      isResizable: true,
                      isChecked: false,
                      hasSort: true,
                      sortName: MilesStopSortBy.UnitNumber,
                  },
              ]
            : [];
        const dueColumn = isClosed
            ? [
                  {
                      key: 'due',
                      label: 'Due',
                      labelToolbar: 'Due',
                      width: 101,
                      minWidth: 60,
                      maxWidth: 140,
                      isResizable: true,
                      isChecked: true,
                      hasSort: true,
                      sortName: MilesStopSortBy.UnitNumber,
                  },
              ]
            : [];
        return [
            {
                key: 'billing',
                label: 'Billing',
                labelToolbar: 'Billing',
                hasSort: false,
                columns: [
                    ...closedLoadColumns,
                    {
                        key: 'ratePerMile',
                        label: 'RPM',
                        labelToolbar: 'Rate Per Mile',
                        width: 80,
                        minWidth: 50,
                        maxWidth: 80,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'layover',
                        label: 'Layover',
                        labelToolbar: 'Layover',
                        width: 101,
                        minWidth: 60,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'lumper',
                        label: 'Lumper',
                        labelToolbar: 'Lumper',
                        width: 101,
                        minWidth: 60,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'fuelSurcharge',
                        label: 'Fuel Surch',
                        labelToolbar: 'Fuel Surcharge',
                        width: 101,
                        minWidth: 60,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'escort',
                        label: 'Escort',
                        labelToolbar: 'Escort',
                        width: 101,
                        minWidth: 60,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'detention',
                        label: 'Detention',
                        labelToolbar: 'Detention',
                        width: 101,
                        minWidth: 60,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'rate',
                        label: 'Rate',
                        labelToolbar: 'Rate',
                        width: 101,
                        minWidth: 60,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked: true,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'paid',
                        label: 'Paid',
                        labelToolbar: 'Paid',
                        width: 101,
                        minWidth: 60,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked: isClosed,
                        hasSort: true,
                        sortName: MilesStopSortBy.UnitNumber,
                    },
                    ...dueColumn,
                ],
            },
        ];
    }
    private static getClosedDates(isClosed: boolean): ITableColumn[] {
        return isClosed
            ? [
                  {
                      key: 'tableInvoice',
                      label: 'Invoiced',
                      labelToolbar: 'Invoiced Date',
                      width: 88,
                      minWidth: 72,
                      maxWidth: 88,
                      isResizable: true,
                      isChecked: false,
                      hasSort: true,
                      sortName: MilesStopSortBy.UnitNumber,
                  },
                  {
                      key: 'paidDate',
                      label: 'Date Paid',
                      labelToolbar: 'Paid Date',
                      width: 88,
                      minWidth: 72,
                      maxWidth: 88,
                      isResizable: true,
                      isChecked: false,
                      hasSort: true,
                      sortName: MilesStopSortBy.UnitNumber,
                  },
              ]
            : [];
    }
    private static getFinalDates(): ITableColumn[] {
        return [
            {
                key: 'tableAdded',
                label: 'Created',
                labelToolbar: 'Date Created',
                width: 88,
                minWidth: 72,
                maxWidth: 88,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: MilesStopSortBy.UnitNumber,
            },
            {
                key: 'tableEdited',
                label: 'Edited',
                labelToolbar: 'Date Edited',
                width: 88,
                minWidth: 72,
                maxWidth: 88,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: MilesStopSortBy.UnitNumber,
            },
        ];
    }
}
