import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

// Components
import { TrailerModalComponent } from '../../modals/trailer-modal/trailer-modal.component';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import {
    Confirmation,
    ConfirmationModalComponent,
} from '../../modals/confirmation-modal/confirmation-modal.component';

// Services
import { ConfirmationService } from './../../modals/confirmation-modal/confirmation.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TrailerTService } from '../state/trailer.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';

// Modals
import { TrailerListResponse, TrailerResponse } from 'appcoretruckassist';
import { getTrailerColumnDefinition } from '../../../../../assets/utils/settings/trailer-columns';
import { DropdownItem, ToolbarActions } from '../../shared/model/cardTableData';
import {
    DataForCardsAndTables,
    TableColumnConfig,
} from '../../shared/model/table-components/all-tables.modal';
import {
    BodyResponseTrailer,
    MappedTrailer,
    TraillerData,
    backFilterQueryInterface,
} from '../trailer.modal';
import { CardRows, TableOptionsInterface } from '../../shared/model/cardData';

// Store
import { TrailerActiveQuery } from '../state/trailer-active-state/trailer-active.query';
import { TrailerActiveState } from '../state/trailer-active-state/trailer-active.store';
import { TrailerInactiveQuery } from '../state/trailer-inactive-state/trailer-inactive.query';
import { TrailerInactiveState } from '../state/trailer-inactive-state/trailer-inactive.store';
import { TrailerInactiveStore } from '../state/trailer-inactive-state/trailer-inactive.store';

// Pipes
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { DatePipe } from '@angular/common';

// Animations
import {
    closeAnimationAction,
    tableSearch,
} from '../../../utils/methods.globals';

//Constants
import { TableDropdownTrailerComponentConstants } from 'src/app/core/utils/constants/table-components.constants';

//Configuration
import { DisplayTrailerConfiguration } from '../trailer-card-data';

// Enum
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';
import {
    TooltipColors,
    TrailerName,
} from 'src/app/core/utils/enums/trailer-component.enum';

