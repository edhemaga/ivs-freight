import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { CaSearchMultipleStatesService } from 'ca-components';

// components
import { AccidentModalComponent } from '@pages/safety/accident/pages/accident-modal/accident-modal.component';

// helpers
import { getAccidentColumns } from '@shared/utils/settings/table-settings/safety-columns';

// store
import { AccidentActiveState } from '@pages/safety/accident/state/accident-active/accident-active.store';
import { AccidentInactiveState } from '@pages/safety/accident/state/accident-inactive/accident-inactive.store';
import { AccidentNonReportedState } from '@pages/safety/accident/state/accident-non-reported/accident-non-reported.store';
import { AccidentActiveQuery } from '@pages/safety/accident/state/accident-active/accident-active.query';
import { AccidentNonReportedQuery } from '@pages/safety/accident/state/accident-non-reported/accident-non-reported.query';
import { AccidentInactiveQuery } from '@pages/safety/accident/state/accident-inactive/accident-inactive.query';

// models
import { AccidentShortResponse } from 'appcoretruckassist';

// enums
import { EGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-accident-table',
    templateUrl: './accident-table.component.html',
    styleUrls: [
        './accident-table.component.scss',
        '../../../../../../assets/scss/maps.scss',
    ],
    providers: [DatePipe],
})
export class AccidentTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    // Global
    private destroy$ = new Subject<void>();

    // Table
    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    selectedTab = 'active';
    activeViewMode: string = 'List';
    resizeObserver: ResizeObserver;
    accidentActive: AccidentActiveState[] = [];
    accidentInactive: AccidentInactiveState[] = [];
    accidentNonReported: AccidentNonReportedState[] = [];

    // Map
    @ViewChild('mapsComponent', { static: false }) public mapsComponent: any;
    public sortTypes: any[] = [
        { name: 'Report Number', id: 1, sortName: 'report' },
        { name: 'Location', id: 2, sortName: 'location', isHidden: true },
        { name: 'Inspection Results', id: 8, sortName: 'results' },
        { name: 'Inspection Weights', id: 9, sortName: 'weights' },
        { name: 'Date & Time', id: 3, sortName: 'date' },
        { name: 'Drivers Name', id: 4, sortName: 'driverName' },
        { name: 'Truck Unit', id: 5, sortName: 'truck' },
        { name: 'Trailer Unit', id: 6, sortName: 'trailer' },
        {
            name: 'Inspection Level',
            id: 7,
            sortName: 'inspectionLevel',
            isHidden: false,
        }, // for Roadside Inspection only
    ];
    public sortDirection: string = 'asc';
    public activeSortType: any = {
        name: 'Report Number',
        id: 1,
        sortName: 'report',
    };
    public sortBy: any;
    public searchValue: string = '';
    public locationFilterOn: boolean = false;

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private accidentActiveQuery: AccidentActiveQuery,
        private accidentInactiveQuery: AccidentInactiveQuery,
        private accidentNonReportedQuery: AccidentNonReportedQuery,
        private datePipe: DatePipe,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService
    ) {}

    // -------------------------------NgOnInit-------------------------------
    ngOnInit(): void {
        this.sendAccidentData();

        // Reset Columns
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) this.sendAccidentData();
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
    }

    // -------------------------------NgAfterViewInit-------------------------------
    ngAfterViewInit(): void {
        this.observeTableContainer();
    }

    // Responsive Observer
    private observeTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    // Table Options
    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTimeFilter: this.selectedTab === 'active',
                showLocationFilter: this.selectedTab === 'active',
                showDriverFilter: this.selectedTab === 'active',
                showTruckFilter: this.selectedTab === 'active',
                showTrailerFilter: this.selectedTab === 'active',
                showInjuryFilter: this.selectedTab === 'active',
                showTowingFilter: this.selectedTab === 'active',
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                    { name: 'Map', active: this.activeViewMode === 'Map' },
                ],
            },
            actions: [
                {
                    title: 'Edit',
                    name: 'edit-accident',
                    class: 'regular-text',
                    contentType: EGeneralActions.EDIT,
                    show: true,
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                },
                {
                    title: 'Delete',
                    name: EGeneralActions.DELETE,
                    type: 'safety',
                    text: 'Are you sure you want to delete accident?',
                    class: 'delete-text',
                    contentType: EGeneralActions.DELETE,
                    show: true,
                    danger: true,
                    svg: 'assets/svg/truckassist-table/dropdown/content/delete.svg',
                },
            ],
        };
    }

    sendAccidentData() {
        const tableView = JSON.parse(
            localStorage.getItem(`Accident-table-view`)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const accidentCount = JSON.parse(
            localStorage.getItem('accidentTableCount')
        );

        const roadsideActiveData = this.getTabData('active');

        const roadsideInactiveData = this.getTabData('inctive');

        const roadsideNonReportableData = this.getTabData('non-reportable');

        this.tableData = [
            {
                title: 'Active',
                field: 'active',
                length: accidentCount.active,
                data: roadsideActiveData,
                gridNameTitle: 'Accident',
                tableConfiguration: 'ACCIDENT',
                isActive: this.selectedTab === 'active',
                gridColumns: this.getGridColumns('ACCIDENT'),
            },
            {
                title: 'Inactive',
                field: 'inactive',
                length: accidentCount.inactive,
                data: roadsideInactiveData,
                gridNameTitle: 'Accident',
                tableConfiguration: 'ACCIDENT',
                isActive: this.selectedTab === 'inactive',
                gridColumns: this.getGridColumns('ACCIDENT'),
            },
            {
                title: 'Non-Reportable',
                field: 'non-reportable',
                length: accidentCount.nonReportableCount,
                data: roadsideNonReportableData,
                gridNameTitle: 'Accident',
                tableConfiguration: 'ACCIDENT',
                isActive: this.selectedTab === 'non-reportable',
                gridColumns: this.getGridColumns('ACCIDENT'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setAccidentData(td);
    }

    // Get Table Tab Data
    getTabData(dataType?: string) {
        if (dataType === 'active') {
            this.accidentActive = this.accidentActiveQuery.getAll();

            return this.accidentActive?.length ? this.accidentActive : [];
        } else if (dataType === 'inactive') {
            this.accidentInactive = this.accidentInactiveQuery.getAll();

            return this.accidentInactive?.length ? this.accidentInactive : [];
        } else {
            this.accidentNonReported = this.accidentNonReportedQuery.getAll();

            return this.accidentNonReported?.length
                ? this.accidentNonReported
                : [];
        }
    }

    getGridColumns(configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig ? tableColumnsConfig : getAccidentColumns();
    }

    // Set Accident Data
    setAccidentData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data: any) => {
                return this.mapAccidentData(data);
            });

            /* for(let i = 0; i < 100; i++){
        this.viewData.push(this.viewData[2]);
      } */
        } else {
            this.viewData = [];
        }
    }

    // Map Accident Data
    mapAccidentData(data: AccidentShortResponse) {
        return {
            ...data,
            isSelected: false,
            tableReport: data?.report ? data.report : 'No Report',
            tableDriverName: data?.driver_FullName ? data.driver_FullName : '',
            truckNumber: null,
            trailerNumber: null,
            tableDate: data?.date
                ? this.datePipe.transform(data.date, 'MM/dd/yy')
                : '',
            tabelTime: data?.time ? data?.time : '',
            tableState: data?.state ? data?.state : '',
            tableAttachments: [],
        };
    }

    //On Toolbar Action
    onToolBarAction(event: any) {
        if (event.action === 'open-modal') {
            this.modalService.openModal(AccidentModalComponent, {
                size: 'large-xl',
            });
        } else if (event.action === 'tab-selected') {
            this.selectedTab = event.tabData.field;

            this.sendAccidentData();
        } else if (event.action === 'view-mode') {
            this.activeViewMode = event.mode;

            this.tableOptions.toolbarActions.hideSearch = event.mode == 'Map';
        }
    }

    // On Head Actions
    onTableHeadActions(event: any) {
        if (event.action === 'sort') {
            if (event.direction) {
                /*  this.mapingIndex = 0;

        this.backFilterQuery.sort = event.direction;

        this.backFilterQuery.pageIndex = 1;

        this.contactBackFilter(this.backFilterQuery); */
            } else {
                this.sendAccidentData();
            }
        }
    }

    // Table Body Action
    onTableBodyActions(event: any) {
        switch (event.type) {
            case 'edit-accident': {
                this.modalService.openModal(
                    AccidentModalComponent,
                    { size: 'large-xl' },
                    {
                        id: event.id,
                        type: EGeneralActions.EDIT,
                        data: event.data,
                    }
                );
            }
        }
    }

    // Map Select Item
    selectItem(id) {
        this.mapsComponent.clickedMarker(id);
    }

    // -------------------------------NgOnDestroy-------------------------------
    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});

        // this.resizeObserver.unobserve(
        //     document.querySelector('.table-container')
        // );
        this.resizeObserver.disconnect();

        this.destroy$.next();
        this.destroy$.complete();
    }
}
