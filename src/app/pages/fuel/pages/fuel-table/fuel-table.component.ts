import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import {
    combineLatest,
    Observable,
    of,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';

// base classes
import { FuelDropdownMenuActionsBase } from '@pages/fuel/base-classes';

// settings
import {
    getFuelStopColumnDefinition,
    getFuelTransactionColumnDefinition,
} from '@shared/utils/settings/table-settings/fuel-columns';

// components
import { FuelPurchaseModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';
import { FuelStopModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-stop-modal/fuel-stop-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { FuelService } from '@shared/services/fuel.service';
import { FuelCardsModalService } from '@pages/fuel/pages/fuel-card-modal/services';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// constants
import { FuelTableConstants } from '@pages/fuel/pages/fuel-table/utils/constants/fuel-table.constants';

// svg routes
import { FuelTableSvgRoutes } from '@pages/fuel/pages/fuel-table/utils/svg-routes/fuel-table-svg-routes';

// pipes
import {
    ThousandSeparatorPipe,
    NameInitialsPipe,
    ActivityTimePipe,
} from '@shared/pipes';

// helpers
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// store
import { FuelQuery } from '@pages/fuel/state/fuel-state/fuel-state.query';
import { select, Store } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectInactiveTabCards,
} from '@pages/fuel/pages/fuel-card-modal/state';

// enums
import { eFuelTransactionType } from '@pages/fuel/pages/fuel-table/enums';
import {
    DropActionsStringEnum,
    eDropdownMenu,
    TableStringEnum,
    eCommonElement,
} from '@shared/enums';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';

// models
import {
    FuelStopListResponse,
    FuelStopResponse,
    FuelTransactionResponse,
} from 'appcoretruckassist';
import { FuelTransactionListResponse } from 'appcoretruckassist';
import { TableColumnConfig } from '@shared/models/table-models/table-column-config.model';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { IFuelTableData } from '@pages/fuel/pages/fuel-table/models/fuel-table-data.model';
import { AvatarColors } from '@shared/models';

@Component({
    selector: 'app-fuel-table',
    templateUrl: './fuel-table.component.html',
    styleUrls: ['./fuel-table.component.scss'],
    providers: [ThousandSeparatorPipe, NameInitialsPipe, ActivityTimePipe],
})
export class FuelTableComponent
    extends FuelDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    public destroy$ = new Subject<void>();

    // enums
    public eDropdownMenu = eDropdownMenu;
    public tableStringEnum = TableStringEnum;
    public eCommonElement = eCommonElement;

    public resizeObserver: ResizeObserver;
    public activeViewMode: string = TableStringEnum.LIST;

    public selectedTab: string;

    public fuelData: IFuelTableData;

    // table
    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];

    // cards
    public displayRows$: Observable<any>;

    public tableDataLength: number;

    // map
    public mapListData = [];

    private avatarColorMappingIndexByDriverId: { [key: string]: AvatarColors } =
        {};

    constructor(
        // router
        protected router: Router,

        // services
        protected modalService: ModalService,
        protected fuelService: FuelService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,
        private fuelCardsModalService: FuelCardsModalService,
        private confirmationService: ConfirmationService,
        private confirmationActivationService: ConfirmationActivationService,

        // pipes
        private datePipe: DatePipe,
        private nameInitialsPipe: NameInitialsPipe,
        private activityTimePipe: ActivityTimePipe,
        private thousandSeparator: ThousandSeparatorPipe,

        // store
        private store: Store,
        private fuelQuery: FuelQuery
    ) {
        super();
    }

    ngOnInit(): void {
        this.setActiveTab();

        this.manageSubscriptions();

        this.resetColumns();

        this.resize();

        this.toggleColumns();

        this.deleteSelectedRows();

        this.openCloseBussinessSelectedRows();

        this.rowsSelected();

        this.confirmationSubscribe();

        this.confirmationActivationSubscribe();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendFuelData();
                }
            });
    }

    private resize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((column) => {
                        if (
                            column.title ===
                            response.columns[response.event.index].title
                        ) {
                            column.width = response.event.width;
                        }

                        return column;
                    });
                }
            });
    }

    private toggleColumns(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.column) {
                    this.columns = this.columns.map((column) => {
                        if (column.field === response.column.field) {
                            column.hidden = response.column.hidden;
                        }

                        return column;
                    });
                }
            });
    }

    private rowsSelected(): void {
        this.tableService.currentRowsSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res && this.selectedTab === TableStringEnum.FUEL_STOP) {
                    let selectedClosedCount = 0;
                    let selectedOpenCount = 0;

                    res.forEach(({ tableData: { isClosed } }) =>
                        isClosed ? selectedClosedCount++ : selectedOpenCount++
                    );

                    this.tableOptions.toolbarActions.showMoveToOpenList =
                        selectedClosedCount && !selectedOpenCount;

                    this.tableOptions.toolbarActions.showMoveToClosedList =
                        selectedOpenCount && !selectedClosedCount;
                }
            });
    }

    private deleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.length) {
                    const array = response.map((item) => ({
                        ...item,
                        data: { ...item.tableData },
                    }));

                    const isFuelTransaction =
                        this.selectedTab === TableStringEnum.FUEL_TRANSACTION;

                    const event = {
                        data: null,
                        array,
                        template: isFuelTransaction
                            ? DropActionsStringEnum.FUEL_TRANSACTION_TEXT
                            : DropActionsStringEnum.FUEL_STOP_TEXT,
                        type: TableStringEnum.MULTIPLE_DELETE,
                        modalHeaderTitle: isFuelTransaction
                            ? ConfirmationModalStringEnum.DELETE_FUEL_TRANSACTION
                            : ConfirmationModalStringEnum.DELETE_FUEL_STOP,
                    };

                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        event
                    );
                }
            });
    }

    private openCloseBussinessSelectedRows(): void {
        this.tableService.currentBussinessSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.length) {
                    const mappedRes = res.map(({ tableData: fuelStop }) => {
                        const { id, businessName, address, isClosed } =
                            fuelStop;

                        return {
                            id,
                            data: {
                                status: +!isClosed,
                            },
                            modalTitle: businessName,
                            modalSecondTitle: `${address.city}, ${address.stateShortName}`,
                        };
                    });

                    this.modalService.openModal(
                        ConfirmationActivationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: eDropdownMenu.FUEL_STOP,
                            subType: eDropdownMenu.FUEL_STOP,
                            subTypeStatus: TableStringEnum.BUSINESS,
                            tableType:
                                ConfirmationActivationStringEnum.FUEL_STOP_TEXT,
                            type: mappedRes[0].data.status
                                ? TableStringEnum.CLOSE
                                : TableStringEnum.OPEN,
                        }
                    );
                }
            });
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    const { action } = res;

                    if (action === TableStringEnum.DELETE) return;

                    const { template, type } = res;

                    if (template) {
                        const shouldDeleteFuelStop = template
                            ?.toLowerCase()
                            ?.includes(TableStringEnum.STOP_LOWERCASE);
                        const shouldDeleteFuelTransaction =
                            template === eDropdownMenu.FUEL_TRANSACTION ||
                            (type === TableStringEnum.MULTIPLE_DELETE &&
                                !shouldDeleteFuelStop);
                        const ids =
                            type === TableStringEnum.DELETE
                                ? [res.id]
                                : res.array;

                        if (shouldDeleteFuelStop) this.deleteFuelStopList(ids);
                        if (shouldDeleteFuelTransaction)
                            this.deleteFuelTransactionList(ids);
                    }
                },
            });
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const fuelStopIds = res?.array?.map(({ id }) => id) ?? [
                        res.id,
                    ];

                    fuelStopIds.forEach((id) => this.updateFuelStopStatus(id));
                }
            });
    }

    public handleTableEmptyBtnClickEmit(): void {
        this.openCreateModalBySelectedTab();
    }

    public updateFuelStopStatus(fuelStopId: number): void {
        this.fuelService
            .updateFuelStopStatus(fuelStopId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendFuelData();

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);

                this.tableService.sendResetSpecialFilters(true);
            });
    }

    private deleteFuelTransactionList(ids: number[]): void {
        this.fuelService
            .deleteFuelTransactionsList(ids)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                ids.forEach((id) => {
                    const transaction = this.viewData.find(
                        (transaction) => transaction.id === id
                    );

                    if (transaction)
                        transaction.actionAnimation =
                            TableStringEnum.DELETE_MULTIPLE;
                });

                this.updateDataCount();

                setTimeout(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

                    this.tableData[0].data = this.viewData;
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    private deleteFuelStopList(ids: number[]): void {
        this.fuelService
            .deleteFuelStopList(ids)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                ids.forEach((id) => {
                    const stop = this.viewData.find((stop) => stop.id === id);

                    if (stop)
                        stop.actionAnimation = TableStringEnum.DELETE_MULTIPLE;
                });

                this.updateDataCount();

                setTimeout(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

                    this.tableData[1].data = this.viewData;
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    private updateDataCount(): void {
        const fuelCount = JSON.parse(
            localStorage.getItem(TableStringEnum.FUEL_TABLE_COUNT)
        );

        const updatedTableData = [...this.tableData];

        const index =
            this.selectedTab === TableStringEnum.FUEL_TRANSACTION ? 0 : 1;

        updatedTableData[index].length = !index
            ? fuelCount.fuelTransactions
            : fuelCount.fuelStops;

        this.tableData = [...updatedTableData];
    }

    private observTableContainer(): void {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTimeFilter:
                    this.selectedTab === TableStringEnum.FUEL_TRANSACTION,
                showTruckFilter:
                    this.selectedTab === TableStringEnum.FUEL_TRANSACTION,
                showFuelPermanentlyClosed:
                    this.selectedTab === TableStringEnum.FUEL_STOP,
                showLocationFilter: true,
                showFuelStopFilter:
                    this.selectedTab === TableStringEnum.FUEL_STOP,
                showMoneyFilter: true,
                fuelMoneyFilter: true,
                hideActivationButton: true,
                showCategoryFuelFilter:
                    this.selectedTab === TableStringEnum.FUEL_TRANSACTION,
                showIntegratedFuelTransactionsFilter:
                    this.selectedTab === TableStringEnum.FUEL_TRANSACTION,
                showMoveToOpenList:
                    this.selectedTab === TableStringEnum.FUEL_STOP,
                showMoveToClosedList:
                    this.selectedTab === TableStringEnum.FUEL_STOP,
                showIncompleteFuelTransactionsFilter:
                    this.selectedTab === this.tableStringEnum.FUEL_TRANSACTION,
                viewModeOptions: this.getViewModeOptions(),
            },
            actions: [
                {
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    class: TableStringEnum.REGULAR_TEXT,
                    contentType: TableStringEnum.EDIT,
                    show: true,
                    svg: FuelTableSvgRoutes.DROPDOWN_CONTENT_EDIT,
                    iconName: TableStringEnum.EDIT,
                },
                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE,
                    type: TableStringEnum.FUEL_1,
                    text: FuelTableConstants.TEXT_DELETE_FUEL_POPUP,
                    class: TableStringEnum.DELETE_TEXT,
                    contentType: TableStringEnum.DELETE,
                    show: true,
                    danger: true,
                    svg: FuelTableSvgRoutes.DROPDOWN_CONTENT_DELETE,
                    iconName: TableStringEnum.DELETE,
                    redIcon: true,
                },
            ],
        };
    }

    private getViewModeOptions(): { name: TableStringEnum; active: boolean }[] {
        return this.selectedTab === TableStringEnum.FUEL_TRANSACTION
            ? [
                  {
                      name: TableStringEnum.LIST,
                      active: this.activeViewMode === TableStringEnum.LIST,
                  },
                  {
                      name: TableStringEnum.CARD,
                      active: this.activeViewMode === TableStringEnum.CARD,
                  },
              ]
            : [
                  {
                      name: TableStringEnum.LIST,
                      active: this.activeViewMode === TableStringEnum.LIST,
                  },
                  {
                      name: TableStringEnum.CARD,
                      active: this.activeViewMode === TableStringEnum.CARD,
                  },
                  {
                      name: TableStringEnum.MAP,
                      active: this.activeViewMode === TableStringEnum.MAP,
                  },
              ];
    }

    private sendFuelData(): void {
        const {
            data,
            integratedFuelTransactionsFilterActive,
            integratedFuelTransactionsCount,
            incompleteFuelTransactionsCount,
            fuelStopClosedCount,
        } = this.fuelData;

        this.initTableOptions();
        this.checkActiveViewMode();

        const fuelCount = JSON.parse(
            localStorage.getItem(TableStringEnum.FUEL_TABLE_COUNT)
        );
        const transactionConfigType: string =
            integratedFuelTransactionsFilterActive
                ? TableStringEnum.FUEL_TRANSACTION_EFS
                : TableStringEnum.FUEL_TRANSACTION;

        this.tableData = [
            {
                title: TableStringEnum.TRANSACTIONS,
                field: TableStringEnum.FUEL_TRANSACTION,
                length: fuelCount.fuelTransactions,
                data: data,
                gridNameTitle: TableStringEnum.FUEL,
                integratedDataCount: integratedFuelTransactionsCount,
                incompleteDataCount: incompleteFuelTransactionsCount,
                tableConfiguration: TableStringEnum.FUEL_TRANSACTION,
                isActive: this.selectedTab === TableStringEnum.FUEL_TRANSACTION,
                gridColumns: this.getGridColumns(transactionConfigType),
            },
            {
                title: TableStringEnum.STOP,
                field: TableStringEnum.FUEL_STOP,
                length: fuelCount.fuelStops,
                data: data,
                gridNameTitle: TableStringEnum.FUEL,
                fuelStopClosedCount: fuelStopClosedCount,
                closedArray: DataFilterHelper.checkSpecialFilterArray(
                    data,
                    TableStringEnum.CLOSED_ARRAY
                ),
                tableConfiguration: TableStringEnum.FUEL_STOP,
                showFuelStopFilter:
                    this.selectedTab === TableStringEnum.FUEL_STOP,
                isActive: this.selectedTab === TableStringEnum.FUEL_STOP,
                gridColumns: this.getGridColumns(TableStringEnum.FUEL_STOP),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.tableDataLength = td.length;
        this.setFuelData(td);
        this.updateCardView();
    }

    private checkActiveViewMode(): void {
        if (this.activeViewMode === TableStringEnum.MAP) {
            let hasMapView = false;

            let viewModeOptions =
                this.tableOptions.toolbarActions.viewModeOptions;

            viewModeOptions.map((viewMode: any) => {
                if (viewMode.name === TableStringEnum.MAP) {
                    hasMapView = true;
                }
            });

            if (!hasMapView) {
                this.activeViewMode = TableStringEnum.LIST;

                viewModeOptions = this.getViewModeOptions();
            }

            this.tableOptions.toolbarActions.viewModeOptions = [
                ...viewModeOptions,
            ];
        }
    }

    private getGridColumns(configType: string): void {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (configType === TableStringEnum.FUEL_TRANSACTION)
            return (
                tableColumnsConfig ?? getFuelTransactionColumnDefinition(false)
            );
        else if (configType === TableStringEnum.FUEL_TRANSACTION_EFS)
            return (
                tableColumnsConfig ?? getFuelTransactionColumnDefinition(true)
            );
        else return tableColumnsConfig ?? getFuelStopColumnDefinition();
    }

    private setFuelData(td: any): void {
        this.columns = td.gridColumns;

        if (td.data?.length) {
            this.viewData = [...td.data];

            this.viewData = this.viewData.map((data) => {
                return this.selectedTab === TableStringEnum.FUEL_TRANSACTION
                    ? this.mapFuelTransactionsData(data)
                    : this.mapFuelStopsData(data);
            });
        } else {
            this.viewData = [];
        }
    }

    private mapFuelTransactionsData(data: FuelTransactionResponse) {
        const {
            driver,
            truck,
            trailer,
            fuelCard,
            fuelStopStore,
            transactionDate,
            fuelItems,
            total,
            fuelTransactionType,
            files,
            gallon,
            pricePerGallon,
            fuelTruckNumber,
            fuelCardHolderName,
            createdAt,
            updatedAt,
        } = data;

        const driverFullName = !!driver
            ? `${driver.firstName} ${driver.lastName}`
            : fuelCardHolderName;

        const tableDescriptionDropTotal = total
            ? `$${this.thousandSeparator.transform(total)}`
            : null;

        const isIntegratedFuelTransaction =
            fuelTransactionType?.id !== eFuelTransactionType.Manual;

        const tableType: string = !!fuelTransactionType
            ? eFuelTransactionType[fuelTransactionType?.id]
            : null;

        if (
            driver &&
            !driver?.avatarFile &&
            !this.avatarColorMappingIndexByDriverId[driver?.id]
        )
            this.avatarColorMappingIndexByDriverId[driver?.id] =
                AvatarColorsHelper.getAvatarColors(driver?.id);

        return {
            ...data,
            textDriverShortName:
                this.nameInitialsPipe.transform(driverFullName),
            avatarColor:
                this.avatarColorMappingIndexByDriverId[driver?.id] ?? null,
            avatarSize: FuelTableConstants.AVATAR_SIZE_PX,
            avatarFontSize: FuelTableConstants.AVATAR_FONT_SIZE_PX,
            avatarImg: driver?.avatarFile?.url ?? null,
            avatarIsHoverEffect: FuelTableConstants.AVATAR_IS_HOVER_EFFECT,
            isSelected: false,
            tableTruckNumber: truck?.truckNumber ?? fuelTruckNumber,
            tableTrailer: {
                text: trailer?.trailerNumber,
                type: trailer?.trailerType?.name,
                color: MethodsGlobalHelper.getTrailerTooltipColor(
                    trailer?.trailerType?.name
                ),
                hover: false,
            },
            tableDriverName: driverFullName,
            tableFuelCardNumber: fuelCard?.cardNumber ?? null,
            tableAccount: fuelCard?.accountId,
            tableType,
            tableTransactionDate: transactionDate
                ? this.datePipe.transform(transactionDate, 'MM/dd/yy hh:mm a')
                : null,
            tableFuelStopName: fuelStopStore?.businessName,
            phone: fuelStopStore?.phone,
            fax: fuelStopStore?.fax,
            tableLocation: fuelStopStore?.address
                ? fuelStopStore?.address.city +
                  TableStringEnum.COMA +
                  (fuelStopStore?.address.stateShortName &&
                  fuelStopStore?.address.stateShortName !== TableStringEnum.NULL
                      ? fuelStopStore?.address.stateShortName + null
                      : null) +
                  (fuelStopStore?.address.zipCode &&
                  fuelStopStore?.address.zipCode !== TableStringEnum.NULL
                      ? fuelStopStore?.address.zipCode
                      : null)
                : null,
            tableAddress: fuelStopStore?.address?.address ?? null,
            tableDescription: fuelItems
                ? fuelItems.map((item) => {
                      return {
                          ...item,
                          description: item?.itemFuel?.name,
                          descriptionPrice: item?.price
                              ? TableStringEnum.DOLLAR_SIGN +
                                this.thousandSeparator.transform(item.price)
                              : null,
                          descriptionTotalPrice:
                              TableStringEnum.DOLLAR_SIGN +
                              this.thousandSeparator.transform(item.subtotal),
                          quantity: item?.qty,
                      };
                  })
                : null,
            tableDescriptionDropTotal,
            tableGallon: gallon,
            tablePPG: pricePerGallon,
            tableCost: tableDescriptionDropTotal,
            tableAttachments: files,
            fileCount: files ? files.length : 0,
            tableAdded: this.datePipe.transform(
                data.createdAt,
                TableStringEnum.DATE_FORMAT
            ),
            tableEdited: this.datePipe.transform(
                data.updatedAt,
                TableStringEnum.DATE_FORMAT
            ),
            isIntegratedFuelTransaction,
            isIncompleteFuelTransaction: truck === null || driver === null,
            tableDropdownContent: this.getFuelTransactionDropdownContent(
                isIntegratedFuelTransaction
            ),
            dateAdded: createdAt
                ? this.datePipe.transform(createdAt, 'MM/dd/yy')
                : null,
            dateEdited: updatedAt
                ? this.datePipe.transform(updatedAt, 'MM/dd/yy')
                : null,
        };
    }

    private mapFuelStopsData(data: FuelStopResponse) {
        const {
            businessName,
            store,
            address,
            pricePerGallon,
            totalCost,
            lastUsed,
            used,
            favourite,
            lowestPricePerGallon,
            highestPricePerGallon,
            isClosed,
        } = data || {};
        const { address: addressName } = address || {};

        const tablePriceRange =
            lowestPricePerGallon && highestPricePerGallon
                ? lowestPricePerGallon === highestPricePerGallon
                    ? `$${lowestPricePerGallon}`
                    : `$${lowestPricePerGallon} - $${highestPricePerGallon}`
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER;
        const tableCost = totalCost
            ? `$${totalCost}`
            : FuelTableConstants.NO_EXPENSE;

        const tableLast = {
            startRange: lowestPricePerGallon ?? null,
            endRange: highestPricePerGallon ?? null,
            value: pricePerGallon ?? null,
            unit: FuelTableConstants.DOLLAR,
            lastUsed: lastUsed,
        };
        const tableLastVisit = lastUsed
            ? this.activityTimePipe.transform(lastUsed)
            : TableStringEnum.EMPTY_STRING_PLACEHOLDER;

        return {
            ...data,
            isSelected: false,
            tableName: businessName ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableStore: store ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAddress:
                addressName ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePPG:
                pricePerGallon ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLast: tableLast ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLastVisit: tableLastVisit,
            tableUsed: used ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLastUsed: lastUsed ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePriceRange: tablePriceRange,
            tableCost,
            tableProgressRangeStart:
                lowestPricePerGallon ??
                TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableProgressRangeEnd:
                highestPricePerGallon ??
                TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableProgressRangeValue:
                pricePerGallon ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableFuelStopIsClosed: isClosed,
            isFavorite: favourite,
            isFavoriteDisabled: isClosed,
            tableLocation: address
                ? address?.city +
                  TableStringEnum.COMA +
                  (address?.stateShortName &&
                  address?.stateShortName !== TableStringEnum.NULL
                      ? address?.stateShortName + null
                      : null) +
                  (address?.zipCode && address?.zipCode !== TableStringEnum.NULL
                      ? address?.zipCode
                      : null)
                : null,
            tableAdded: this.datePipe.transform(
                data.createdAt,
                TableStringEnum.DATE_FORMAT
            ),
            tableEdited: data.updatedAt
                ? this.datePipe.transform(
                      data.updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            tableDeactivated: data.deactivatedAt
                ? this.datePipe.transform(
                      data.deactivatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            tableDropdownContent: this.getFuelStopDropdownContent(
                true,
                favourite,
                !isClosed
            ),
        };
    }

    private getFuelTransactionDropdownContent(
        isAutomaticTransaction: boolean
    ): IDropdownMenuItem[] {
        return DropdownMenuContentHelper.getFuelTransactionDropdownContent(
            isAutomaticTransaction
        );
    }

    private getFuelStopDropdownContent(
        isCentralised: boolean,
        isPinned: boolean,
        isOpenBusiness: boolean
    ): IDropdownMenuItem[] {
        return DropdownMenuContentHelper.getFuelStopDropdownContent(
            isCentralised,
            isPinned,
            isOpenBusiness
        );
    }

    public onToolBarAction(event: any): void {
        if (event.action === TableStringEnum.OPEN_MODAL) {
            this.openCreateModalBySelectedTab();
        } else if (event.action === TableStringEnum.TAB_SELECTED) {
            const {
                integratedFuelTransactionsCount,
                fuelStopClosedCount,
                incompleteFuelTransactionsCount,
            } = this.fuelData;

            this.selectedTab = event.tabData.field;

            this.fuelData = {
                data: [],
                integratedFuelTransactionsCount,
                integratedFuelTransactionsFilterActive: false,
                incompleteFuelTransactionsCount,
                incompleteFuelTransactionsFilterActive: false,
                fuelStopClosedCount,
                fuelStopClosedFilterActive: false,
                pageIndex: 1,
            };

            this.fetchApiDataPaginated();
        } else if (event.action === TableStringEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;

            this.tableOptions.toolbarActions.hideSearch =
                event.mode == TableStringEnum.MAP;
        }
    }

    public onTableHeadActions(event: any): void {
        const { action, sortOrder, sortBy } = event;

        if (action === TableStringEnum.SORT) {
            this.fuelData.sortOrder = sortOrder;
            this.fuelData.sortBy = sortBy;

            this.fetchApiDataPaginated();
        }
    }

    private composeFuelData(
        response: FuelTransactionListResponse | FuelStopListResponse
    ): void {
        const { data, pageIndex } = response?.pagination || {};
        const {
            integrationFuelTransactionCount,
            incompleteFuelTransactionCount,
        } = response;
        const { fuelStopClosedCount } = <FuelStopListResponse>response;
        const integratedFuelTransactionsFilterActive =
            this.fuelData?.integratedFuelTransactionsFilterActive ?? false;
        const incompleteFuelTransactionsFilterActive =
            this.fuelData?.incompleteFuelTransactionsFilterActive ?? false;
        const fuelStopClosedFilterActive =
            this.fuelData?.fuelStopClosedFilterActive ?? false;
        const { sortOrder, sortBy } = this.fuelData || {};

        this.fuelData = {
            data,
            integratedFuelTransactionsCount: integrationFuelTransactionCount,
            integratedFuelTransactionsFilterActive,
            incompleteFuelTransactionsCount: incompleteFuelTransactionCount,
            incompleteFuelTransactionsFilterActive,
            fuelStopClosedCount: fuelStopClosedCount,
            fuelStopClosedFilterActive,
            sortOrder,
            sortBy,
            pageIndex,
        } as IFuelTableData;
    }

    private fetchApiDataPaginated(isShowMore?: boolean): void {
        if (isShowMore) this.fuelData.pageIndex++;

        const {
            integratedFuelTransactionsFilterActive,
            incompleteFuelTransactionsFilterActive,
            fuelStopClosedFilterActive,
            pageIndex,
            sortOrder,
            sortBy,
        } = this.fuelData;

        if (this.selectedTab === TableStringEnum.FUEL_TRANSACTION) {
            this.fuelService
                .getFuelTransactionsList(
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    integratedFuelTransactionsFilterActive,
                    incompleteFuelTransactionsFilterActive,
                    pageIndex,
                    FuelTableConstants.TABLE_PAGE_SIZE,
                    null,
                    null,
                    sortOrder,
                    sortBy
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                    this.updateStoreData(response, !isShowMore);
                });
        } else if (this.selectedTab === TableStringEnum.FUEL_STOP) {
            this.fuelService
                .getFuelStopsList(
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    fuelStopClosedFilterActive,
                    pageIndex,
                    FuelTableConstants.TABLE_PAGE_SIZE,
                    null,
                    null,
                    sortOrder,
                    sortBy
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                    this.updateStoreData(response, !isShowMore);
                });
        }
    }

    private updateStoreData(
        response: FuelTransactionListResponse | FuelStopListResponse,
        shouldResetData: boolean = false
    ): void {
        const { data: localData } = this.fuelData;
        const { data: fetchedData } = response?.pagination;

        let dataToStore: FuelTransactionResponse | FuelStopListResponse =
            response;
        dataToStore.pagination.data = shouldResetData
            ? [...fetchedData]
            : [...localData, ...fetchedData];

        if (this.selectedTab === TableStringEnum.FUEL_TRANSACTION)
            this.fuelService.updateStoreFuelTransactionsList = response;
        else if (this.selectedTab === TableStringEnum.FUEL_STOP)
            this.fuelService.updateStoreFuelStopList = response;
    }

    private manageSubscriptions(): void {
        combineLatest([
            this.fuelQuery.fuelTransactions$,
            this.fuelQuery.fuelStops$,
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe((responses) => {
                const response =
                    this.selectedTab === TableStringEnum.FUEL_TRANSACTION
                        ? responses[0]
                        : responses[1];

                this.composeFuelData(response);
                this.sendFuelData();
            });

        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .pipe(
                switchMap((currentFilter) => {
                    if (
                        currentFilter?.filterName === TableStringEnum.FUEL_ARRAY
                    )
                        this.fuelData.integratedFuelTransactionsFilterActive =
                            currentFilter?.filterName ===
                                TableStringEnum.FUEL_ARRAY &&
                            currentFilter?.selectedFilter;

                    if (
                        currentFilter?.filterName ===
                        TableStringEnum.FUEL_INCOMPLETE_ARRAY
                    )
                        this.fuelData.incompleteFuelTransactionsFilterActive =
                            currentFilter?.filterName ===
                                this.tableStringEnum.FUEL_INCOMPLETE_ARRAY &&
                            currentFilter?.selectedFilter;

                    if (
                        currentFilter?.filterName ===
                        TableStringEnum.CLOSED_ARRAY
                    )
                        this.fuelData.fuelStopClosedFilterActive =
                            currentFilter?.filterName ===
                                TableStringEnum.CLOSED_ARRAY &&
                            currentFilter?.selectedFilter;

                    this.fuelData.pageIndex = 1;

                    if (
                        !!currentFilter &&
                        (currentFilter?.filterName ===
                            TableStringEnum.FUEL_ARRAY ||
                            currentFilter?.filterName ===
                                TableStringEnum.FUEL_INCOMPLETE_ARRAY ||
                            currentFilter?.filterType ===
                                TableStringEnum.LOCATION_FILTER)
                    )
                        return this.fuelService.getFuelTransactionsList(
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            currentFilter.queryParams?.longValue,
                            currentFilter.queryParams?.latValue,
                            currentFilter.queryParams?.rangeValue,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            this.fuelData
                                ?.integratedFuelTransactionsFilterActive,
                            this.fuelData
                                ?.incompleteFuelTransactionsFilterActive,
                            this.fuelData.pageIndex,
                            FuelTableConstants.TABLE_PAGE_SIZE
                        );
                    else if (
                        (!!currentFilter &&
                            currentFilter?.filterName ===
                                TableStringEnum.CLOSED_ARRAY) ||
                        currentFilter?.filterType ===
                            TableStringEnum.LOCATION_FILTER
                    )
                        return this.fuelService.getFuelStopsList(
                            null,
                            null,
                            null,
                            null,
                            null,
                            currentFilter.queryParams?.longValue,
                            currentFilter.queryParams?.latValue,
                            currentFilter.queryParams?.rangeValue,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            this.fuelData?.fuelStopClosedFilterActive,
                            this.fuelData.pageIndex,
                            FuelTableConstants.TABLE_PAGE_SIZE
                        );
                    else return of();
                })
            )
            .subscribe((response) => {
                this.updateStoreData(response, true);
            });
    }

    private setActiveTab(): void {
        const tableView = JSON.parse(
            localStorage.getItem(TableStringEnum.FUEL_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        } else {
            this.selectedTab = TableStringEnum.FUEL_TRANSACTION;
        }
    }

    public updateCardView(): void {
        switch (this.selectedTab) {
            case TableStringEnum.FUEL_TRANSACTION:
                this.displayRows$ = this.store.pipe(
                    select(selectActiveTabCards)
                );
                break;

            case TableStringEnum.FUEL_STOP:
                this.displayRows$ = this.store.pipe(
                    select(selectInactiveTabCards)
                );
                break;
            default:
                break;
        }
        this.fuelCardsModalService.updateTab(this.selectedTab);
    }

    public handleShowMoreAction(): void {
        this.fetchApiDataPaginated(true);
    }

    public updateToolbarDropdownMenuContent(): void {}

    private openCreateModalBySelectedTab(): void {
        if (this.selectedTab === TableStringEnum.FUEL_TRANSACTION)
            this.modalService.openModal(FuelPurchaseModalComponent, {
                size: TableStringEnum.SMALL,
            });
        else if (this.selectedTab === TableStringEnum.FUEL_STOP)
            this.modalService.openModal(FuelStopModalComponent, {
                size: TableStringEnum.SMALL,
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();
    }
}
