import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Components
import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';

// Models
import { GetOwnerListResponse } from 'appcoretruckassist';
import { getOwnerColumnDefinition } from '@shared/utils/settings/table-settings/owner-columns';
import {
    CardDetails,
    DropdownItem,
} from '@shared/models/card-models/card-table-data.model';
import { GridColumn } from '@shared/models/table-models/grid-column.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { OwnerTableData } from '@pages/owner/models/owner-table-data.model';
import { OwnerFilter } from '@pages/owner/models/owner-filter.model';
import { OwnerData } from '@pages/owner/models/owner-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';

// Services
import { ModalService } from '@shared/services/modal.service';
import { OwnerService } from '@pages/owner/services/owner.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { OwnerCardsModalService } from '@pages/owner/pages/owner-card-modal/services/owner-cards-modal.service';
import { CaSearchMultipleStatesService } from 'ca-components';

// Store
import { OwnerActiveQuery } from '@pages/owner/state/owner-active-state/owner-active.query';
import { OwnerActiveState } from '@pages/owner/state/owner-active-state/owner-active.store';
import { OwnerInactiveQuery } from '@pages/owner/state/owner-inactive-state/owner-inactive.query';
import {
    OwnerInactiveState,
    OwnerInactiveStore,
} from '@pages/owner/state/owner-inactive-state/owner-inactive.store';
import { OwnerCardModalQuery } from '@pages/owner/pages/owner-card-modal/state/owner-card-modal.query';

//Enum
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Pipes
import { FormatPhonePipe } from '@shared/pipes/format-phone.pipe';

//Constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';
import { OwnerConfiguration } from '@pages/owner/pages/owner-table/utils/constants/owner-configuration.constants';

// helpers
import { DropdownContentHelper } from '@shared/utils/helpers/dropdown-content.helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

