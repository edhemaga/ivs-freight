import { ConfirmationService } from './../../modals/confirmation-modal/confirmation.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { TrailerListResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TrailerModalComponent } from '../../modals/trailer-modal/trailer-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TrailerActiveQuery } from '../state/trailer-active-state/trailer-active.query';
import { TrailerActiveState } from '../state/trailer-active-state/trailer-active.store';
import { TrailerInactiveQuery } from '../state/trailer-inactive-state/trailer-inactive.query';
import { TrailerInactiveState } from '../state/trailer-inactive-state/trailer-inactive.store';
import { TrailerTService } from '../state/trailer.service';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import {
    closeAnimationAction,
    tableSearch,
} from '../../../utils/methods.globals';
import { getTrailerColumnDefinition } from '../../../../../assets/utils/settings/trailer-columns';
import {
    Confirmation,
    ConfirmationModalComponent,
} from '../../modals/confirmation-modal/confirmation-modal.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-trailer-table',
    templateUrl: './trailer-table.component.html',
    styleUrls: ['./trailer-table.component.scss'],
    providers: [TaThousandSeparatorPipe],
})
export class TrailerTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();

    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    selectedTab = 'active';
    activeViewMode: string = 'List';
    tableContainerWidth: number = 0;
    resizeObserver: ResizeObserver;
    public trailerActive: TrailerActiveState[] = [];
    public trailerInactive: TrailerInactiveState[] = [];
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

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private trailerActiveQuery: TrailerActiveQuery,
        private trailerInactiveQuery: TrailerInactiveQuery,
        private trailerService: TrailerTService,
        public datePipe: DatePipe,
        private thousandSeparator: TaThousandSeparatorPipe,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.sendTrailerData();

        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case 'delete': {
                            this.deleteTrailerById(res.id);
                            break;
                        }
                        case 'activate': {
                            this.changeTrailerStatus(res.id);
                            break;
                        }
                        case 'deactivate': {
                            this.changeTrailerStatus(res.id);
                            break;
                        }
                        case 'multiple delete': {
                            this.multipleDeleteTrailers(res.array);
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
                if (response) {
                    this.sendTrailerData();
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
                            console.log('Radi resize');
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

        // Trailer Actions
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // Add Trailer ACtive
                if (res.animation === 'add') {
                    this.viewData.push(this.mapTrailerData(res.data));

                    this.viewData = this.viewData.map((trailer: any) => {
                        if (trailer.id === res.id) {
                            trailer.actionAnimation = 'add';
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
                    res.animation === 'add' &&
                    this.selectedTab === 'inactive'
                ) {
                    this.updateDataCount();
                }
                // Update Trailer
                else if (res.animation === 'update') {
                    this.viewData = this.viewData.map((trailer: any) => {
                        if (trailer.id === res.id) {
                            trailer = this.mapTrailerData(res.data);
                            trailer.actionAnimation = 'update';
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
                else if (res.animation === 'update-status') {
                    let trailerIndex: number;

                    this.viewData = this.viewData.map(
                        (trailer: any, index: number) => {
                            if (trailer.id === res.id) {
                                trailer.actionAnimation =
                                    this.selectedTab === 'active'
                                        ? 'deactivate'
                                        : 'activate';
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

        // Delete Selected Rows
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
                        { size: 'small' },
                        {
                            data: null,
                            array: mappedRes,
                            template: 'trailer',
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
                            this.trailerBackFilter(searchEvent.query, true);
                        } else if (searchEvent.action === 'store') {
                            this.sendTrailerData();
                        }
                    }
                }
            });
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

    public initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                ],
            },
            actions: [
                {
                    title: 'Edit Trailer',
                    name: 'edit-trailer',
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
                    title:
                        this.selectedTab === 'active'
                            ? 'Deactivate'
                            : 'Activate',
                    reverseTitle: 'Deactivate',
                    name: 'activate-item',
                    class: 'regular-text',
                    contentType: 'activate',
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'trailer',
                    text: 'Are you sure you want to delete trailer(s)?',
                    class: 'delete-text',
                    contentType: 'delete',
                },
            ],
        };
    }

    sendTrailerData() {
        this.initTableOptions();

        const trailerCount = JSON.parse(
            localStorage.getItem('trailerTableCount')
        );

        const truckActiveData =
            this.selectedTab === 'active' ? this.getTabData('active') : [];

        const truckInactiveData =
            this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

        this.tableData = [
            {
                title: 'Active',
                field: 'active',
                length: trailerCount.active,
                data: truckActiveData,
                extended: false,
                gridNameTitle: 'Trailer',
                stateName: 'trailers',
                tableConfiguration: 'TRAILER',
                isActive: this.selectedTab === 'active',
                gridColumns: this.getGridColumns('TRAILER'),
            },
            {
                title: 'Inactive',
                field: 'inactive',
                length: trailerCount.inactive,
                data: truckInactiveData,
                extended: false,
                gridNameTitle: 'Trailer',
                stateName: 'trailers',
                tableConfiguration: 'TRAILER',
                isActive: this.selectedTab === 'inactive',
                gridColumns: this.getGridColumns('TRAILER'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setTrailerData(td);
    }

    private getGridColumns(configType: string): any[] {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getTrailerColumnDefinition();
    }

    setTrailerData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapTrailerData(data);
            });
        } else {
            this.viewData = [];
        }
    }

    mapTrailerData(data: any) {
        return {
            ...data,
            isSelected: false,
            tableTrailerTypeIcon: data.trailerType.logoName,
            tableTrailerTypeClass: data.trailerType.logoName.replace(
                '.svg',
                ''
            ),
            tableMake: data?.trailerMake?.name ? data.trailerMake.name : '',
            tableModel: data?.model ? data?.model : '',
            tableColor: data?.color?.code ? data.color.code : '',
            colorName: data?.color?.name ? data.color.name : '',
            tabelLength: data?.trailerLength?.name
                ? data.trailerLength.name
                : '',
            tableDriver: 'NA',
            tableTruck: 'NA',
            tableTruckType: 'NA',
            tableOwner: data?.owner?.name ? data.owner.name : '',
            tableWeightEmpty: data?.emptyWeight
                ? this.thousandSeparator.transform(data.emptyWeight) + ' lbs.'
                : '',
            tableWeightVolume: 'NA',
            tableAxle: data?.axles ? data?.axles : '',
            tableSuspension: data?.suspension?.name ? data.suspension.name : '',
            tableTireSize: data?.tireSize?.name ? data.tireSize.name : '',
            tableReeferUnit: data?.reeferUnit?.name ? data.reeferUnit.name : '',
            tableDoorType: data?.doorType?.name ? data.doorType.name : '',
            tableInsPolicy: data?.insurancePolicy ? data.insurancePolicy : '',
            tableMileage: data?.mileage
                ? this.thousandSeparator.transform(data.mileage)
                : '',
            tableLicencePlateDetailNumber: 'NA',
            tableLicencePlateDetailST: 'NA',
            tableLicencePlateDetailExpiration: {
                expirationDays: data?.registrationExpirationDays
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
                ? data?.fhwaExp + ' months'
                : '',
            tableFHWAInspectionExpiration: {
                expirationDays: data?.inspectionExpirationDays
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
            tableTitleNumber: 'NA',
            tableTitleST: 'NA',
            tableTitlePurchase: 'NA',
            tableTitleIssued: 'NA',
            tablePurchaseDate: data.purchaseDate
                ? this.datePipe.transform(data.purchaseDate, 'MM/dd/yy')
                : '',
            tablePurchasePrice: data?.purchasePrice
                ? '$' + this.thousandSeparator.transform(data.purchasePrice)
                : '',
            tableTerminated: 'NA',
            tableAdded: data.createdAt
                ? this.datePipe.transform(data.createdAt, 'MM/dd/yy')
                : '',
            tableEdited: data.updatedAt
                ? this.datePipe.transform(data.updatedAt, 'MM/dd/yy')
                : '',

            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,
        };
    }

    updateDataCount() {
        const truckCount = JSON.parse(
            localStorage.getItem('trailerTableCount')
        );

        this.tableData[0].length = truckCount.active;
        this.tableData[1].length = truckCount.inactive;
    }

    getTabData(dataType: string) {
        if (dataType === 'active') {
            this.trailerActive = this.trailerActiveQuery.getAll();

            return this.trailerActive?.length ? this.trailerActive : [];
        } else if (dataType === 'inactive') {
            this.trailerInactive = this.trailerInactiveQuery.getAll();

            return this.trailerInactive?.length ? this.trailerInactive : [];
        }
    }

    trailerBackFilter(
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

                    if (isSearch) {
                        this.tableData[
                            this.selectedTab === 'active' ? 0 : 1
                        ].length = trailer.pagination.count;
                    }
                } else {
                    let newData = [...this.viewData];

                    trailer.pagination.data.map((data: any) => {
                        newData.push(this.mapTrailerData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    onToolBarAction(event: any) {
        if (event.action === 'open-modal') {
            this.modalService.openModal(TrailerModalComponent, {
                size: 'small',
            });
        } else if (event.action === 'tab-selected') {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
            this.backFilterQuery.pageIndex = 1;

            this.sendTrailerData();
        } else if (event.action === 'view-mode') {
            this.activeViewMode = event.mode;
        }
    }

    onTableHeadActions(event: any) {
        if (event.action === 'sort') {
            if (event.direction) {
                this.backFilterQuery.active =
                    this.selectedTab === 'active' ? 1 : 0;
                this.backFilterQuery.sort = event.direction;
                this.backFilterQuery.pageIndex = 1;

                this.trailerBackFilter(this.backFilterQuery);
            } else {
                this.sendTrailerData();
            }
        }
    }

    public onTableBodyActions(event: any) {
        const mappedEvent = {
            ...event,
            data: {
                ...event.data,
                number: event.data?.trailerNumber,
                avatar: `assets/svg/common/trailers/${event.data?.trailerType?.logoName}`,
            },
        };

        switch (event.type) {
            case 'show-more': {
                this.backFilterQuery.pageIndex++;

                this.trailerBackFilter(this.backFilterQuery, false, true);
                break;
            }
            case 'edit-trailer': {
                this.modalService.openModal(
                    TrailerModalComponent,
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
                        modal: 'trailer',
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
                        modal: 'trailer',
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
                        template: 'trailer',
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
                        template: 'trailer',
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

    private changeTrailerStatus(id: number) {
        this.trailerService
            .changeTrailerStatus(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteTrailerById(id: number) {
        this.trailerService
            .deleteTrailerById(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((trailer: any) => {
                        if (trailer.id === id) {
                            trailer.actionAnimation = 'delete';
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

    private multipleDeleteTrailers(response: any[]) {
        this.trailerService
            .deleteTrailerList(response)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                let trailerNumber = '';
                let trailersText = 'Trailer ';

                this.viewData = this.viewData.map((trailer: any) => {
                    response.map((id: any) => {
                        if (trailer.id === id) {
                            trailer.actionAnimation = 'delete-multiple';

                            if (trailerNumber == '') {
                                trailerNumber = trailer.trailerNumber;
                            } else {
                                trailerNumber =
                                    trailerNumber +
                                    ', ' +
                                    trailer.trailerNumber;
                                trailersText = 'Trailers ';
                            }
                        }
                    });

                    return trailer;
                });

                this.updateDataCount();

                trailerNumber = '';
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
        this.resizeObserver.unobserve(
            document.querySelector('.table-container')
        );
        this.resizeObserver.disconnect();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
