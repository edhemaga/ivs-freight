import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

// components
import { TtFhwaInspectionModalComponent } from 'src/app/shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from 'src/app/shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-registration-modal/tt-registration-modal.component';
import { TaConfirmationModalComponent } from 'src/app/core/components/modals/ta-confirmation-modal/ta-confirmation/ta-confirmation-modal.component';
import { TrailerModalComponent } from 'src/app/pages/trailer/pages/trailer-modal/trailer-modal.component';

// services
import { ConfirmationService } from 'src/app/core/components/modals/ta-confirmation-modal/services/confirmation.service';
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { TrailerService } from '../../../../shared/services/trailer.service';

// store
import { TrailerActiveQuery } from '../../state/trailer-active-state/trailer-active.query';
import { TrailerActiveState } from '../../state/trailer-active-state/trailer-active.store';
import { TrailerInactiveQuery } from '../../state/trailer-inactive-state/trailer-inactive.query';
import { TrailerInactiveState } from '../../state/trailer-inactive-state/trailer-inactive.store';
import { TrailerInactiveStore } from '../../state/trailer-inactive-state/trailer-inactive.store';

// pipes
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';

// helpers
import { DataFilterHelper } from 'src/app/shared/utils/helpers/data-filter.helper';

// animations
import { MethodsGlobalHelper } from 'src/app/shared/utils/helpers/methods-global.helper';

// constants
import { TableDropdownComponentConstants } from 'src/app/shared/utils/constants/table-dropdown-component.constants';

// configuration
import { trailerCardDataConstants } from './utils/constants/trailer-card-data.constants';

// enums
import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';
import { TrailerNameStringEnum } from 'src/app/shared/enums/trailer-name-string.enum';
import { TooltipColorsStringEnum } from 'src/app/shared/enums/tooltip-colors-string,enum';

// models
import { TrailerListResponse } from 'appcoretruckassist';
import { DropdownItem } from 'src/app/shared/models/card-models/card-table-data.model';
import { TrailerMapped } from './models/trailer-mapped.model';
import { CardRows } from 'src/app/shared/models/card-models/card-rows.model';
import { TableToolbarActions } from 'src/app/shared/models/table-models/table-toolbar-actions.model';
import { getTrailerColumnDefinition } from 'src/assets/utils/settings/trailer-columns';
import { TrailerBackFilterQueryInterface } from './models/trailer-back-filter-query.model';
import { TraillerData } from './models/trailer-data.model';
import { TrailerBodyResponse } from './models/trailer-body-response.model';
import {
    TableColumnConfig,
    DataForCardsAndTables,
} from 'src/app/core/components/shared/model/all-tables.modal';