@Component({
    selector: 'app-owner-table',
    templateUrl: './owner-table.component.html',
    styleUrls: ['./owner-table.component.scss'],
    providers: [FormatPhonePipe],
})
export class OwnerTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public tableOptions: any = {};
    public tableData: any[] = [];
    private viewData: any[] = [];
    public columns: GridColumn[] = [];
    public selectedTab: string = TableStringEnum.ACTIVE;
    public activeViewMode: string = TableStringEnum.LIST;
    private resizeObserver: ResizeObserver;
    private ownerActive: OwnerActiveState[] = [];
    private ownerInactive: OwnerInactiveState[] = [];
    private inactiveTabClicked: boolean = false;
    private backFilterQuery =
        TableDropdownComponentConstants.OWNER_BACKFILTER_QUERY;

    //Data to display from model Broker
    public displayRowsFront: CardRows[] =
        OwnerConfiguration.displayRowsFrontActive;
    public displayRowsBack: CardRows[] =
        OwnerConfiguration.displayRowsBackActive;

    //Data to display from model Shipper
    public displayRowsFrontInactive: CardRows[] =
        OwnerConfiguration.displayRowsFrontInactive;
    public displayRowsBackInactive: CardRows[] =
        OwnerConfiguration.displayRowsBackInactive;
    public cardTitle: string = OwnerConfiguration.cardTitle;
    public page: string = OwnerConfiguration.page;
    public rows: number = OwnerConfiguration.rows;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];
    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private ownerActiveQuery: OwnerActiveQuery,
        private ownerInactiveQuery: OwnerInactiveQuery,
        private ownerService: OwnerService,
        private phonePipe: FormatPhonePipe,
        private ownerInactiveStore: OwnerInactiveStore,
        private confirmationService: ConfirmationService,
        private ownerCardsModalService: OwnerCardsModalService,
        private ownerCardModalQuery: OwnerCardModalQuery,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService
    ) {}

    // ---------------------------- ngOnInit ------------------------------
    ngOnInit(): void {
        this.sendOwnerData();

        this.resetColumns();

        this.resize();

        this.toggleColumns();

        this.search();

        this.onSetTolbarFilter();

        this.deleteSelectedRows();

        this.ownerActions();

        this.confirmationSubscribe();
    }

    // ---------------------------- ngAfterViewInit ------------------------------
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    // Reset Columns
    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendOwnerData();
                }
            });
    }

    // Resize
    private resize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
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

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                switch (res.type) {
                    case TableStringEnum.DELETE:
                        this.deleteOwnerById(res.id ?? res.array[0].id);
                        break;

                    case TableStringEnum.ACTIVATE:
                        if (res.id) this.changeOwnerStatus(res.id);
                        else this.changeOwnerStatusList(res.array);
                        break;

                    case TableStringEnum.DEACTIVATE:
                        if (res.id) this.changeOwnerStatus(res.id);
                        else this.changeOwnerStatusList(res.array);
                        break;
                    case TableStringEnum.MULTIPLE_DELETE:
                        this.deleteOwnerList(res.array);
                        break;
                    default:
                        break;
                }
            });
    }
    private changeOwnerStatus(data): void {
        this.ownerService
            .updateOwner(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
    private changeOwnerStatusList(data): void {
        this.ownerService
            .updateOwner(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
    private deleteOwnerById(id: number): void {
        this.ownerService
            .deleteOwnerById(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((owner) => {
                    if (owner.id === id)
                        owner.actionAnimation = TableStringEnum.DELETE;

                    return owner;
                });

                this.sendOwnerData();

                const interval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

                    clearInterval(interval);
                }, 900);
            });
    }

    // Toggle Columns
    private toggleColumns(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
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

    // Search
    private search(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
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
                            this.ownerBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action === TableStringEnum.STORE
                        ) {
                            this.sendOwnerData();
                        }
                    }
                }
            });
    }

    // On Set Tollbar Filter
    private onSetTolbarFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.backFilterQuery.active =
                        this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
                    this.backFilterQuery.pageIndex = 1;
                    // TruckTypeFilter
                    if (
                        res?.filterType === TableStringEnum.TRUCK_TYPE_FILTER ||
                        res?.type === TableStringEnum.TRUCK_TYPE_FILTER
                    ) {
                        this.backFilterQuery.truckTypeIds =
                            res?.action === TableStringEnum.SET
                                ? res?.queryParams
                                : undefined;
                    }
                    // TrailerTypeFilter
                    else if (
                        res?.filterType ===
                            TableStringEnum.TRAILER_TYPE_FILTER ||
                        res?.type === TableStringEnum.TRAILER_TYPE_FILTER
                    ) {
                        this.backFilterQuery.trailerTypeIds =
                            res?.action === TableStringEnum.SET
                                ? res?.queryParams
                                : undefined;
                    }
                    // LocationFilter
                    else if (
                        res?.filterType === TableStringEnum.LOCATION_FILTER ||
                        res?.type === TableStringEnum.LOCATION_FILTER
                    ) {
                        this.backFilterQuery.lat =
                            res?.action === TableStringEnum.SET
                                ? res.queryParams.latValue
                                : undefined;
                        this.backFilterQuery.long =
                            res?.action === TableStringEnum.SET
                                ? res?.queryParams.longValue
                                : undefined;
                        this.backFilterQuery.distance =
                            res?.action === TableStringEnum.SET
                                ? res?.queryParams.rangeValue
                                : undefined;
                    }
                    // Set Filter
                    if (
                        this.backFilterQuery.truckTypeIds ||
                        this.backFilterQuery.trailerTypeIds ||
                        (this.backFilterQuery.lat &&
                            this.backFilterQuery.long &&
                            this.backFilterQuery.distance)
                    ) {
                        this.ownerBackFilter(this.backFilterQuery);
                    } else {
                        this.sendOwnerData();
                    }
                }
            });
    }

    // Delete Selected Rows
    private deleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.length) {
                    const mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                            },
                        };
                    });
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.OWNER_3,
                            type:
                                mappedRes?.length > 1
                                    ? TableStringEnum.MULTIPLE_DELETE
                                    : TableStringEnum.DELETE,
                            svg: true,
                        }
                    );
                }
            });
    }

    private deleteOwnerList(ids: number[]): void {
        this.ownerService
            .deleteOwnerList(ids, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((fuel) => {
                    ids.map((id) => {
                        if (fuel.id === id)
                            fuel.actionAnimation =
                                TableStringEnum.DELETE_MULTIPLE;
                    });

                    return fuel;
                });

                this.updateDataCount();

                const interval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );
                    this.tableData[0].data = this.viewData;

                    clearInterval(interval);
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    // Owner Actions
    private ownerActions(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                // Add Owner

                if (res?.animation === TableStringEnum.ADD) {
                    if (this.selectedTab === TableStringEnum.INACTIVE) {
                        this.viewData.push(this.mapOwnerData(res.data));

                        this.viewData = this.viewData.map((owner) => {
                            if (owner.id === res.id) {
                                owner.actionAnimation = TableStringEnum.ADD;
                            }

                            return owner;
                        });

                        const interval = setInterval(() => {
                            this.viewData =
                                MethodsGlobalHelper.closeAnimationAction(
                                    false,
                                    this.viewData
                                );

                            clearInterval(interval);
                        }, 2300);
                    }

                    this.updateDataCount();
                }

                // Update Owner
                else if (
                    res?.animation === TableStringEnum.UPDATE &&
                    this.selectedTab === res.tab
                ) {
                    const updatedOwner = this.mapOwnerData(res.data);

                    this.viewData = this.viewData.map((owner) => {
                        if (owner.id === res.id) {
                            owner = updatedOwner;
                            owner.actionAnimation = TableStringEnum.UPDATE;
                        }

                        return owner;
                    });

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(interval);
                    }, 1000);
                }

                // Delete Owner
                else if (res?.animation === TableStringEnum.DELETE) {
                    if (this.selectedTab === res.tab) {
                        let ownerIndex: number;

                        this.viewData = this.viewData.map(
                            (owner: any, index: number) => {
                                if (owner.id === res.id) {
                                    owner.actionAnimation =
                                        TableStringEnum.DELETE;
                                    ownerIndex = index;
                                }

                                return owner;
                            }
                        );

                        const interval = setInterval(() => {
                            this.viewData =
                                MethodsGlobalHelper.closeAnimationAction(
                                    false,
                                    this.viewData
                                );

                            this.viewData.splice(ownerIndex, 1);
                            clearInterval(interval);
                        }, 900);
                    }

                    this.updateDataCount();
                }
            });
    }

    public updateCardView(): void {
        switch (this.selectedTab) {
            case TableStringEnum.ACTIVE:
                this.activeTabCardsConfig();
                break;

            case TableStringEnum.INACTIVE:
                this.inactiveTabCardsConfig();
                break;

            default:
                break;
        }
        this.ownerCardsModalService.updateTab(this.selectedTab);
    }

    private activeTabCardsConfig(): void {
        this.ownerCardModalQuery.active$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const filteredCardRowsFront =
                        res.front_side.filter(Boolean);

                    const filteredCardRowsBack = res.back_side.filter(Boolean);

                    this.cardTitle = TableStringEnum.NAME;

                    this.displayRowsFront = filteredCardRowsFront;

                    this.displayRowsBack = filteredCardRowsBack;
                }
            });
    }

    private inactiveTabCardsConfig(): void {
        this.ownerCardModalQuery.inactive$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const filteredCardRowsFront =
                        res.front_side.filter(Boolean);

                    const filteredCardRowsBack = res.back_side.filter(Boolean);

                    this.cardTitle = TableStringEnum.NAME;

                    this.displayRowsFront = filteredCardRowsFront;

                    this.displayRowsBack = filteredCardRowsBack;
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

    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showLocationFilter: true,
                hideActivationButton: true,
                hidePrintButton: true,
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

    private sendOwnerData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(TableStringEnum.OWNER_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const ownerCount = JSON.parse(
            localStorage.getItem(TableStringEnum.OWNER_TABLE_COUNTE)
        );

        const ownerActiveData =
            this.selectedTab === TableStringEnum.ACTIVE
                ? this.getTabData(TableStringEnum.ACTIVE)
                : [];

        const ownerInactiveData =
            this.selectedTab === TableStringEnum.INACTIVE
                ? this.getTabData(TableStringEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: TableStringEnum.ACTIVE_2,
                field: TableStringEnum.ACTIVE,
                length: ownerCount.active,
                data: ownerActiveData,
                extended: false,
                gridNameTitle: TableStringEnum.OWNER,
                stateName: TableStringEnum.OWNERS,
                tableConfiguration: TableStringEnum.OWNER_2,
                isActive: this.selectedTab === TableStringEnum.ACTIVE,
                gridColumns: this.getGridColumns(TableStringEnum.OWNER_2),
            },
            {
                title: TableStringEnum.INACTIVE_2,
                field: TableStringEnum.INACTIVE,
                length: ownerCount.inactive,
                data: ownerInactiveData,
                extended: false,
                gridNameTitle: TableStringEnum.OWNER,
                stateName: TableStringEnum.OWNERS,
                tableConfiguration: TableStringEnum.OWNER_2,
                isActive: this.selectedTab === TableStringEnum.INACTIVE,
                gridColumns: this.getGridColumns(TableStringEnum.OWNER_2),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setOwnerData(td);
        this.updateCardView();
    }

    private updateDataCount(): void {
        const ownerCount = JSON.parse(
            localStorage.getItem(TableStringEnum.OWNER_TABLE_COUNTE)
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = ownerCount.active;
        updatedTableData[1].length = ownerCount.inactive;

        this.tableData = [...updatedTableData];
    }

    private getGridColumns(configType: string): void {
        let tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getOwnerColumnDefinition();
    }

    private setOwnerData(td: CardTableData) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapOwnerData(data);
            });

            // Set data for cards based on tab active
            this.selectedTab === TableStringEnum.ACTIVE
                ? ((this.sendDataToCardsFront = this.displayRowsFront),
                  (this.sendDataToCardsBack = this.displayRowsBack))
                : ((this.sendDataToCardsFront = this.displayRowsFrontInactive),
                  (this.sendDataToCardsBack = this.displayRowsBackInactive));
        } else {
            this.viewData = [];
        }
    }

    private mapOwnerData(data): OwnerTableData {
        return {
            ...data,
            isSelected: false,
            textType: data?.ownerType?.name
                ? data.ownerType.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textPhone: data?.phone
                ? this.phonePipe.transform(data.phone)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textAddress: data?.address
                ? data.address
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textBankName: data?.bankName
                ? data.bankName
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            fileCount: data?.fileCount,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownOwnerContent(),
            },
        };
    }

    private getDropdownOwnerContent(): DropdownItem[] {
        return DropdownContentHelper.getDropdownOwnerContent(this.selectedTab);
    }

    private getTabData(dataType: string) {
        if (dataType === TableStringEnum.ACTIVE) {
            this.ownerActive = this.ownerActiveQuery.getAll();

            return this.ownerActive?.length ? this.ownerActive : [];
        } else if (dataType === TableStringEnum.INACTIVE) {
            this.inactiveTabClicked = true;

            this.ownerInactive = this.ownerInactiveQuery.getAll();

            return this.ownerInactive?.length ? this.ownerInactive : [];
        }
    }

    // Owner Back Filter
    private ownerBackFilter(filter: OwnerFilter, isShowMore?: boolean): void {
        this.ownerService
            .getOwner(
                filter.active,
                filter.companyOwnerId,
                filter.long,
                filter.lat,
                filter.distance,
                filter.truckTypeIds,
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
            .subscribe((owners: GetOwnerListResponse) => {
                if (!isShowMore) {
                    this.viewData = owners.pagination.data;

                    this.viewData = this.viewData.map((data) => {
                        return this.mapOwnerData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    owners.pagination.data.map((data) => {
                        newData.push(this.mapOwnerData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    public onToolBarAction(event: TableToolbarActions): void {
        if (event.action === TableStringEnum.OPEN_MODAL) {
            this.modalService.openModal(OwnerModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else if (event.action === TableStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;
            this.backFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;

            if (
                this.selectedTab === TableStringEnum.INACTIVE &&
                !this.inactiveTabClicked
            ) {
                this.ownerService
                    .getOwner(
                        0,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        1,
                        25
                    )
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((ownerPagination: any) => {
                        this.ownerInactiveStore.set(
                            ownerPagination.pagination.data
                        );

                        this.sendOwnerData();
                    });
            } else {
                this.sendOwnerData();
            }
        } else if (event.action === TableStringEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;
        } else if (event.action === TableStringEnum.ACTIVATE_ITEM) {
            let status = false;
            const mappedEvent = [];
            this.viewData.map((data) => {
                event.tabData.data.map((element) => {
                    if (data.id === element) {
                        status = data.status;
                        mappedEvent.push({
                            ...data,
                            data: {
                                ...data,
                            },
                        });
                    }
                });
            });
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    data: null,
                    array: mappedEvent,
                    template: TableStringEnum.OWNER_3,
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
                this.backFilterQuery.pageIndex = 1;
                this.backFilterQuery.sort = event.direction;

                this.ownerBackFilter(this.backFilterQuery);
            } else {
                this.sendOwnerData();
            }
        }
    }

    public onTableBodyActions(event: OwnerData): void {
        if (event.type === TableStringEnum.SHOW_MORE) {
            this.backFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
            this.backFilterQuery.pageIndex++;

            this.ownerBackFilter(this.backFilterQuery, true);
        } else if (event.type === TableStringEnum.ACTIVATE_ITEM) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    template: TableStringEnum.OWNER_3,
                    type: event.data.isSelected
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                    svg: true,
                }
            );
        } else if (event.type === TableStringEnum.EDIT) {
            this.modalService.openModal(
                OwnerModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    type: TableStringEnum.EDIT,
                    selectedTab: this.selectedTab,
                }
            );
        } else if (event.type === TableStringEnum.DELETE_ITEM) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    template: TableStringEnum.OWNER_3,
                    type: TableStringEnum.DELETE,
                    svg: true,
                }
            );
        } else if (event.type === TableStringEnum.ADD_TRUCK) {
            this.modalService.setProjectionModal({
                action: TableStringEnum.OPEN,
                payload: {
                    key: null,
                    value: null,
                },
                component: TruckModalComponent,
                size: TableStringEnum.SMALL,
                closing: TableStringEnum.FASTEST,
            });
        } else if (event.type === TableStringEnum.ADD_TRAILER) {
            this.modalService.setProjectionModal({
                action: TableStringEnum.OPEN,
                payload: {
                    key: null,
                    value: null,
                },
                component: TrailerModalComponent,
                size: TableStringEnum.SMALL,
                closing: TableStringEnum.FASTEST,
            });
        }
    }

    public saveValueNote(event: { value: string; id: number }): void {
        this.viewData.map((item: CardDetails) => {
            if (item.id === event.id) {
                item.note = event.value;
            }
        });

        const noteData = {
            value: event.value,
            id: event.id,
            selectedTab: this.selectedTab,
        };

        this.ownerService.updateNote(noteData);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        // this.resizeObserver.unobserve(
        //     document.querySelector(TableStringEnum.TABLE_CONTAINER)
        // );
        this.resizeObserver.disconnect();
    }
}
