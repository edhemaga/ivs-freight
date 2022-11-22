import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TruckModalComponent } from '../../modals/truck-modal/truck-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TruckTService } from '../state/truck.service';

import { TruckListResponse } from 'appcoretruckassist';
import { TruckActiveQuery } from '../state/truck-active-state/truck-active.query';
import { TruckInactiveQuery } from '../state/truck-inactive-state/truck-inactive.query';
import { TruckActiveState } from '../state/truck-active-state/truck-active.store';
import { TruckInactiveState } from '../state/truck-inactive-state/truck-inactive.store';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import {
    Confirmation,
    ConfirmationModalComponent,
} from '../../modals/confirmation-modal/confirmation-modal.component';
import { Subject, takeUntil } from 'rxjs';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import {
    closeAnimationAction,
    tableSearch,
} from '../../../utils/methods.globals';
import { getTruckColumnDefinition } from '../../../../../assets/utils/settings/truck-columns';

@Component({
    selector: 'app-truck-table',
    templateUrl: './truck-table.component.html',
    styleUrls: ['./truck-table.component.scss'],
    providers: [TaThousandSeparatorPipe],
})
export class TruckTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();
    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    selectedTab = 'active';
    activeViewMode: string = 'List';
    trucksActive: TruckActiveState[] = [];
    trucksInactive: TruckInactiveState[] = [];
    loadingPage: boolean = true;
    tableContainerWidth: number = 0;
    backFilterQuery = {
        active: 1,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };
    resizeObserver: ResizeObserver;

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private truckActiveQuery: TruckActiveQuery,
        private truckInactiveQuery: TruckInactiveQuery,
        private truckService: TruckTService,
        private thousandSeparator: TaThousandSeparatorPipe,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.sendTruckData();

        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case 'delete': {
                            this.deleteTruckById(res.id);
                            break;
                        }
                        case 'activate': {
                            this.changeTruckStatus(res.id);
                            break;
                        }
                        case 'deactivate': {
                            this.changeTruckStatus(res.id);
                            break;
                        }
                        case 'multiple delete': {
                            this.multipleDeleteTrucks(res.array);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });

        // Reset Columns
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response && !this.loadingPage) {
                    this.sendTruckData();
                }
            });

        // Resize
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((c) => {
                        if (
                            c.title ===
                            response.columns[response.event.index].title
                        ) {
                            c.width = response.event.width;
                        }

                        return c;
                    });
                }
            });

        // Toaggle Columns
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.column) {
                    this.columns = this.columns.map((c) => {
                        if (c.field === response.column.field) {
                            c.hidden = response.column.hidden;
                        }

                        return c;
                    });
                }
            });

        // Add Truck Or Update
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation === 'add') {
                    this.viewData.push(this.mapTruckData(res.data));

                    this.viewData = this.viewData.map((truck: any) => {
                        if (truck.id === res.id) {
                            truck.actionAnimation = 'add';
                        }

                        return truck;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 2300);
                } else if (
                    res.animation === 'add' &&
                    this.selectedTab === 'inactive'
                ) {
                    this.updateDataCount();
                } else if (res.animation === 'update') {
                    const updatedTruck = this.mapTruckData(res.data);

                    this.viewData = this.viewData.map((truck: any) => {
                        if (truck.id === res.id) {
                            truck = updatedTruck;
                            truck.actionAnimation = 'update';
                        }

                        return truck;
                    });

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);
                } else if (res.animation === 'update-status') {
                    let truckIndex: number;

                    this.viewData = this.viewData.map(
                        (truck: any, index: number) => {
                            if (truck.id === res.id) {
                                truck.actionAnimation =
                                    this.selectedTab === 'active'
                                        ? 'deactivate'
                                        : 'activate';
                                truckIndex = index;
                            }

                            return truck;
                        }
                    );

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        this.viewData.splice(truckIndex, 1);
                        clearInterval(inetval);
                    }, 900);
                } else if (res.animation === 'delete') {
                    let truckIndex: number;

                    this.viewData = this.viewData.map(
                        (truck: any, index: number) => {
                            if (truck.id === res.id) {
                                truck.actionAnimation = 'delete';
                                truckIndex = index;
                            }

                            return truck;
                        }
                    );

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        this.viewData.splice(truckIndex, 1);
                        clearInterval(inetval);
                    }, 900);
                }
            });

        // Delete Selected Rows
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any[]) => {
                if (response.length && !this.loadingPage) {
                    let mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                                number: item.tableData?.truckNumber,
                                avatar: `assets/svg/common/trucks/${item.tableData?.truckType?.logoName}`,
                            },
                        };
                    });
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: 'small' },
                        {
                            data: null,
                            array: mappedRes,
                            template: 'truck',
                            type: 'multiple delete',
                            svg: true,
                        }
                    );
                }
            });

        // Search
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res) {
                    this.backFilterQuery.active =
                        this.selectedTab === 'active' ? 1 : 0;
                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(res, this.backFilterQuery);

                    if (searchEvent) {
                        if (searchEvent.action === 'api') {
                            this.truckBackFilter(searchEvent.query, true);
                        } else if (searchEvent.action === 'store') {
                            this.sendTruckData();
                        }
                    }
                }
            });

        this.loadingPage = false;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableContainerWidth = entry.contentRect.width;
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showMoneyFilter: true,
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                ],
            },
            actions: [
                {
                    title: 'Edit Truck',
                    name: 'edit-truck',
                    class: 'regular-text',
                    contentType: 'edit',
                },
                {
                    title: 'Add Registration',
                    name: 'add-registration',
                    class: 'regular-text',
                    contentType: 'add',
                },
                {
                    title: 'Add Inspection',
                    name: 'add-inspection',
                    class: 'regular-text',
                    contentType: 'add',
                },
                {
                    title: 'Add Repair',
                    name: 'add-repair',
                    class: 'regular-text',
                    contentType: 'add',
                },
                {
                    title: 'Activate',
                    reverseTitle: 'Deactivate',
                    name: 'activate-item',
                    class: 'regular-text',
                    contentType: 'activate',
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'truck',
                    text: 'Are you sure you want to delete truck(s)?',
                    class: 'delete-text',
                    contentType: 'delete',
                },
            ],
        };
    }

    sendTruckData() {
        this.initTableOptions();

        const truckCount = JSON.parse(localStorage.getItem('truckTableCount'));

        const truckActiveData =
            this.selectedTab === 'active' ? this.getTabData('active') : [];

        const truckInactiveData =
            this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

        this.tableData = [
            {
                title: 'Active',
                field: 'active',
                length: truckCount.active,
                data: truckActiveData,
                gridNameTitle: 'Truck',
                stateName: 'trucks',
                tableConfiguration: 'TRUCK',
                isActive: this.selectedTab === 'active',
                gridColumns: this.getGridColumns('TRUCK'),
            },
            {
                title: 'Inactive',
                field: 'inactive',
                length: truckCount.inactive,
                data: truckInactiveData,
                gridNameTitle: 'Truck',
                stateName: 'trucks',
                tableConfiguration: 'TRUCK',
                isActive: this.selectedTab === 'inactive',
                gridColumns: this.getGridColumns('TRUCK'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setTruckData(td);
    }

    getGridColumns(configType: string): any[] {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getTruckColumnDefinition();
    }

    setTruckData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapTruckData(data);
            });
        } else {
            this.viewData = [];
        }
    }

    mapTruckData(data: any) {
        return {
            ...data,
            textCommission: data?.commission ? data?.commission + '%' : '',
            textGrossWeight: 'Nije povezano',
            textPurchasePrice: 'Nije povezano',
            textPurchaseDate: 'Nije povezano',
            textYear: data.year ? data.year : '',
            textMake: data?.truckMake?.name ? data.truckMake.name : '',
            textModel: data?.model ? data.model : '',
            color: data?.color?.code ? data.color.code : '',
            colorName: data?.color?.name ? data.color.name : '',
            truckTypeIcon: data.truckType.logoName,
            truckTypeClass: data.truckType.logoName.replace('.svg', ''),
            ownerName: data?.owner?.name ? data.owner.name : '',
            truckAxises: data?.axles ? data.axles : '',
            truckEmptyWeight: data?.emptyWeight
                ? this.thousandSeparator.transform(data.emptyWeight) + ' lbs.'
                : '',
            truckEngine: data?.truckEngineType?.name
                ? data.truckEngineType.name
                : '',
            truckTireSize: data?.tireSize?.name ? data.tireSize.name : '',
            truckMileage: data?.mileage
                ? this.thousandSeparator.transform(data.mileage) + ' mi'
                : '',
            truckIpasEzpass: data?.ipasEzpass ? data.ipasEzpass : '',
            truckLicensePlate: data?.licensePlate
                ? data.licensePlate
                : data?.registrations?.length
                ? data.registrations[0].licensePlate
                : '',
            truckInspectionProgres: {
                start: data?.fhwaInspection
                    ? data.fhwaInspection
                    : data?.inspections?.length
                    ? data.inspections[0].issueDate
                    : null,
                end: null,
            },
        };
    }

    updateDataCount() {
        const truckCount = JSON.parse(localStorage.getItem('truckTableCount'));

        this.tableData[0].length = truckCount.active;
        this.tableData[1].length = truckCount.inactive;
    }

    getTabData(dataType: string) {
        if (dataType === 'active') {
            this.trucksActive = this.truckActiveQuery.getAll();

            return this.trucksActive?.length ? this.trucksActive : [];
        } else if (dataType === 'inactive') {
            this.trucksInactive = this.truckInactiveQuery.getAll();

            return this.trucksInactive?.length ? this.trucksInactive : [];
        }
    }

    truckBackFilter(
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
        isSearch?: boolean,
        isShowMore?: boolean
    ) {
        this.truckService
            .getTruckList(
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
            .subscribe((trucks: TruckListResponse) => {
                if (!isShowMore) {
                    this.viewData = trucks.pagination.data;

                    this.viewData = this.viewData.map((data: any) => {
                        return this.mapTruckData(data);
                    });

                    if (isSearch) {
                        this.tableData[
                            this.selectedTab === 'active' ? 0 : 1
                        ].length = trucks.pagination.count;
                    }
                } else {
                    let newData = [...this.viewData];

                    trucks.pagination.data.map((data: any) => {
                        newData.push(this.mapTruckData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    onToolBarAction(event: any) {
        if (event.action === 'open-modal') {
            this.modalService.openModal(TruckModalComponent, { size: 'small' });
        } else if (event.action === 'tab-selected') {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;

            this.sendTruckData();
        } else if (event.action === 'view-mode') {
            this.activeViewMode = event.mode;
        }
    }

    onTableHeadActions(event: any) {
        if (event.action === 'sort') {
            if (event.direction) {
                this.backFilterQuery.active =
                    this.selectedTab === 'active' ? 1 : 0;
                this.backFilterQuery.pageIndex = 1;
                this.backFilterQuery.sort = event.direction;

                this.truckBackFilter(this.backFilterQuery);
            } else {
                this.sendTruckData();
            }
        }
    }

    onTableBodyActions(event: any) {
        const mappedEvent = {
            ...event,
            data: {
                ...event.data,
                number: event.data?.truckNumber,
                avatar: `assets/svg/common/trucks/${event.data?.truckType?.logoName}`,
            },
        };

        switch (event.type) {
            case 'show-more': {
                this.backFilterQuery.pageIndex++;
                this.truckBackFilter(this.backFilterQuery, false, true);
                break;
            }
            case 'edit-truck': {
                this.modalService.openModal(
                    TruckModalComponent,
                    { size: 'small' },
                    {
                        ...event,
                        type: 'edit',
                        disableButton: true,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case 'add-registration': {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: 'small' },
                    {
                        ...event,
                        modal: 'truck',
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case 'add-inspection': {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: 'small' },
                    {
                        ...event,
                        modal: 'truck',
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case 'activate-item': {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'truck',
                        type:
                            event.data.status === 1 ? 'deactivate' : 'activate',
                        svg: true,
                    }
                );
                break;
            }
            case 'delete-item': {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'truck',
                        type: 'delete',
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

    private changeTruckStatus(id: number) {
        this.truckService
            .changeTruckStatus(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({});
    }

    private deleteTruckById(id: number) {
        this.truckService
            .deleteTruckById(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((truck: any) => {
                        if (truck.id === id) {
                            truck.actionAnimation = 'delete';
                        }

                        return truck;
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
            });
    }

    private multipleDeleteTrucks(response: any[]) {
        this.truckService
            .deleteTruckList(response)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((truck: any) => {
                    response.map((id: any) => {
                        if (truck.id === id) {
                            truck.actionAnimation = 'delete-multiple';
                        }
                    });

                    return truck;
                });

                this.updateDataCount();
                const inetval = setInterval(() => {
                    this.viewData = closeAnimationAction(true, this.viewData);

                    clearInterval(inetval);
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.resizeObserver.unobserve(
            document.querySelector('.table-container')
        );
        this.resizeObserver.disconnect();
    }
}