@Component({
    selector: 'app-trailer-table',
    templateUrl: './trailer-table.component.html',
    styleUrls: ['./trailer-table.component.scss'],
    providers: [ThousandSeparatorPipe],
})
export class TrailerTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public trailerData: any[] = [];
    public tableOptions;
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];
    public selectedTab: TableStringEnum | string = TableStringEnum.ACTIVE;
    public activeViewMode: string = TableStringEnum.LIST;
    public resizeObserver: ResizeObserver;
    public inactiveTabClicked: boolean = false;
    public trailerActive: TrailerActiveState[] = [];
    public trailerInactive: TrailerInactiveState[] = [];
    public activeTableData: string;
    public backFilterQuery: TrailerBackFilterQueryInterface =
        TableDropdownComponentConstants.BACK_FILTER_QUERY;

    //Data to display from model Truck Active
    public displayRowsFrontActive: CardRows[] =
        trailerCardDataConstants.displayRowsFrontActive;
    public displayRowsBackActive: CardRows[] =
        trailerCardDataConstants.displayRowsBackActive;

    public displayRowsFrontInactive: CardRows[] =
        trailerCardDataConstants.displayRowsFrontInactive;
    public displayRowsBackInactive: CardRows[] =
        trailerCardDataConstants.displayRowsBackInactive;

    public cardTitle: string = trailerCardDataConstants.cardTitle;
    public page: string = trailerCardDataConstants.page;
    public rows: number = trailerCardDataConstants.rows;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private trailerActiveQuery: TrailerActiveQuery,
        private trailerInactiveQuery: TrailerInactiveQuery,
        private trailerService: TrailerService,
        public datePipe: DatePipe,
        private router: Router,
        private thousandSeparator: ThousandSeparatorPipe,
        private confirmationService: ConfirmationService,
        private trailerInactiveStore: TrailerInactiveStore
    ) {}

    ngOnInit(): void {
        this.sendTrailerData();

        this.confirmationSubscribe();

        this.resetColumns();

        this.resize();

        this.toggleColumns();

        this.trailerActions();

        this.deleteSelectedRows();

        this.search();

        this.setTableFilter();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    public setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filterType) {
                    if (res.action === TableStringEnum.SET) {
                        this.viewData = this.trailerData?.filter(
                            (customerData) =>
                                res.queryParams.some(
                                    (filterData) =>
                                        filterData === customerData.id
                                )
                        );
                    }

                    if (res.action === TableStringEnum.CLEAR)
                        this.viewData = this.trailerData;
                }
            });
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case TableStringEnum.DELETE: {
                            this.deleteTrailerById(res.id);
                            break;
                        }
                        case TableStringEnum.ACTIVATE: {
                            this.changeTrailerStatus(res.id);
                            break;
                        }
                        case TableStringEnum.DEACTIVATE: {
                            this.changeTrailerStatus(res.id);
                            break;
                        }
                        case TableStringEnum.MULTIPLE_DELETE: {
                            this.multipleDeleteTrailers(res.array);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
    }

    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendTrailerData();
                }
            });
    }

    private resize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((col) => {
                        if (
                            col.title ===
                            response.columns[response.event.index].title
                        ) {
                            col.width = response.event.width;
                        }

                        return col;
                    });
                }
            });
    }

    private toggleColumns(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.column) {
                    this.columns = this.columns.map((col) => {
                        if (col.field === response.column.field) {
                            col.hidden = response.column.hidden;
                        }

                        return col;
                    });
                }
            });
    }

    private trailerActions(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // Add Trailer ACtive
                if (res?.animation === TableStringEnum.ADD) {
                    this.viewData.push(this.mapTrailerData(res.data));

                    this.viewData = this.viewData.map((trailer: any) => {
                        if (trailer.id === res.id) {
                            trailer.actionAnimation = TableStringEnum.ADD;
                        }

                        return trailer;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 2300);
                }
                // Add Trailer Inactive
                else if (
                    res?.animation === TableStringEnum.ADD &&
                    this.selectedTab === TableStringEnum.INACTIVE
                ) {
                    this.updateDataCount();
                }
                // Update Trailer
                else if (res?.animation === TableStringEnum.UPDATE) {
                    this.viewData = this.viewData.map((trailer: any) => {
                        if (trailer.id === res.id) {
                            trailer = this.mapTrailerData(res.data);
                            trailer.actionAnimation = TableStringEnum.UPDATE;
                        }

                        return trailer;
                    });

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 1000);
                }
                // Update Trailer Status
                else if (res?.animation === TableStringEnum.UPDATE_STATUS) {
                    let trailerIndex: number;

                    this.viewData = this.viewData.map(
                        (trailer: any, index: number) => {
                            if (trailer.id === res.id) {
                                trailer.actionAnimation =
                                    this.selectedTab === TableStringEnum.ACTIVE
                                        ? TableStringEnum.DEACTIVATE
                                        : TableStringEnum.ACTIVATE;
                                trailerIndex = index;
                            }

                            return trailer;
                        }
                    );

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        this.viewData.splice(trailerIndex, 1);
                        clearInterval(inetval);
                    }, 900);
                }
            });
    }

    private deleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any[]) => {
                if (response.length) {
                    let mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                                number: item.tableData?.trailerNumber,
                                avatar: `assets/svg/common/trailers/${item.tableData?.trailerType?.logoName}`,
                            },
                        };
                    });
                    this.modalService.openModal(
                        TaConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.TRAILER_2,
                            type: TableStringEnum.MULTIPLE_DELETE,
                            svg: true,
                        }
                    );
                }
            });
    }

    private search(): void {
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res) {
                    this.backFilterQuery.active =
                        this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;

                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.backFilterQuery
                    );

                    if (searchEvent) {
                        if (searchEvent.action === TableStringEnum.API) {
                            this.trailerBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action === TableStringEnum.STORE
                        ) {
                            this.sendTrailerData();
                        }
                    }
                }
            });
    }

    private observTableContainer(): void {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(
            document.querySelector(TableStringEnum.TABLE_CONTAINER)
        );
    }

    public initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTrailerFilter: true,
                viewModeOptions: [
                    {
                        name: TableStringEnum.LIST,
                        active: this.activeViewMode === TableStringEnum.LIST,
                    },
                    {
                        name: TableStringEnum.CARD,
                        active: this.activeViewMode === TableStringEnum.CARD,
                    },
                ],
            },
        };
    }

    private sendTrailerData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(TableStringEnum.TRAILER_TAB_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const trailerCount = JSON.parse(
            localStorage.getItem(TableStringEnum.TRAILER_TABLE_COUNT)
        );

        const truckActiveData =
            this.selectedTab === TableStringEnum.ACTIVE
                ? this.getTabData(TableStringEnum.ACTIVE)
                : [];

        const truckInactiveData =
            this.selectedTab === TableStringEnum.INACTIVE
                ? this.getTabData(TableStringEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: TableStringEnum.ACTIVE_2,
                field: TableStringEnum.ACTIVE,
                length: trailerCount.active,
                data: truckActiveData,
                extended: false,
                gridNameTitle: TableStringEnum.TRAILER_3,
                stateName: TableStringEnum.TRAILERS,
                tableConfiguration: TableStringEnum.TRAILER_4,
                isActive: this.selectedTab === TableStringEnum.ACTIVE,
                gridColumns: this.getGridColumns(TableStringEnum.TRAILER_4),
            },
            {
                title: TableStringEnum.INACTIVE_2,
                field: TableStringEnum.INACTIVE,
                length: trailerCount.inactive,
                data: truckInactiveData,
                extended: false,
                gridNameTitle: TableStringEnum.TRAILER_3,
                stateName: TableStringEnum.TRAILERS,
                tableConfiguration: TableStringEnum.TRAILER_4,
                isActive: this.selectedTab === TableStringEnum.INACTIVE,
                gridColumns: this.getGridColumns(TableStringEnum.TRAILER_4),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setTrailerData(td);
    }

    private getGridColumns(configType: string): string[] {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getTrailerColumnDefinition();
    }

    private setTrailerData(td: DataForCardsAndTables): void {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapTrailerData(data);
            });

            // Set data for cards based on tab active
            this.selectedTab === TableStringEnum.ACTIVE
                ? ((this.sendDataToCardsFront = this.displayRowsFrontActive),
                  (this.sendDataToCardsBack = this.displayRowsBackActive))
                : ((this.sendDataToCardsFront = this.displayRowsFrontInactive),
                  (this.sendDataToCardsBack = this.displayRowsBackInactive));

            this.getSelectedTabTableData();
        } else {
            this.viewData = [];
        }
        this.trailerData = this.viewData;
    }

    private setTrailerTooltipColor(trailerName: string): string {
        if (trailerName === TrailerNameStringEnum.REEFER) {
            return TooltipColorsStringEnum.BLUE;
        } else if (trailerName === TrailerNameStringEnum.DRY_VAN) {
            return TooltipColorsStringEnum.DARK_BLUE;
        } else if (trailerName === TrailerNameStringEnum.DUMPER) {
            return TooltipColorsStringEnum.PURPLE;
        } else if (trailerName === TrailerNameStringEnum.TANKER) {
            return TooltipColorsStringEnum.GREEN;
        } else if (trailerName === TrailerNameStringEnum.PNEUMATIC_TANKER) {
            return TooltipColorsStringEnum.LIGHT_GREEN;
        } else if (trailerName === TrailerNameStringEnum.CAR_HAULER) {
            return TooltipColorsStringEnum.PINK;
        } else if (trailerName === TrailerNameStringEnum.CAR_HAULER_STINGER) {
            return TooltipColorsStringEnum.PINK;
        } else if (trailerName === TrailerNameStringEnum.CHASSIS) {
            return TooltipColorsStringEnum.BROWN;
        } else if (trailerName === TrailerNameStringEnum.LOW_BOY_RGN) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.STEP_DECK) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.FLAT_BED) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.SIDE_KIT) {
            return TooltipColorsStringEnum.ORANGE;
        } else if (trailerName === TrailerNameStringEnum.CONESTOGA) {
            return TooltipColorsStringEnum.GOLD;
        } else if (trailerName === TrailerNameStringEnum.CONTAINER) {
            return TooltipColorsStringEnum.YELLOW;
        }
    }

    private mapTrailerData(data: TraillerData): TrailerMapped {
        return {
            ...data,
            isSelected: false,
            tableTrailerTypeIcon: data.trailerType.logoName,
            tableTrailerName: data.trailerType.name,
            tableTrailerColor: this.setTrailerTooltipColor(
                data.trailerType.name
            ),
            tableVin: {
                regularText: data?.vin
                    ? data.vin.substr(0, data.vin.length - 6)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                boldText: data?.vin
                    ? data.vin.substr(data.vin.length - 6)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            tableTrailerTypeClass: data.trailerType.logoName.replace(
                TableStringEnum.SVG,
                TableStringEnum.EMPTY_STRING_PLACEHOLDER
            ),
            tableMake: data?.trailerMake?.name
                ? data.trailerMake.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableModel: data?.model
                ? data?.model
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableColor: data?.color?.code
                ? data.color.code
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            colorName: data?.color?.name
                ? data.color.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tabelLength: data?.trailerLength?.name
                ? DataFilterHelper.getLengthNumber(data?.trailerLength?.name)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDriver: TableStringEnum.NA,
            tableTruck: TableStringEnum.NA,
            tableTruckType: TableStringEnum.NA,
            tableOwner: data?.owner?.name
                ? data.owner.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableWeightEmpty: data?.emptyWeight
                ? this.thousandSeparator.transform(data.emptyWeight) +
                  TableStringEnum.POUNDS_2
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableWeightVolume: data.volume ?? TableStringEnum.NA,
            tableAxle: data?.axles
                ? data?.axles
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableSuspension: data?.suspension?.name
                ? data.suspension.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTireSize: data?.tireSize?.name
                ? data.tireSize.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableReeferUnit: data?.reeferUnit?.name
                ? data.reeferUnit.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDoorType: data?.doorType?.name
                ? data.doorType.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableInsPolicy: data?.insurancePolicy
                ? data.insurancePolicy
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableMileage: data?.mileage
                ? this.thousandSeparator.transform(data.mileage)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLicencePlateDetailNumber: data?.licensePlate
                ? data.licensePlate
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLicencePlateDetailST: TableStringEnum.NA,
            tableLicencePlateDetailExpiration: {
                expirationDays: data?.registrationExpirationDays
                    ? data.registrationExpirationDays
                    : null,
                expirationDaysText: data?.registrationExpirationDays
                    ? this.thousandSeparator.transform(
                          data.registrationExpirationDays
                      )
                    : null,
                percentage:
                    data?.registrationPercentage ||
                    data?.registrationPercentage === 0
                        ? 100 - data.registrationPercentage
                        : null,
            },
            tableFHWAInspectionTerm: data?.fhwaExp
                ? data?.fhwaExp + TableStringEnum.MONTHS
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableFHWAInspectionExpiration: {
                expirationDays: data?.inspectionExpirationDays
                    ? data.inspectionExpirationDays
                    : null,
                expirationDaysText: data?.inspectionExpirationDays
                    ? this.thousandSeparator.transform(
                          data.inspectionExpirationDays
                      )
                    : null,
                percentage:
                    data?.inspectionPercentage ||
                    data?.inspectionPercentage === 0
                        ? 100 - data.inspectionPercentage
                        : null,
            },
            tableTitleNumber: TableStringEnum.NA,
            tableTitleST: TableStringEnum.NA,
            tableTitlePurchase: TableStringEnum.NA,
            tableTitleIssued: TableStringEnum.NA,
            tablePurchaseDate: data.purchaseDate
                ? this.datePipe.transform(
                      data.purchaseDate,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePurchasePrice: data?.purchasePrice
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.purchasePrice)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTerminated: TableStringEnum.NA,
            tableAdded: data.createdAt
                ? this.datePipe.transform(
                      data.createdAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: data.updatedAt
                ? this.datePipe.transform(
                      data.updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,

            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownTrailerContent(),
            },
        };
    }

    public getDropdownTrailerContent(): DropdownItem[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT_TRAILER,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
            },
            {
                title: TableStringEnum.VIEW_DETAILS_2,
                name: TableStringEnum.VIEW_DETAILS,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.ADD_NEW_2,
                name: TableStringEnum.ADD_NEW,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: TableStringEnum.REGULAR,
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: TableStringEnum.ADD_REGISTRATION_2,
                        name: TableStringEnum.ADD_REGISTRATION,
                    },

                    {
                        title: TableStringEnum.ADD_INSPECTION_2,
                        name: TableStringEnum.ADD_INSPECTION,
                    },
                ],
                hasBorder: true,
            },
            {
                title: TableStringEnum.SHARE_2,
                name: TableStringEnum.SHARE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.PRINT_2,
                name: TableStringEnum.PRINT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },

                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            {
                title:
                    this.selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE_2
                        : TableStringEnum.ACTIVATE_2,
                name: TableStringEnum.ACTIVATE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass:
                    this.selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    private updateDataCount(): void {
        const truckCount = JSON.parse(
            localStorage.getItem(TableStringEnum.TRAILER_TABLE_COUNT)
        );

        this.tableData[0].length = truckCount.active;
        this.tableData[1].length = truckCount.inactive;

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = truckCount.active;
        updatedTableData[1].length = truckCount.inactive;

        this.tableData = [...updatedTableData];
    }

    private getTabData(dataType: string): TrailerActiveState[] {
        if (dataType === TableStringEnum.ACTIVE) {
            this.trailerActive = this.trailerActiveQuery.getAll();

            return this.trailerActive?.length ? this.trailerActive : [];
        } else if (dataType === TableStringEnum.INACTIVE) {
            this.inactiveTabClicked = true;

            this.trailerInactive = this.trailerInactiveQuery.getAll();

            return this.trailerInactive?.length ? this.trailerInactive : [];
        }
    }

    private trailerBackFilter(
        filter: {
            active: number;
            pageIndex: number;
            pageSize: number;
            companyId: number | undefined;
            sort: string | undefined;
            searchOne: string | undefined;
            searchTwo: string | undefined;
            searchThree: string | undefined;
        },
        isShowMore?: boolean
    ): void {
        this.trailerService
            .getTrailers(
                filter.active,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((trailer: TrailerListResponse) => {
                if (!isShowMore) {
                    this.viewData = trailer.pagination.data;

                    this.viewData = this.viewData.map((data: any) => {
                        return this.mapTrailerData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    trailer.pagination.data.map((data: any) => {
                        newData.push(this.mapTrailerData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    public onToolBarAction(event: TableToolbarActions): void {
        // Open Modal
        if (event.action === TableStringEnum.OPEN_MODAL) {
            this.modalService.openModal(TrailerModalComponent, {
                size: TableStringEnum.SMALL,
            });
        }
        // Select Tab
        else if (event.action === TableStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;
            this.backFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;

            if (
                this.selectedTab === TableStringEnum.INACTIVE &&
                !this.inactiveTabClicked
            ) {
                this.trailerService
                    .getTrailers(0, 1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((trailerPagination) => {
                        this.trailerInactiveStore.set(
                            trailerPagination.pagination.data
                        );
                        this.sendTrailerData();
                    });
            } else {
                this.sendTrailerData();
            }
        }
        // View Mode
        else if (event.action === TableStringEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;
        } else if (event.action === TableStringEnum.ACTIVATE_ITEM) {
            let status = false;
            let mappedEvent = [];
            this.viewData.map((data) => {
                event.tabData.data.map((element) => {
                    if (data.id === element) {
                        status = data.status;
                        mappedEvent.push({
                            ...data,
                            data: {
                                ...data,
                                number: data.trailerNumber,
                                avatar: `assets/svg/common/trailers/${data?.trailerType?.logoName}`,
                            },
                        });
                    }
                });
            });
            this.modalService.openModal(
                TaConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    data: null,
                    array: mappedEvent,
                    template: TableStringEnum.TRAILER_2,
                    type: status
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                    svg: true,
                }
            );
        }
    }

    public onTableHeadActions(event: {
        action: string;
        direction: string;
    }): void {
        if (event.action === TableStringEnum.SORT) {
            if (event.direction) {
                this.backFilterQuery.active =
                    this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
                this.backFilterQuery.sort = event.direction;
                this.backFilterQuery.pageIndex = 1;

                this.trailerBackFilter(this.backFilterQuery);
            } else {
                this.sendTrailerData();
            }
        }
    }

    public onTableBodyActions(event: TrailerBodyResponse): void {
        const mappedEvent = {
            ...event,
            data: {
                ...event.data,
                number: event.data?.trailerNumber,
                avatar: `assets/svg/common/trailers/${event.data?.trailerType?.logoName}`,
            },
        };

        switch (event.type) {
            case TableStringEnum.SHOW_MORE: {
                this.backFilterQuery.active =
                    this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
                this.backFilterQuery.pageIndex++;

                this.trailerBackFilter(this.backFilterQuery, true);
                break;
            }
            case TableStringEnum.VIEW_DETAILS: {
                this.router.navigate([`/list/trailer/${event.id}/details`]);
                break;
            }
            case TableStringEnum.EDIT_TRAILER: {
                this.modalService.openModal(
                    TrailerModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        type: TableStringEnum.EDIT,
                        disableButton: true,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case TableStringEnum.ADD_REGISTRATION: {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        modal: TableStringEnum.TRAILER_2,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case TableStringEnum.ADD_INSPECTION: {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        modal: TableStringEnum.TRAILER_2,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case TableStringEnum.ACTIVATE_ITEM: {
                this.modalService.openModal(
                    TaConfirmationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: TableStringEnum.TRAILER_2,
                        type:
                            event.data.status === 1
                                ? TableStringEnum.DEACTIVATE
                                : TableStringEnum.ACTIVATE,
                        svg: true,
                    }
                );
                break;
            }
            case TableStringEnum.DELETE_ITEM: {
                this.modalService.openModal(
                    TaConfirmationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: TableStringEnum.TRAILER_2,
                        type: TableStringEnum.DELETE,
                        svg: true,
                    }
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    // Get Tab Table Data For Selected Tab
    private getSelectedTabTableData(): void {
        if (this.tableData?.length) {
            this.activeTableData = this.tableData.find(
                (table) => table.field === this.selectedTab
            );
        }
    }

    // Show More Data
    public onShowMore(): void {
        this.onTableBodyActions({
            type: TableStringEnum.SHOW_MORE,
        });
    }

    private changeTrailerStatus(id: number): void {
        this.trailerService
            .changeTrailerStatus(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteTrailerById(id: number): void {
        this.trailerService
            .deleteTrailerById(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((trailer) => {
                        if (trailer.id === id) {
                            trailer.actionAnimation = TableStringEnum.DELETE;
                        }

                        return trailer;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                true,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 900);
                },
                error: () => {},
            });
    }

    private multipleDeleteTrailers(response): void {
        this.trailerService
            .deleteTrailerList(response, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                let trailerNumber: string =
                    TableStringEnum.EMPTY_STRING_PLACEHOLDER;
                let trailersText: string = TableStringEnum.TRAILER;

                this.viewData = this.viewData.map((trailer) => {
                    response.map((id) => {
                        if (trailer.id === id) {
                            trailer.actionAnimation =
                                TableStringEnum.DELETE_MULTIPLE;

                            if (
                                trailerNumber ==
                                TableStringEnum.EMPTY_STRING_PLACEHOLDER
                            ) {
                                trailerNumber = trailer.trailerNumber;
                            } else {
                                trailerNumber =
                                    trailerNumber +
                                    TableStringEnum.COMA +
                                    trailer.trailerNumber;
                                trailersText = TableStringEnum.TRAILER;
                            }
                        }
                    });

                    return trailer;
                });

                this.updateDataCount();

                trailerNumber = TableStringEnum.EMPTY_STRING_PLACEHOLDER;
                const inetval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

                    clearInterval(inetval);
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});

        this.resizeObserver.disconnect();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
