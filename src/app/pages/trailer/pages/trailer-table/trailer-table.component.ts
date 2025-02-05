import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, skip, Subject, takeUntil } from 'rxjs';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// base classes
import { TrailerDropdownMenuActionsBase } from '@pages/trailer/base-classes';

// settings
import { getTrailerColumnDefinition } from '@shared/utils/settings/table-settings/trailer-columns';

// services
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { TrailerService } from '@shared/services/trailer.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { TrailerCardsModalService } from '@pages/trailer/pages/trailer-card-modal/services/trailer-cards-modal.service';
import { CaSearchMultipleStatesService } from 'ca-components';
import { DetailsDataService } from '@shared/services/details-data.service';

// store
import { TrailerActiveQuery } from '@pages/trailer/state/trailer-active-state/trailer-active.query';
import {
    TrailerActiveState,
    TrailerActiveStore,
} from '@pages/trailer/state/trailer-active-state/trailer-active.store';
import { TrailerInactiveQuery } from '@pages/trailer/state/trailer-inactive-state/trailer-inactive.query';
import { TrailerInactiveState } from '@pages/trailer/state/trailer-inactive-state/trailer-inactive.store';
import { TrailerInactiveStore } from '@pages/trailer/state/trailer-inactive-state/trailer-inactive.store';
import { Store, select } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectInactiveTabCards,
} from '@pages/trailer/pages/trailer-card-modal/state/trailer-card-modal.selectors';

// pipes
import { DatePipe } from '@angular/common';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TrailerNameStringEnum } from '@shared/enums/trailer-name-string.enum';
import { TooltipColorsStringEnum } from '@shared/enums/tooltip-colors-string.enum';
import { DropdownMenuStringEnum } from '@shared/enums';

// constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';
import { TrailerCardsModalConfig } from '@pages/trailer/pages/trailer-card-modal/utils/constants/trailer-cards-modal.config';
import { TrailerCardDataConstants } from '@pages/trailer/pages/trailer-table/utils/constants/trailer-card-data.constants';

// helpers
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';
import { DropdownMenuContentHelper } from '@shared/utils/helpers';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

// models
import { TrailerListResponse } from 'appcoretruckassist';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { TrailerMapped } from '@pages/trailer/pages/trailer-table/models/trailer-mapped.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';

import { TrailerBackFilterQueryInterface } from '@pages/trailer/pages/trailer-table/models/trailer-back-filter-query.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { TableColumnConfig } from '@shared/models/table-models/table-column-config.model';
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

