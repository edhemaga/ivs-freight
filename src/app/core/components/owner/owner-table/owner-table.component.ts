import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
// Modules

// Components
import { OwnerModalComponent } from '../../modals/owner-modal/owner-modal.component';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';
import { TruckModalComponent } from '../../modals/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '../../modals/trailer-modal/trailer-modal.component';

// Models
import { GetOwnerListResponse, OwnerResponse } from 'appcoretruckassist';
import {
    tableSearch,
    closeAnimationAction,
} from '../../../utils/methods.globals';
import { getOwnerColumnDefinition } from '../../../../../assets/utils/settings/owner-columns';
import {
    CardDetails,
    DropdownItem,
    GridColumn,
    ToolbarActions,
} from '../../shared/model/card-table-data.model';
import { DataForCardsAndTables } from '../../shared/model/table-components/all-tables.modal';
import {
    MapOwnerData,
    OwnerBackFilterFilter,
    OwnerBodyResponse,
} from '../owner.modal';
import { CardRows } from '../../shared/model/card-data.model';

// Services
import { ModalService } from '../../shared/ta-modal/modal.service';
import { OwnerTService } from '../state/owner.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';

// Store
import { OwnerActiveQuery } from '../state/owner-active-state/owner-active.query';
import {
    OwnerActiveState,
    OwnerActiveStore,
} from '../state/owner-active-state/owner-active.store';
import { OwnerInactiveQuery } from '../state/owner-inactive-state/owner-inactive.query';
import {
    OwnerInactiveState,
    OwnerInactiveStore,
} from '../state/owner-inactive-state/owner-inactive.store';

//Enum
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';
import { ComponentsTableEnum } from 'src/app/core/model/enums';

// Pipes
import { formatPhonePipe } from '../../../pipes/formatPhone.pipe';

//Constants
import { TableDropdownComponentConstants } from 'src/app/core/utils/constants/table-components.constants';
import { DisplayOwnerConfiguration } from '../owner-card-data';

//helpers
import { getDropdownOwnerContent } from 'src/app/core/helpers/dropdown-content';

