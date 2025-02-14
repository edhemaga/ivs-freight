import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';

// store
import { RoadsideInactiveState } from '@pages/safety/violation/state/roadside-state/roadside-inactive/roadside-inactive.store';
import { RoadsideActiveState } from '@pages/safety/violation/state/roadside-state/roadside-active/roadside-active.store';
import { RoadsideActiveQuery } from '@pages/safety/violation/state/roadside-state/roadside-active/roadside-active.query';
import { RoadsideInactiveQuery } from '@pages/safety/violation/state/roadside-state/roadside-inactive/roadside-inactive.query';

// helpers
import { getRoadsideInspectionColums } from '@shared/utils/settings/table-settings/safety-columns';

// components
import { ViolationModalComponent } from '@pages/safety/violation/pages/violation-modal/violation-modal.component';
import { eGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-violation-table',
    templateUrl: './violation-table.component.html',
    styleUrls: ['./violation-table.component.scss'],
    providers: [DatePipe],
})
export class ViolationTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    private destroy$ = new Subject<void>();

    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    selectedTab = 'active';
    activeViewMode: string = 'List';
    resizeObserver: ResizeObserver;
    roadsideActive: RoadsideActiveState[] = [];
    roadsideInactive: RoadsideInactiveState[] = [];

    constructor(
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private roadsideActiveQuery: RoadsideActiveQuery,
        private roadsideInactiveQuery: RoadsideInactiveQuery,
        private datePipe: DatePipe
    ) {}

    // -------------------------------NgOnInit-------------------------------
    ngOnInit(): void {
        this.sendViolationData();

        // Reset Columns
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendViolationData();
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
                        )
                            c.width = response.event.width;

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

    ngAfterViewInit(): void {
        this.observeTableContainer();
    }

    // Responsive Observer
    private observeTableContainer(): void {
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
    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                    { name: 'Map', active: this.activeViewMode === 'Map' },
                ],
            },
            attachmentConfig: {
                hasViolation: true,
                hasCitation: true,
            },
            actions: [
                {
                    title: 'Edit',
                    name: 'edit-violation',
                    class: 'regular-text',
                    contentType: eGeneralActions.EDIT,
                },
                {
                    title: 'Delete',
                    name: eGeneralActions.DELETE,
                    type: 'violations',
                    text: 'Are you sure you want to delete violation?',
                    class: 'delete-text',
                    contentType: eGeneralActions.DELETE,
                },
            ],
        };
    }

    // Send Roadside Inspection
    sendViolationData() {
        const tableView = JSON.parse(
            localStorage.getItem(`Roadside Inspection-table-view`)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const roadsideCount = JSON.parse(
            localStorage.getItem('roadsideTableCount')
        );

        const roadsideActiveData = this.getTabData('active');

        const roadsideInactiveData = this.getTabData();

        this.tableData = [
            {
                title: 'Active',
                field: 'active',
                length: roadsideCount.active,
                data: roadsideActiveData,
                gridNameTitle: 'Roadside Inspection',
                tableConfiguration: 'ROADSIDE_INSPECTION',
                isActive: this.selectedTab === 'active',
                gridColumns: this.getGridColumns('ROADSIDE_INSPECTION'),
            },
            {
                title: 'Inactive',
                field: 'inactive',
                length: roadsideCount.inactive,
                data: roadsideInactiveData,
                gridNameTitle: 'Roadside Inspection',
                tableConfiguration: 'ROADSIDE_INSPECTION',
                isActive: this.selectedTab === 'inactive',
                gridColumns: this.getGridColumns('ROADSIDE_INSPECTION'),
            },
            {
                title: 'Violation Summary',
                field: 'summary',
                length: 0,
                data: [],
                gridNameTitle: 'Roadside Inspection',
                tableConfiguration: 'ROADSIDE_INSPECTION',
                isActive: this.selectedTab === 'summary',
                gridColumns: this.getGridColumns('ROADSIDE_INSPECTION'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setViolationData(td);
    }

    // Get Table Tab Data
    getTabData(dataType?: string) {
        if (dataType === 'active') {
            this.roadsideActive = this.roadsideActiveQuery.getAll();

            return this.roadsideActive?.length ? this.roadsideActive : [];
        } else {
            this.roadsideInactive = this.roadsideInactiveQuery.getAll();

            return this.roadsideInactive?.length ? this.roadsideInactive : [];
        }
    }

    // Get Roadside Inspection Table Columns Configurations
    getGridColumns(configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getRoadsideInspectionColums();
    }

    // Set Roadside Inspection Table Data
    setViolationData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data: any) => {
                return this.selectedTab === 'summary'
                    ? this.mapViolationSummaryData(data)
                    : this.mapRoadsideInspectionData(data);
            });
        } else this.viewData = [];
    }

    // Map Violation Summary Data
    mapViolationSummaryData(data: any) {
        return {
            ...data,
            isSelected: false,
        };
    }

    // Map Roadside Inspection Data
    mapRoadsideInspectionData(data: any) {
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
            tabelStartTime: data?.startTime ? data?.startTime : '',
            tabelEndTime: data?.endTime ? data?.endTime : '',
            tableLvl: data?.inspectionLevel
                ? this.formatInspectionLevel(data?.inspectionLevel)
                : '',
            tableState: data?.country ? data?.country : '',
            /* Test */
            tableDropdownProgress: {
                expirationDays: 20,
                percentage: 20,
            },
            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,
        };
    }

    // Format Inspection Level
    public formatInspectionLevel(inspectionLevel: string): string {
        let level = '';

        for (let i = 0; i < inspectionLevel.length; i++) {
            if (inspectionLevel[i] !== '.') {
                level += inspectionLevel[i];
            } else {
                break;
            }
        }

        return level;
    }

    // On Toolbar Actions
    public onToolBarAction(event: any): void {
        if (event.action === 'open-modal') {
            alert('Treba da se odradi modal!');
        } else if (event.action === 'tab-selected') {
            this.selectedTab = event.tabData.field;
            this.setViolationData(event.tabData);
        } else if (event.action === 'view-mode') {
            this.activeViewMode = event.mode;

            this.tableOptions.toolbarActions.hideSearch = event.mode == 'Map';
        }
    }

    // On Head Actions
    public onTableHeadActions(event: any): void {
        if (event.action !== 'sort' || event.direction) return;
        this.sendViolationData();
    }

    // On Body Actions
    public onTableBodyActions(event: any): void {
        switch (event.type) {
            case 'edit-violation': {
                this.modalService.openModal(
                    ViolationModalComponent,
                    { size: 'large-xl' },
                    {
                        id: event.id,
                        type: eGeneralActions.EDIT,
                        data: event.data,
                    }
                );
            }
        }
    }

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();

        this.destroy$.next();
        this.destroy$.complete();
    }
}