@Component({
    selector: 'app-trailer-table',
    templateUrl: './trailer-table.component.html',
    styleUrls: ['./trailer-table.component.scss'],
    providers: [ThousandSeparatorPipe],
})
export class TrailerTableComponent
    extends TrailerDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    private destroy$ = new Subject<void>();

    public dropdownMenuStringEnum = DropdownMenuStringEnum;

    public resizeObserver: ResizeObserver;
    public activeViewMode: string = TableStringEnum.LIST;

    public selectedTab: TableStringEnum | string = TableStringEnum.ACTIVE;

    public trailerActive: TrailerActiveState[] = [];
    public trailerInactive: TrailerInactiveState[] = [];

    public trailerData: any[] = [];

    public inactiveTabClicked: boolean = false;
    public activeTableData: string;

    // table
    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];

    // cards
    public cardTitle: string = TrailerCardDataConstants.cardTitle;
    public page: string = TrailerCardDataConstants.page;
    public rows: number = TrailerCardDataConstants.rows;

    //Data to display from model Truck Active
    public displayRowsFront: CardRows[] =
        TrailerCardDataConstants.displayRowsFrontActive;
    public displayRowsBack: CardRows[] =
        TrailerCardsModalConfig.displayRowsBackActive;

    public displayRowsFrontActive: CardRows[] =
        TrailerCardDataConstants.displayRowsFrontActive;
    public displayRowsBackActive: CardRows[] =
        TrailerCardDataConstants.displayRowsBackActive;

    public displayRowsFrontInactive: CardRows[] =
        TrailerCardDataConstants.displayRowsFrontInactive;
    public displayRowsBackInactive: CardRows[] =
        TrailerCardDataConstants.displayRowsBackInactive;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    public displayRows$: Observable<any>; //leave this as any for now

    // filters
    public backFilterQuery: TrailerBackFilterQueryInterface = JSON.parse(
        JSON.stringify(TableDropdownComponentConstants.BACK_FILTER_QUERY)
    );

    constructor(
        protected router: Router,
        //Services
        protected modalService: ModalService,
        private tableService: TruckassistTableService,
        private trailerService: TrailerService,
        private confirmationService: ConfirmationService,
        private trailerCardsModalService: TrailerCardsModalService,
        private confirmationActivationService: ConfirmationActivationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,
        private detailsDataService: DetailsDataService,

        //Store
        private trailerActiveQuery: TrailerActiveQuery,
        private trailerInactiveQuery: TrailerInactiveQuery,
        private trailerInactiveStore: TrailerInactiveStore,
        private trailerActiveStore: TrailerActiveStore,
        private store: Store,

        //Pipes
        public datePipe: DatePipe,
        private thousandSeparator: ThousandSeparatorPipe
    ) {
        super();
    }

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
            .pipe(skip(1), takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filterType) {
                    this.backFilterQuery.trailerTypeIds = res.queryParams;
                    this.trailerBackFilter(this.backFilterQuery);
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

        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (!res.array) {
                        this.detailsDataService.setNewData(res.data);
                        this.changeTrailerStatus(res.data.id);
                    } else {
                        res.array.map((trailer) => {
                            this.detailsDataService.setNewData(trailer);
                            this.changeTrailerStatus(trailer.id);
                        });
                    }
                }
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
                    this.updateDataCount();
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
                                avatar: item.tableData?.tableTrailerTypeIcon
                                    ? `assets/svg/common/trailers/${item.tableData?.tableTrailerTypeIcon}`
                                    : `assets/svg/common/trailers/${item.tableData?.trailerType?.logoName}`,
                            },
                        };
                    });
                    this.modalService.openModal(
                        ConfirmationModalComponent,
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
        this.caSearchMultipleStatesService.selectedChips$
            .pipe(skip(1), takeUntil(this.destroy$))
            .subscribe((res) => {
                this.backFilterQuery.searchOne = res[0] ?? null;
                this.backFilterQuery.searchTwo = res[1] ?? null;
                this.backFilterQuery.searchThree = res[2] ?? null;
                this.trailerBackFilter(this.backFilterQuery);
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
            this.backFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
            this.activeViewMode = tableView.viewMode;
            this.detailsDataService.setActivation(
                !!!this.backFilterQuery.active
            );
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

        this.updateCardView();
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

    private setTrailerData(td: CardTableData): void {
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

    private mapTrailerData(data: TrailerMapped): any {
        const {
            id,
            assignedTo,
            axles,
            color,
            createdAt,
            doorType,
            emptyWeight,
            fhwaExp,
            fhwaInspection,
            fileCount,
            inspectionExpirationDays,
            inspectionPercentage,
            insurancePolicy,
            licensePlate,
            mileage,
            model,
            note,
            owner,
            purchaseDate,
            purchasePrice,
            reeferUnit,
            registrationExpirationDays,
            updatedAt,
            deactivatedAt,
            registrationPercentage,
            registrationState,
            status,
            suspension,
            tireSize,
            title,
            trailerLength,
            trailerMake,
            trailerNumber,
            trailerType,
            vin,
            files,
            volume,
            year,
        } = data;

        return {
            id,
            status,
            trailerNumber,
            year,
            note,
            isSelected: false,
            tableTrailerTypeIcon: trailerType.logoName,
            tableTrailerName: trailerType.name,
            tableTrailerColor: MethodsGlobalHelper.getTrailerTooltipColor(trailerType.name),
            tableVin: {
                regularText: vin
                    ? vin.substr(0, vin.length - 6)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                boldText: vin
                    ? vin.substr(vin.length - 6)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            tableTrailerTypeClass: trailerType.name
                .trim()
                .replace(' ', TableStringEnum.EMPTY_STRING_PLACEHOLDER)
                .toLowerCase(),
            tableMake: trailerMake?.name,
            tableModel: model,
            color: color,
            tableColor: color?.code,
            colorName: color?.name,
            tabelLength: trailerLength?.name
                ? DataFilterHelper.getLengthNumber(trailerLength?.name)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDriver: assignedTo?.driver
                ? assignedTo?.driver?.firstName + assignedTo?.driver?.lastName
                    ? assignedTo?.driver?.lastName
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDriverAvatar: assignedTo?.driver?.avatarFile?.url,
            tableTruck: assignedTo?.truck?.truckNumber,
            tableTruckType: assignedTo?.truck?.truckType?.name,
            tableOwner: owner?.name,
            tableWeightEmpty: emptyWeight
                ? this.thousandSeparator.transform(emptyWeight) +
                  TableStringEnum.POUNDS_2
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableWeightVolume: volume,
            tableAxle: axles,
            tableSuspension: suspension?.name,
            tableTireSize: tireSize?.name,
            tableReeferUnit: reeferUnit?.name,
            tableDoorType: doorType?.name,
            tableInsPolicy: insurancePolicy,
            tableMileage: mileage
                ? this.thousandSeparator.transform(mileage)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLicencePlateDetailNumber: licensePlate,
            tableLicencePlateDetailST: registrationState?.stateShortName,
            tableLicencePlateDetailState: registrationState?.stateName,
            tableLicencePlateDetailExpiration: {
                expirationDays: registrationExpirationDays
                    ? registrationExpirationDays
                    : null,
                expirationDaysText: registrationExpirationDays
                    ? this.thousandSeparator.transform(
                          registrationExpirationDays
                      )
                    : null,
                percentage:
                    registrationPercentage || registrationPercentage === 0
                        ? 100 - registrationPercentage
                        : null,
            },
            tableFHWAInspectionTerm: fhwaExp
                ? fhwaExp + TableStringEnum.MONTHS
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableFHWAInspectionExpiration: {
                expirationDays: inspectionExpirationDays
                    ? inspectionExpirationDays
                    : null,
                expirationDaysText: inspectionExpirationDays
                    ? this.thousandSeparator.transform(inspectionExpirationDays)
                    : null,
                percentage:
                    inspectionPercentage || inspectionPercentage === 0
                        ? 100 - inspectionPercentage
                        : null,
            },
            tableFHWAInspectionIssues: fhwaInspection,
            tableTitleNumber: title?.number,
            tableTitleST: title?.state?.stateShortName,
            tableTitleState: title?.state?.stateName,
            tableTitlePurchase: title?.purchaseDate
                ? this.datePipe.transform(
                      title?.purchaseDate,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTitleIssued: title?.issueDate
                ? this.datePipe.transform(
                      title.issueDate,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePurchasePrice: purchasePrice
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(purchasePrice)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePurchaseDate: purchaseDate
                ? this.datePipe.transform(
                      purchaseDate,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTerminated: TableStringEnum.NA,
            tableAdded: createdAt
                ? this.datePipe.transform(
                      createdAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: updatedAt
                ? this.datePipe.transform(
                      updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDeactivated: deactivatedAt
                ? this.datePipe.transform(
                      updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            tableAttachments: files ? files : [],
            fileCount: fileCount,
            tableDropdownContent: this.getTrailerDropdownContent(),
            createdAt,
            updatedAt,
        };
    }

    public getTrailerDropdownContent(): DropdownMenuItem[] {
        return DropdownMenuContentHelper.getTruckTrailerDropdownContent(
            this.selectedTab
        );
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
            trailerTypeIds?: number[];
            pageIndex: number;
            pageSize: number;
            companyId: number | undefined;
            sort: string | undefined;
            searchOne: string | undefined;
            searchTwo: string | undefined;
            searchThree: string | undefined;
        },
        isShowMore?: boolean,
        updateTrailerTable?: boolean
    ): void {
        this.trailerService
            .getTrailers(
                filter.active,
                filter.trailerTypeIds,
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
                    this.trailerActiveStore.set(this.viewData);
                    this.trailerInactiveStore.set(this.viewData);
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
                if (updateTrailerTable) this.sendTrailerData();
                this.tableService.sendSelectOrDeselect(
                    TableStringEnum.DESELECT
                );
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
            this.backFilterQuery.sort = null;
            this.backFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
            this.caSearchMultipleStatesService.deleteAllChips();

            if (
                this.selectedTab === TableStringEnum.INACTIVE &&
                !this.inactiveTabClicked
            ) {
                this.trailerBackFilter(this.backFilterQuery, false, true);
            } else {
                this.sendTrailerData();
            }

            // on tab change we need to reset chips and trailer type filters
            this.trailerService.updateTableFilters();
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
                                avatar: data?.tableTrailerTypeIcon
                                    ? `/assets/svg/common/trailers/${data?.tableTrailerTypeIcon}`
                                    : `/assets/svg/common/trailers/${data?.trailerType?.logoName}`,
                            },
                            modalTitle: ' Unit ' + data?.trailerNumber,
                            modalSecondTitle: data?.tableVin
                                ? data?.tableVin?.regularText +
                                  data?.tableVin?.boldText
                                : data?.vin,
                        });
                    }
                });
            });
            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    data: null,
                    array: mappedEvent,
                    template: TableStringEnum.TRAILER_2,
                    subType: TableStringEnum.TRAILERS,
                    type: status
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                    tableType: TableStringEnum.TRAILER_2,
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
            this.backFilterQuery.sort = event.direction ?? null;
            this.backFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
            this.backFilterQuery.pageIndex = 1;

            this.trailerBackFilter(this.backFilterQuery);
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

    public updateCardView(): void {
        switch (this.selectedTab) {
            case TableStringEnum.ACTIVE:
                this.displayRows$ = this.store.pipe(
                    select(selectActiveTabCards)
                );
                break;

            case TableStringEnum.INACTIVE:
                this.displayRows$ = this.store.pipe(
                    select(selectInactiveTabCards)
                );
                break;
            default:
                break;
        }
        this.trailerCardsModalService.updateTab(this.selectedTab);
    }

    public saveValueNote(event: { value: string; id: number }): void {
        this.viewData.map((item: CardDetails) => {
            if (item.id === event.id) item.note = event.value;
        });

        const noteData = {
            value: event.value,
            id: event.id,
            selectedTab: this.selectedTab,
        };

        this.trailerService.updateNote(noteData);
    }

    public handleShowMoreAction(): void {
        this.backFilterQuery.active =
            this.selectedTab === DropdownMenuStringEnum.ACTIVE ? 1 : 0;

        this.backFilterQuery.pageIndex++;

        this.trailerBackFilter(this.backFilterQuery, true);
    }

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});

        this.resizeObserver.disconnect();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
