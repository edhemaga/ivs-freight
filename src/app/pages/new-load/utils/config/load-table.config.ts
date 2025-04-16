// enums
import { LoadSortBy, MilesStopSortBy } from 'appcoretruckassist';
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
                hasSort: false,
            },
            ...this.templateTabColumns(isTemplate, isPendingOrActive, isClosed),
            ...this.activeOrPendingTabColumns(
                isTemplate,
                isPendingOrActive,
                isClosed
            ),
            ...this.closedTabColumns(isTemplate, isPendingOrActive, isClosed),
        ];
    }

    // MAPPING STRUCTURE FOR TEMPLATE TAB COLUMNS
    private static templateTabColumns(
        isTemplate: boolean,
        isPendingOrActive: boolean,
        isClosed: boolean
    ): ITableColumn[] {
        if (!isTemplate) return [];

        return [
            {
                key: 'templateName',
                label: 'Name',
                labelToolbar: 'Template name',
                width: 200,
                minWidth: 200,
                maxWidth: 250,
                isResizable: true,
                isDisabled: true,
                isChecked: true,
                pinned: 'left',
                hasSort: true,
            },
            ...this.getCommonColumnsForAllTabs(
                isTemplate,
                isPendingOrActive,
                isClosed
            ),
            ...this.getCreatedAndEditedDates(),
            ...this.getActions(),
        ];
    }

    // MAPPING STRUCTURE FOR ACTIVE OR PENDING TAB COLUMNS
    private static activeOrPendingTabColumns(
        isTemplate: boolean,
        isPendingOrActive: boolean,
        isClosed: boolean
    ): ITableColumn[] {
        if (!isPendingOrActive) return [];

        return [
            {
                id: 1,
                key: 'loadNumber',
                label: 'Load No',
                labelToolbar: 'Load No.',
                width: 154,
                minWidth: 60,
                maxWidth: 250,
                isResizable: true,
                isDisabled: true,
                hasSort: true,
                isChecked: true,
                pinned: 'left',
            },
            ...this.getCommonColumnsForAllTabs(
                isTemplate,
                isPendingOrActive,
                isClosed
            ),
            ...this.getCreatedAndEditedDates(),
            ...this.getActions(),
        ];
    }

    // MAPPING STRUCTURE FOR CLOSED TAB COLUMNS
    private static closedTabColumns(
        isTemplate: boolean,
        isPendingOrActive: boolean,
        isClosed: boolean
    ): ITableColumn[] {
        if (!isClosed) return [];

        return [
            {
                key: 'invoiceNumber',
                label: 'Invoice No',
                labelToolbar: 'Invoice No.',
                width: 146,
                minWidth: 126,
                maxWidth: 156,
                isResizable: true,
                isDisabled: true,
                hasSort: true,
                isChecked: true,
                pinned: 'left',
            },
            {
                key: 'invoiceDate',
                label: 'Invoiced',
                labelToolbar: 'Invoiced date',
                width: 146,
                minWidth: 126,
                maxWidth: 156,
                isResizable: true,
                hasSort: true,
                isChecked: true,
            },
            ...this.getCommonColumnsForAllTabs(
                isTemplate,
                isPendingOrActive,
                isClosed
            ),
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
                sortName: LoadSortBy.InvoicedDate,
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
                sortName: LoadSortBy.PaidDate,
            },
            ...this.getCreatedAndEditedDates(),
        ];
    }

    // HELPER FOR MAPPING COMMON COLUMNS FOR ALL TABS
    private static getCommonColumnsForAllTabs(
        isTemplateTab: boolean,
        isPendingOrActiveTab: boolean,
        isClosedTab: boolean
    ): ITableColumn[] {
        return [
            {
                key: 'type',
                label: 'Type',
                labelToolbar: 'Type',
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
                isChecked: !isTemplateTab,
                hasSort: true,
                sortName: LoadSortBy.Dispatcher,
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
                // hasSort: true,
                // sortName: MilesStopSortBy.UnitNumber,
            },
            ...this.getBrokerGroup(isTemplateTab),
            {
                key: 'referenceNumber',
                label: 'REF NO',
                labelToolbar: 'Ref Number',
                width: 130,
                minWidth: 130,
                maxWidth: 160,
                isResizable: true,
                isChecked: !isTemplateTab,
                // hasSort: true,
                // sortName: MilesStopSortBy.UnitNumber,
            },
            {
                key: 'commodity',
                label: 'Commodity',
                labelToolbar: 'Commodity',
                width: 138,
                minWidth: 100,
                maxWidth: 140,
                isResizable: true,
                isChecked: isTemplateTab,
                // hasSort: true,
                // sortName: MilesStopSortBy.UnitNumber,
            },
            {
                key: 'weight',
                label: 'Weight',
                labelToolbar: 'Weight',
                width: 88,
                minWidth: 54,
                maxWidth: 110,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: LoadSortBy.Weight,
            },
            ...this.getAssignedGroup(isPendingOrActiveTab),
            ...this.getStatusColumn(!isTemplateTab),
            // RESERVE SLOT pickup & delivery
            ...this.getRequirementGroup(),
            {
                key: 'driverMessage',
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
            // LoadTemplateResponse contains property totalMiles but LoadListDto contains object miles: MilesInfo and mapping is not working
            ...this.getMilesGroup(),
            ...this.getBillingGroup(isClosedTab),
        ];
    }

    // HELPER FOR MAPPING BROKER GROUP - brokerBusinessName - brokerContact - brokerPhone
    private static getBrokerGroup(isTemplate: boolean): ITableColumn[] {
        return [
            {
                key: 'brokerGroup',
                label: 'Broker',
                labelToolbar: 'Broker Detail',
                columns: [
                    {
                        key: 'brokerBusinessName',
                        label: 'Business Name',
                        labelToolbar: 'Business name',
                        width: 238,
                        minWidth: 50,
                        maxWidth: 1020,
                        isResizable: true,
                        isChecked: true,
                        hasSort: true,
                        sortName: LoadSortBy.BrokerBusinessName,
                    },
                    {
                        key: 'brokerContact',
                        label: 'Contact',
                        labelToolbar: 'Contact',
                        width: 186,
                        minWidth: 50,
                        maxWidth: 550,
                        isResizable: true,
                        isChecked: isTemplate,
                        hasSort: true,
                        sortName: LoadSortBy.BrokerContactName,
                    },
                    {
                        key: 'brokerPhone',
                        label: 'Phone',
                        labelToolbar: 'Phone',
                        width: 188,
                        minWidth: 150,
                        maxWidth: 220,
                        isResizable: true,
                        isChecked: isTemplate,
                        hasSort: true,
                        sortName: LoadSortBy.BrokerContactPhone,
                    },
                ],
            },
        ];
    }

    // MAPPING HELPER FOR MAPPING ASSIGNED GROUP - assignedDriver - assignedDriverTruckNumber - assignedDriverTrailerNumber
    private static getAssignedGroup(isChecked: boolean): ITableColumn[] {
        return [
            {
                key: 'assignedGroup',
                label: 'Assigned',
                labelToolbar: 'Assigned',
                hasSort: false,
                columns: [
                    {
                        key: 'assignedDriver',
                        label: 'Driver',
                        labelToolbar: 'Driver',
                        width: 208,
                        minWidth: 50,
                        maxWidth: 1020,
                        isResizable: true,
                        isChecked: false,
                        // hasSort: true,
                        // sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'assignedDriverTruckNumber',
                        label: 'Truck',
                        labelToolbar: 'Truck',
                        width: 78,
                        minWidth: 30,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked,
                        // hasSort: true,
                        // sortName: LoadSortBy,
                    },
                    {
                        key: 'assignedDriverTrailerNumber',
                        label: 'Trailer',
                        labelToolbar: 'Trailer',
                        width: 88,
                        minWidth: 30,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked,
                        // hasSort: true,
                        // sortName: MilesStopSortBy.UnitNumber,
                    },
                ],
            },
        ];
    }

    // HELPER FOR MAPPING MILES GROUP - milesLoaded - milesEmpty - milesTotal
    private static getMilesGroup(): ITableColumn[] {
        return [
            {
                key: 'milesGroup',
                label: 'Miles',
                labelToolbar: 'Miles',
                hasSort: false,
                columns: [
                    {
                        key: 'milesLoaded',
                        label: 'Loaded',
                        labelToolbar: 'Loaded',
                        width: 78,
                        minWidth: 30,
                        maxWidth: 88,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.LoadedMiles,
                    },
                    {
                        key: 'milesEmpty',
                        label: 'Empty',
                        labelToolbar: 'Empty',
                        width: 78,
                        minWidth: 30,
                        maxWidth: 88,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: MilesStopSortBy.EmptyMiles,
                    },
                    {
                        key: 'milesTotal',
                        label: 'Total',
                        labelToolbar: 'Total',
                        width: 78,
                        minWidth: 30,
                        maxWidth: 88,
                        isResizable: true,
                        isChecked: true,
                        hasSort: true,
                        sortName: MilesStopSortBy.TotalMiles,
                    },
                ],
            },
        ];
    }

    // HELPER FOR MAPPING BILLING GROUP
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
                    //   hasSort: true,
                    //   sortName: LoadSortBy.,
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
                    //   hasSort: true,
                    //   sortName: MilesStopSortBy.UnitNumber,
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
                    //   hasSort: true,
                    //   sortName: MilesStopSortBy.UnitNumber,
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
                    //   hasSort: true,
                    //   sortName: MilesStopSortBy.UnitNumber,
                  },
              ]
            : [];
        return [
            {
                key: 'billingGroup',
                label: 'Billing',
                labelToolbar: 'Billing',
                hasSort: false,
                columns: [
                    ...closedLoadColumns,
                    {
                        key: 'billingRatePerMile',
                        label: 'RPM',
                        labelToolbar: 'Rate Per Mile',
                        width: 80,
                        minWidth: 50,
                        maxWidth: 80,
                        isResizable: true,
                        isChecked: false,
                        // hasSort: true,
                        // sortName: LoadSortBy.,
                    },
                    {
                        key: 'billingLayover',
                        label: 'Layover',
                        labelToolbar: 'Layover',
                        width: 101,
                        minWidth: 60,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked: false,
                        // hasSort: true,
                        // sortName: MilesStopSortBy.UnitNumber,
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
                        // hasSort: true,
                        // sortName: MilesStopSortBy.UnitNumber,
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
                        // hasSort: true,
                        // sortName: MilesStopSortBy.UnitNumber,
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
                        // hasSort: true,
                        // sortName: MilesStopSortBy.UnitNumber,
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
                        // hasSort: true,
                        // sortName: MilesStopSortBy.UnitNumber,
                    },
                    {
                        key: 'billingRate',
                        label: 'Rate',
                        labelToolbar: 'Rate',
                        width: 101,
                        minWidth: 60,
                        maxWidth: 140,
                        isResizable: true,
                        isChecked: true,
                        // hasSort: true,
                        // sortName: MilesStopSortBy.UnitNumber,
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
                        sortName: LoadSortBy.PaidDate,
                    },
                    ...dueColumn,
                ],
            },
        ];
    }

    private static getStatusColumn(isChecked: boolean): ITableColumn[] {
        return [
            {
                key: 'loadStatus',
                label: 'Status',
                labelToolbar: 'Status',
                width: 138,
                minWidth: 90,
                maxWidth: 150,
                isResizable: true,
                isChecked,
                hasSort: true,
                sortName: LoadSortBy.Status,
            },
        ];
    }

    // HELPER FOR MAPPING REQUIREMENT GROUP - requirementTruckType - requirementTrailerType - requirementLength- requirementDoorType - requirementSuspension - requirementYear - requirementLiftgate
    private static getRequirementGroup(): ITableColumn[] {
        return [
            {
                key: 'requirementGroup',
                label: 'Requirem',
                labelToolbar: 'Requirement',
                hasSort: false,
                columns: [
                    {
                        key: 'requirementTruckType',
                        label: 'Truck type',
                        labelToolbar: 'Truck Type',
                        width: 64,
                        minWidth: 50,
                        maxWidth: 220,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: LoadSortBy.TruckType,
                    },
                    {
                        key: 'requirementTrailerType',
                        label: 'Trailer type',
                        labelToolbar: 'Trailer Type',
                        width: 64,
                        minWidth: 50,
                        maxWidth: 220,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: LoadSortBy.TrailerType,
                    },
                    {
                        key: 'requirementLength',
                        label: 'ft',
                        labelToolbar: 'Length',
                        width: 52,
                        minWidth: 32,
                        maxWidth: 70,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: LoadSortBy.TrailerLength,
                    },
                    {
                        key: 'requirementDoorType',
                        label: 'Door',
                        labelToolbar: 'Door Type',
                        width: 90,
                        minWidth: 52,
                        maxWidth: 110,
                        isResizable: true,
                        isChecked: false,
                        // hasSort: true,
                        // sortName: LoadSortBy.,
                    },
                    {
                        key: 'requirementSuspension',
                        label: 'Suspension',
                        labelToolbar: 'Suspension',
                        width: 92,
                        minWidth: 45,
                        maxWidth: 110,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: LoadSortBy.Suspension,
                    },
                    {
                        key: 'requirementYear',
                        label: 'Year',
                        labelToolbar: 'Year',
                        width: 58,
                        minWidth: 50,
                        maxWidth: 64,
                        isResizable: true,
                        isChecked: false,
                        hasSort: true,
                        sortName: LoadSortBy.Year,
                    },
                    {
                        key: 'requirementLiftgate',
                        label: 'Liftgate',
                        labelToolbar: 'Liftgate',
                        width: 72,
                        minWidth: 50,
                        maxWidth: 78,
                        isResizable: true,
                        isChecked: false,
                        // hasSort: true,
                        // sortName: LoadSortBy.,
                    },
                ],
            },
        ];
    }

    // HELPER FOR MAPPING CREATED AND EDITED DATES
    private static getCreatedAndEditedDates(): ITableColumn[] {
        return [
            {
                key: 'dateCreated',
                label: 'Created',
                labelToolbar: 'Date Created',
                width: 88,
                minWidth: 72,
                maxWidth: 88,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: LoadSortBy.AddedDate,
            },
            {
                key: 'dateEdited',
                label: 'Edited',
                labelToolbar: 'Date Edited',
                width: 88,
                minWidth: 72,
                maxWidth: 88,
                isResizable: true,
                isChecked: false,
                hasSort: true,
                sortName: LoadSortBy.EditedDate,
            },
        ];
    }

    private static getActions(): ITableColumn[] {
        return [
            {
                key: 'action',
                label: '',
                width: 26,
                minWidth: 26,
                maxWidth: 26,
                isResizable: false,
                isChecked: true,
                hasSort: false,
                sortName: MilesStopSortBy.UnitNumber,
            },
        ];
    }
}