@Component({
    selector: 'app-owner-table',
    templateUrl: './owner-table.component.html',
    styleUrls: ['./owner-table.component.scss'],
    providers: [formatPhonePipe],
})
export class OwnerTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public tableOptions: any = {};
    public tableData: any[] = [];
    private viewData: any[] = [];
    public columns: GridColumn[] = [];
    public selectedTab: string = ConstantStringTableComponentsEnum.ACTIVE;
    public activeViewMode: string = ConstantStringTableComponentsEnum.LIST;
    private resizeObserver: ResizeObserver;
    private ownerActive: OwnerActiveState[] = [];
    private ownerInactive: OwnerInactiveState[] = [];
    private inactiveTabClicked: boolean = false;
    private backFilterQuery =
        TableDropdownComponentConstants.OWNER_BACKFILTER_QUERY;

    //Data to display from model Broker
    public displayRowsFront: CardRows[] =
        DisplayOwnerConfiguration.displayRowsFrontActive;
    public displayRowsBack: CardRows[] =
        DisplayOwnerConfiguration.displayRowsBackActive;

    //Data to display from model Shipper
    public displayRowsFrontInactive: CardRows[] =
        DisplayOwnerConfiguration.displayRowsFrontInactive;
    public displayRowsBackInactive: CardRows[] =
        DisplayOwnerConfiguration.displayRowsBackInactive;
    public cardTitle: string = DisplayOwnerConfiguration.cardTitle;
    public page: string = DisplayOwnerConfiguration.page;
    public rows: number = DisplayOwnerConfiguration.rows;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];
    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private ownerActiveQuery: OwnerActiveQuery,
        private ownerInactiveQuery: OwnerInactiveQuery,
        private ownerService: OwnerTService,
        private phonePipe: formatPhonePipe,
        private ownerInactiveStore: OwnerInactiveStore,
        private confirmationService: ConfirmationService,
        private sharedService: SharedService,
        private ownerActiveStore: OwnerActiveStore
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
                    case ConstantStringTableComponentsEnum.DELETE:
                        this.deleteOwnerById(res.id ?? res.array[0].id);
                        break;

                    case ConstantStringTableComponentsEnum.ACTIVATE:
                        if (res.id) this.changeOwnerStatus(res.id);
                        else this.changeOwnerStatusList(res.array);
                        break;

                    case ConstantStringTableComponentsEnum.DEACTIVATE:
                        if (res.id) this.changeOwnerStatus(res.id);
                        else this.changeOwnerStatusList(res.array);
                        break;
                    case ConstantStringTableComponentsEnum.MULTIPLE_DELETE:
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
                        owner.actionAnimation =
                            ConstantStringTableComponentsEnum.DELETE;

                    return owner;
                });

                this.sendOwnerData();

                const interval = setInterval(() => {
                    this.viewData = closeAnimationAction(true, this.viewData);

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
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
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
                            this.ownerBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.STORE
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
                        this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                            ? 1
                            : 0;
                    this.backFilterQuery.pageIndex = 1;
                    // TruckTypeFilter
                    if (
                        res?.filterType ===
                            ConstantStringTableComponentsEnum.TRUCK_TYPE_FILTER ||
                        res?.type ===
                            ConstantStringTableComponentsEnum.TRUCK_TYPE_FILTER
                    ) {
                        this.backFilterQuery.truckTypeIds =
                            res?.action ===
                            ConstantStringTableComponentsEnum.SET
                                ? res?.queryParams
                                : undefined;
                    }
                    // TrailerTypeFilter
                    else if (
                        res?.filterType ===
                            ConstantStringTableComponentsEnum.TRAILER_TYPE_FILTER ||
                        res?.type ===
                            ConstantStringTableComponentsEnum.TRAILER_TYPE_FILTER
                    ) {
                        this.backFilterQuery.trailerTypeIds =
                            res?.action ===
                            ConstantStringTableComponentsEnum.SET
                                ? res?.queryParams
                                : undefined;
                    }
                    // LocationFilter
                    else if (
                        res?.filterType ===
                            ConstantStringTableComponentsEnum.LOCATION_FILTER ||
                        res?.type ===
                            ConstantStringTableComponentsEnum.LOCATION_FILTER
                    ) {
                        this.backFilterQuery.lat =
                            res?.action ===
                            ConstantStringTableComponentsEnum.SET
                                ? res.queryParams.latValue
                                : undefined;
                        this.backFilterQuery.long =
                            res?.action ===
                            ConstantStringTableComponentsEnum.SET
                                ? res?.queryParams.longValue
                                : undefined;
                        this.backFilterQuery.distance =
                            res?.action ===
                            ConstantStringTableComponentsEnum.SET
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
                        { size: ConstantStringTableComponentsEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: ConstantStringTableComponentsEnum.OWNER_3,
                            type:
                                mappedRes?.length > 1
                                    ? ConstantStringTableComponentsEnum.MULTIPLE_DELETE
                                    : ConstantStringTableComponentsEnum.DELETE,
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
                                ConstantStringTableComponentsEnum.DELETE_MULTIPLE;
                    });

                    return fuel;
                });

                this.updateDataCount();

                const interval = setInterval(() => {
                    this.viewData = closeAnimationAction(true, this.viewData);
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

                if (res?.animation === ConstantStringTableComponentsEnum.ADD) {
                    if (
                        this.selectedTab ===
                        ConstantStringTableComponentsEnum.INACTIVE
                    ) {
                        this.viewData.push(this.mapOwnerData(res.data));

                        this.viewData = this.viewData.map((owner) => {
                            if (owner.id === res.id) {
                                owner.actionAnimation =
                                    ConstantStringTableComponentsEnum.ADD;
                            }

                            return owner;
                        });

                        const inetval = setInterval(() => {
                            this.viewData = closeAnimationAction(
                                false,
                                this.viewData
                            );

                            clearInterval(inetval);
                        }, 2300);
                    }

                    this.updateDataCount();
                }

                // Update Owner
                else if (
                    res?.animation ===
                        ConstantStringTableComponentsEnum.UPDATE &&
                    this.selectedTab === res.tab
                ) {
                    const updatedOwner = this.mapOwnerData(res.data);

                    this.viewData = this.viewData.map((owner) => {
                        if (owner.id === res.id) {
                            owner = updatedOwner;
                            owner.actionAnimation =
                                ConstantStringTableComponentsEnum.UPDATE;
                        }

                        return owner;
                    });

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);
                }

                // Delete Owner
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.DELETE
                ) {
                    if (this.selectedTab === res.tab) {
                        let ownerIndex: number;

                        this.viewData = this.viewData.map(
                            (owner: any, index: number) => {
                                if (owner.id === res.id) {
                                    owner.actionAnimation =
                                        ConstantStringTableComponentsEnum.DELETE;
                                    ownerIndex = index;
                                }

                                return owner;
                            }
                        );

                        const inetval = setInterval(() => {
                            this.viewData = closeAnimationAction(
                                false,
                                this.viewData
                            );

                            this.viewData.splice(ownerIndex, 1);
                            clearInterval(inetval);
                        }, 900);
                    }

                    this.updateDataCount();
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

    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showLocationFilter: true,
                hideActivationButton: true,
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

    private sendOwnerData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.OWNER_TABLE_VIEW
            )
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const ownerCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.OWNER_TABLE_COUNTE
            )
        );

        const ownerActiveData =
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.ACTIVE)
                : [];

        const ownerInactiveData =
            this.selectedTab === ConstantStringTableComponentsEnum.INACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: ConstantStringTableComponentsEnum.ACTIVE_2,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: ownerCount.active,
                data: ownerActiveData,
                extended: false,
                gridNameTitle: ConstantStringTableComponentsEnum.OWNER,
                stateName: ConstantStringTableComponentsEnum.OWNERS,
                tableConfiguration: ConstantStringTableComponentsEnum.OWNER_2,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.OWNER_2
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.INACTIVE_2,
                field: ConstantStringTableComponentsEnum.INACTIVE,
                length: ownerCount.inactive,
                data: ownerInactiveData,
                extended: false,
                gridNameTitle: ConstantStringTableComponentsEnum.OWNER,
                stateName: ConstantStringTableComponentsEnum.OWNERS,
                tableConfiguration: ConstantStringTableComponentsEnum.OWNER_2,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.OWNER_2
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setOwnerData(td);
    }

    private updateDataCount(): void {
        const ownerCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.OWNER_TABLE_COUNTE
            )
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

    private setOwnerData(td: DataForCardsAndTables) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapOwnerData(data);
            });

            // Set data for cards based on tab active
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? ((this.sendDataToCardsFront = this.displayRowsFront),
                  (this.sendDataToCardsBack = this.displayRowsBack))
                : ((this.sendDataToCardsFront = this.displayRowsFrontInactive),
                  (this.sendDataToCardsBack = this.displayRowsBackInactive));
        } else {
            this.viewData = [];
        }
    }

    private mapOwnerData(data): MapOwnerData {
        return {
            ...data,
            isSelected: false,
            textType: data?.ownerType?.name
                ? data.ownerType.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textPhone: data?.phone
                ? this.phonePipe.transform(data.phone)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textAddress: data?.address
                ? data.address
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textBankName: data?.bankName
                ? data.bankName
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            fileCount: data?.fileCount,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownOwnerContent(),
            },
        };
    }

    private getDropdownOwnerContent(): DropdownItem[] {
        return getDropdownOwnerContent(this.selectedTab);
    }

    private getTabData(dataType: string) {
        if (dataType === ConstantStringTableComponentsEnum.ACTIVE) {
            this.ownerActive = this.ownerActiveQuery.getAll();

            return this.ownerActive?.length ? this.ownerActive : [];
        } else if (dataType === ConstantStringTableComponentsEnum.INACTIVE) {
            this.inactiveTabClicked = true;

            this.ownerInactive = this.ownerInactiveQuery.getAll();

            return this.ownerInactive?.length ? this.ownerInactive : [];
        }
    }

    // Owner Back Filter
    private ownerBackFilter(
        filter: OwnerBackFilterFilter,
        isShowMore?: boolean
    ): void {
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

    public onToolBarAction(event: ToolbarActions): void {
        if (event.action === ConstantStringTableComponentsEnum.OPEN_MODAL) {
            this.modalService.openModal(OwnerModalComponent, {
                size: ConstantStringTableComponentsEnum.SMALL,
            });
        } else if (
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
        } else if (
            event.action === ConstantStringTableComponentsEnum.VIEW_MODE
        ) {
            this.activeViewMode = event.mode;
        } else if (
            event.action === ConstantStringTableComponentsEnum.ACTIVATE_ITEM
        ) {
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
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    data: null,
                    array: mappedEvent,
                    template: ConstantStringTableComponentsEnum.OWNER_3,
                    type: status
                        ? ConstantStringTableComponentsEnum.DEACTIVATE
                        : ConstantStringTableComponentsEnum.ACTIVATE,
                    svg: true,
                }
            );
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
                this.backFilterQuery.pageIndex = 1;
                this.backFilterQuery.sort = event.direction;

                this.ownerBackFilter(this.backFilterQuery);
            } else {
                this.sendOwnerData();
            }
        }
    }

    public onTableBodyActions(event: OwnerBodyResponse): void {
        if (event.type === ConstantStringTableComponentsEnum.SHOW_MORE) {
            this.backFilterQuery.active =
                this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                    ? 1
                    : 0;
            this.backFilterQuery.pageIndex++;

            this.ownerBackFilter(this.backFilterQuery, true);
        } else if (
            event.type === ConstantStringTableComponentsEnum.ACTIVATE_ITEM
        ) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...event,
                    template: ConstantStringTableComponentsEnum.OWNER_3,
                    type: event.data.isSelected
                        ? ConstantStringTableComponentsEnum.DEACTIVATE
                        : ConstantStringTableComponentsEnum.ACTIVATE,
                    svg: true,
                }
            );
        } else if (event.type === ConstantStringTableComponentsEnum.EDIT) {
            this.modalService.openModal(
                OwnerModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...event,
                    type: ConstantStringTableComponentsEnum.EDIT,
                    selectedTab: this.selectedTab,
                }
            );
        } else if (
            event.type === ConstantStringTableComponentsEnum.DELETE_ITEM
        ) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...event,
                    template: ConstantStringTableComponentsEnum.OWNER_3,
                    type: ConstantStringTableComponentsEnum.DELETE,
                    svg: true,
                }
            );
        } else if (event.type === ConstantStringTableComponentsEnum.ADD_TRUCK) {
            this.modalService.setProjectionModal({
                action: ConstantStringTableComponentsEnum.OPEN,
                payload: {
                    key: null,
                    value: null,
                },
                component: TruckModalComponent,
                size: ConstantStringTableComponentsEnum.SMALL,
                closing: ConstantStringTableComponentsEnum.FASTEST,
            });
        } else if (
            event.type === ConstantStringTableComponentsEnum.ADD_TRAILER
        ) {
            this.modalService.setProjectionModal({
                action: ConstantStringTableComponentsEnum.OPEN,
                payload: {
                    key: null,
                    value: null,
                },
                component: TrailerModalComponent,
                size: ConstantStringTableComponentsEnum.SMALL,
                closing: ConstantStringTableComponentsEnum.FASTEST,
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
        //     document.querySelector(ConstantStringTableComponentsEnum.TABLE_CONTAINER)
        // );
        this.resizeObserver.disconnect();
    }
}