@Component({
    selector: 'app-trailer-table',
    templateUrl: './trailer-table.component.html',
    styleUrls: ['./trailer-table.component.scss'],
    providers: [TaThousandSeparatorPipe],
})
export class TrailerTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public tableOptions: TableOptionsInterface;
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];
    public selectedTab: ConstantStringTableComponentsEnum | string =
        ConstantStringTableComponentsEnum.ACTIVE;
    public activeViewMode: string = ConstantStringTableComponentsEnum.LIST;
    public resizeObserver: ResizeObserver;
    public inactiveTabClicked: boolean = false;
    public trailerActive: TrailerActiveState[] = [];
    public trailerInactive: TrailerInactiveState[] = [];
    public activeTableData: string;
    public backFilterQuery: backFilterQueryInterface =
        TableDropdownTrailerComponentConstants.BACK_FILTER_QUERY;

    //Data to display from model Truck Active
    public displayRowsFrontActive: CardRows[] =
        DisplayTrailerConfiguration.displayRowsFrontActive;
    public displayRowsBackActive: CardRows[] =
        DisplayTrailerConfiguration.displayRowsBackActive;

    public displayRowsFrontInactive: CardRows[] =
        DisplayTrailerConfiguration.displayRowsFrontInactive;
    public displayRowsBackInactive: CardRows[] =
        DisplayTrailerConfiguration.displayRowsBackInactive;

    public cardTitle: string = DisplayTrailerConfiguration.cardTitle;
    public page: string = DisplayTrailerConfiguration.page;
    public rows: number = DisplayTrailerConfiguration.rows;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];
    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private trailerActiveQuery: TrailerActiveQuery,
        private trailerInactiveQuery: TrailerInactiveQuery,
        private trailerService: TrailerTService,
        public datePipe: DatePipe,
        private router: Router,
        private thousandSeparator: TaThousandSeparatorPipe,
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
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case ConstantStringTableComponentsEnum.DELETE: {
                            this.deleteTrailerById(res.id);
                            break;
                        }
                        case ConstantStringTableComponentsEnum.ACTIVATE: {
                            this.changeTrailerStatus(res.id);
                            break;
                        }
                        case ConstantStringTableComponentsEnum.DEACTIVATE: {
                            this.changeTrailerStatus(res.id);
                            break;
                        }
                        case ConstantStringTableComponentsEnum.MULTIPLE_DELETE: {
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
                if (res?.animation === ConstantStringTableComponentsEnum.ADD) {
                    this.viewData.push(this.mapTrailerData(res.data));

                    this.viewData = this.viewData.map((trailer: any) => {
                        if (trailer.id === res.id) {
                            trailer.actionAnimation =
                                ConstantStringTableComponentsEnum.ADD;
                        }

                        return trailer;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 2300);
                }
                // Add Trailer Inactive
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.ADD &&
                    this.selectedTab ===
                        ConstantStringTableComponentsEnum.INACTIVE
                ) {
                    this.updateDataCount();
                }
                // Update Trailer
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.UPDATE
                ) {
                    this.viewData = this.viewData.map((trailer: any) => {
                        if (trailer.id === res.id) {
                            trailer = this.mapTrailerData(res.data);
                            trailer.actionAnimation =
                                ConstantStringTableComponentsEnum.UPDATE;
                        }

                        return trailer;
                    });

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);
                }
                // Update Trailer Status
                else if (
                    res?.animation ===
                    ConstantStringTableComponentsEnum.UPDATE_STATUS
                ) {
                    let trailerIndex: number;

                    this.viewData = this.viewData.map(
                        (trailer: any, index: number) => {
                            if (trailer.id === res.id) {
                                trailer.actionAnimation =
                                    this.selectedTab ===
                                    ConstantStringTableComponentsEnum.ACTIVE
                                        ? ConstantStringTableComponentsEnum.DEACTIVATE
                                        : ConstantStringTableComponentsEnum.ACTIVATE;
                                trailerIndex = index;
                            }

                            return trailer;
                        }
                    );

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
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
                        ConfirmationModalComponent,
                        { size: ConstantStringTableComponentsEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template:
                                ConstantStringTableComponentsEnum.TRAILER_2,
                            type: ConstantStringTableComponentsEnum.MULTIPLE_DELETE,
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
                        this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                            ? 1
                            : 0;

                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(res, this.backFilterQuery);

                    if (searchEvent) {
                        if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.API
                        ) {
                            this.trailerBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.STORE
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
            document.querySelector(
                ConstantStringTableComponentsEnum.TABLE_CONTAINER
            )
        );
    }

    public initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTrailerFilter: true,
                viewModeOptions: [
                    {
                        name: ConstantStringTableComponentsEnum.LIST,
                        active:
                            this.activeViewMode ===
                            ConstantStringTableComponentsEnum.LIST,
                    },
                    {
                        name: ConstantStringTableComponentsEnum.CARD,
                        active:
                            this.activeViewMode ===
                            ConstantStringTableComponentsEnum.CARD,
                    },
                ],
            },
        };
    }

    private sendTrailerData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.TRAILER_TAB_VIEW
            )
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const trailerCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.TRAILER_TABLE_COUNT
            )
        );

        const truckActiveData =
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.ACTIVE)
                : [];

        const truckInactiveData =
            this.selectedTab === ConstantStringTableComponentsEnum.INACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: ConstantStringTableComponentsEnum.ACTIVE_2,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: trailerCount.active,
                data: truckActiveData,
                extended: false,
                gridNameTitle: ConstantStringTableComponentsEnum.TRAILER_3,
                stateName: ConstantStringTableComponentsEnum.TRAILERS,
                tableConfiguration: ConstantStringTableComponentsEnum.TRAILER_4,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.TRAILER_4
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.INACTIVE_2,
                field: ConstantStringTableComponentsEnum.INACTIVE,
                length: trailerCount.inactive,
                data: truckInactiveData,
                extended: false,
                gridNameTitle: ConstantStringTableComponentsEnum.TRAILER_3,
                stateName: ConstantStringTableComponentsEnum.TRAILERS,
                tableConfiguration: ConstantStringTableComponentsEnum.TRAILER_4,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.TRAILER_4
                ),
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
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? ((this.sendDataToCardsFront = this.displayRowsFrontActive),
                  (this.sendDataToCardsBack = this.displayRowsBackActive))
                : ((this.sendDataToCardsFront = this.displayRowsFrontInactive),
                  (this.sendDataToCardsBack = this.displayRowsBackInactive));

            this.getSelectedTabTableData();
        } else {
            this.viewData = [];
        }
    }

    private setTrailerTooltipColor(trailerName: string): string {
        if (trailerName === TrailerName.REEFER) {
            return TooltipColors.BLUE;
        } else if (trailerName === TrailerName.DRY_VAN) {
            return TooltipColors.DARK_BLUE;
        } else if (trailerName === TrailerName.DUMPER) {
            return TooltipColors.PURPLE;
        } else if (trailerName === TrailerName.TANKER) {
            return TooltipColors.GREEN;
        } else if (trailerName === TrailerName.PNEUMATIC_TANKER) {
            return TooltipColors.LIGHT_GREEN;
        } else if (trailerName === TrailerName.CAR_HAULER) {
            return TooltipColors.PINK;
        } else if (trailerName === TrailerName.CAR_HAULER_STINGER) {
            return TooltipColors.PINK;
        } else if (trailerName === TrailerName.CHASSIS) {
            return TooltipColors.BROWN;
        } else if (trailerName === TrailerName.LOW_BOY_RGN) {
            return TooltipColors.RED;
        } else if (trailerName === TrailerName.STEP_DECK) {
            return TooltipColors.RED;
        } else if (trailerName === TrailerName.FLAT_BED) {
            return TooltipColors.RED;
        } else if (trailerName === TrailerName.SIDE_KIT) {
            return TooltipColors.ORANGE;
        } else if (trailerName === TrailerName.CONESTOGA) {
            return TooltipColors.GOLD;
        } else if (trailerName === TrailerName.CONTAINER) {
            return TooltipColors.YELLOW;
        }
    }

    private mapTrailerData(data: TraillerData): MappedTrailer {
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
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                boldText: data?.vin
                    ? data.vin.substr(data.vin.length - 6)
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            },
            tableTrailerTypeClass: data.trailerType.logoName.replace(
                ConstantStringTableComponentsEnum.SVG,
                ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            ),
            tableMake: data?.trailerMake?.name
                ? data.trailerMake.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableModel: data?.model
                ? data?.model
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableColor: data?.color?.code
                ? data.color.code
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            colorName: data?.color?.name
                ? data.color.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tabelLength: data?.trailerLength?.name
                ? data.trailerLength.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableDriver: ConstantStringTableComponentsEnum.NA,
            tableTruck: ConstantStringTableComponentsEnum.NA,
            tableTruckType: ConstantStringTableComponentsEnum.NA,
            tableOwner: data?.owner?.name
                ? data.owner.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableWeightEmpty: data?.emptyWeight
                ? this.thousandSeparator.transform(data.emptyWeight) +
                  ConstantStringTableComponentsEnum.POUNDS_2
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableWeightVolume: ConstantStringTableComponentsEnum.NA,
            tableAxle: data?.axles
                ? data?.axles
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableSuspension: data?.suspension?.name
                ? data.suspension.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableTireSize: data?.tireSize?.name
                ? data.tireSize.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableReeferUnit: data?.reeferUnit?.name
                ? data.reeferUnit.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableDoorType: data?.doorType?.name
                ? data.doorType.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableInsPolicy: data?.insurancePolicy
                ? data.insurancePolicy
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableMileage: data?.mileage
                ? this.thousandSeparator.transform(data.mileage)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableLicencePlateDetailNumber: data?.licensePlate
                ? data.licensePlate
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableLicencePlateDetailST: ConstantStringTableComponentsEnum.NA,
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
                ? data?.fhwaExp + ConstantStringTableComponentsEnum.MONTHS
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
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
            tableTitleNumber: ConstantStringTableComponentsEnum.NA,
            tableTitleST: ConstantStringTableComponentsEnum.NA,
            tableTitlePurchase: ConstantStringTableComponentsEnum.NA,
            tableTitleIssued: ConstantStringTableComponentsEnum.NA,
            tablePurchaseDate: data.purchaseDate
                ? this.datePipe.transform(
                      data.purchaseDate,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tablePurchasePrice: data?.purchasePrice
                ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.purchasePrice)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableTerminated: ConstantStringTableComponentsEnum.NA,
            tableAdded: data.createdAt
                ? this.datePipe.transform(
                      data.createdAt,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: data.updatedAt
                ? this.datePipe.transform(
                      data.updatedAt,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,

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
                title: ConstantStringTableComponentsEnum.EDIT_2,
                name: ConstantStringTableComponentsEnum.EDIT_TRAILER,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
            },
            {
                title: ConstantStringTableComponentsEnum.VIEW_DETAILS_2,
                name: ConstantStringTableComponentsEnum.VIEW_DETAILS,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: ConstantStringTableComponentsEnum.ADD_NEW_2,
                name: ConstantStringTableComponentsEnum.ADD_NEW,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: ConstantStringTableComponentsEnum.ADD_REGISTRATION_2,
                        name: ConstantStringTableComponentsEnum.ADD_REGISTRATION,
                    },

                    {
                        title: ConstantStringTableComponentsEnum.ADD_INSPECTION_2,
                        name: ConstantStringTableComponentsEnum.ADD_INSPECTION,
                    },
                ],
                hasBorder: true,
            },
            {
                title: ConstantStringTableComponentsEnum.SHARE_2,
                name: ConstantStringTableComponentsEnum.SHARE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: ConstantStringTableComponentsEnum.PRINT_2,
                name: ConstantStringTableComponentsEnum.PRINT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },

                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                hasBorder: true,
            },
            {
                title:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? ConstantStringTableComponentsEnum.DEACTIVATE_2
                        : ConstantStringTableComponentsEnum.ACTIVATE_2,
                name: ConstantStringTableComponentsEnum.ACTIVATE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? ConstantStringTableComponentsEnum.DEACTIVATE
                        : ConstantStringTableComponentsEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: ConstantStringTableComponentsEnum.DELETE_2,
                name: ConstantStringTableComponentsEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.DELETE,
            },
        ];
    }

    private updateDataCount(): void {
        const truckCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.TRAILER_TABLE_COUNT
            )
        );

        this.tableData[0].length = truckCount.active;
        this.tableData[1].length = truckCount.inactive;

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = truckCount.active;
        updatedTableData[1].length = truckCount.inactive;

        this.tableData = [...updatedTableData];
    }

    private getTabData(dataType: string): TrailerActiveState[] {
        if (dataType === ConstantStringTableComponentsEnum.ACTIVE) {
            this.trailerActive = this.trailerActiveQuery.getAll();

            return this.trailerActive?.length ? this.trailerActive : [];
        } else if (dataType === ConstantStringTableComponentsEnum.INACTIVE) {
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

    public onToolBarAction(event: ToolbarActions): void {
        // Open Modal
        if (event.action === ConstantStringTableComponentsEnum.OPEN_MODAL) {
            this.modalService.openModal(TrailerModalComponent, {
                size: ConstantStringTableComponentsEnum.SMALL,
            });
        }
        // Select Tab
        else if (
            event.action === ConstantStringTableComponentsEnum.TAB_SELECTED
        ) {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;
            this.backFilterQuery.active =
                this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                    ? 1
                    : 0;

            if (
                this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE &&
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
        else if (event.action === ConstantStringTableComponentsEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;
        }
    }

    public onTableHeadActions(event: {
        action: string;
        direction: string;
    }): void {
        if (event.action === ConstantStringTableComponentsEnum.SORT) {
            if (event.direction) {
                this.backFilterQuery.active =
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? 1
                        : 0;
                this.backFilterQuery.sort = event.direction;
                this.backFilterQuery.pageIndex = 1;

                this.trailerBackFilter(this.backFilterQuery);
            } else {
                this.sendTrailerData();
            }
        }
    }

    public onTableBodyActions(event: BodyResponseTrailer): void {
        const mappedEvent = {
            ...event,
            data: {
                ...event.data,
                number: event.data?.trailerNumber,
                avatar: `assets/svg/common/trailers/${event.data?.trailerType?.logoName}`,
            },
        };

        switch (event.type) {
            case ConstantStringTableComponentsEnum.SHOW_MORE: {
                this.backFilterQuery.active =
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? 1
                        : 0;
                this.backFilterQuery.pageIndex++;

                this.trailerBackFilter(this.backFilterQuery, true);
                break;
            }
            case ConstantStringTableComponentsEnum.VIEW_DETAILS: {
                this.router.navigate([`/list/trailer/${event.id}/details`]);
                break;
            }
            case ConstantStringTableComponentsEnum.EDIT_TRAILER: {
                this.modalService.openModal(
                    TrailerModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        type: ConstantStringTableComponentsEnum.EDIT,
                        disableButton: true,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case ConstantStringTableComponentsEnum.ADD_REGISTRATION: {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        modal: ConstantStringTableComponentsEnum.TRAILER_2,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case ConstantStringTableComponentsEnum.ADD_INSPECTION: {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        modal: ConstantStringTableComponentsEnum.TRAILER_2,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case ConstantStringTableComponentsEnum.ACTIVATE_ITEM: {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: ConstantStringTableComponentsEnum.TRAILER_2,
                        type:
                            event.data.status === 1
                                ? ConstantStringTableComponentsEnum.DEACTIVATE
                                : ConstantStringTableComponentsEnum.ACTIVATE,
                        svg: true,
                    }
                );
                break;
            }
            case ConstantStringTableComponentsEnum.DELETE_ITEM: {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: ConstantStringTableComponentsEnum.TRAILER_2,
                        type: ConstantStringTableComponentsEnum.DELETE,
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
            type: ConstantStringTableComponentsEnum.SHOW_MORE,
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
                            trailer.actionAnimation =
                                ConstantStringTableComponentsEnum.DELETE;
                        }

                        return trailer;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
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
            .deleteTrailerList(response)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                let trailerNumber: string =
                    ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER;
                let trailersText: string =
                    ConstantStringTableComponentsEnum.TRAILER;

                this.viewData = this.viewData.map((trailer) => {
                    response.map((id) => {
                        if (trailer.id === id) {
                            trailer.actionAnimation =
                                ConstantStringTableComponentsEnum.DELETE_MULTIPLE;

                            if (
                                trailerNumber ==
                                ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
                            ) {
                                trailerNumber = trailer.trailerNumber;
                            } else {
                                trailerNumber =
                                    trailerNumber +
                                    ConstantStringTableComponentsEnum.COMA +
                                    trailer.trailerNumber;
                                trailersText =
                                    ConstantStringTableComponentsEnum.TRAILER;
                            }
                        }
                    });

                    return trailer;
                });

                this.updateDataCount();

                trailerNumber =
                    ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER;
                const inetval = setInterval(() => {
                    this.viewData = closeAnimationAction(true, this.viewData);

                    clearInterval(inetval);
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});
        // this.resizeObserver.unobserve(
        //     document.querySelector(ConstantStringTableComponentsEnum.TABLE_CONTAINER)
        // );
        this.resizeObserver.disconnect();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
