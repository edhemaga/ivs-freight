import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getMilesColumnsDefinition } from '../../../../../assets/utils/settings/miles-columns';
import { MilesTableQuery } from '../state/miles.query';

@Component({
    selector: 'app-miles',
    templateUrl: './miles.component.html',
    styleUrls: ['./miles.component.scss'],
})
export class MilesComponent implements OnInit, AfterViewInit {
    private destroy$ = new Subject<void>();

    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    selectedTab = 'active';
    activeViewMode: string = 'List';
    columns: any[] = [];
    tableContainerWidth: number = 0;
    resizeObserver: ResizeObserver;
    driversActive: any;

    constructor(
        private milesTableQuery: MilesTableQuery,
        private tableService: TruckassistTableService
    ) {}

    ngOnInit(): void {
        this.sendMilesData();

        // Reset Columns
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendMilesData();
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
    }

    sendMilesData() {
        this.initTableOptions();

        const milesCount = JSON.parse(localStorage.getItem('milesTableCount'));
        const milesActiveData =
            this.selectedTab === 'active' ? this.getTabData('active') : [];

        const milesInactiveData =
            this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

        this.tableData = [
            {
                title: 'Active Truck',
                field: 'active',
                length: milesCount.active,
                data: milesActiveData,
                extended: false,
                gridNameTitle: 'Miles',
                stateName: 'miles',
                tableConfiguration: 'MILES',
                isActive: this.selectedTab === 'active',
                gridColumns: this.getGridColumns('miles', 'MILES'),
            },
            {
                title: 'Inactive Truck',
                field: 'inactive',
                length: milesCount.inactive,
                data: milesInactiveData,
                extended: false,
                gridNameTitle: 'Miles',
                stateName: 'miles',
                tableConfiguration: 'MILES',
                isActive: this.selectedTab === 'inactive',
                gridColumns: this.getGridColumns('miles', 'MILES'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setMilesData(td);
    }

    getTabData(dataType: string) {
        if (dataType === 'active') {
            this.driversActive = this.milesTableQuery.getAll();
            return this.driversActive?.length ? this.driversActive : [];
        } else if (dataType === 'inactive') {
            // this.driversInactive = this.driversInactiveQuery.getAll();
            // return this.driversInactive?.length ? this.driversInactive : [];
        }
    }

    setMilesData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data: any) => {
                return this.mapMilesData(data);
            });

            console.log('WHAT IS DATA');
            console.log(this.viewData);
        } else {
            this.viewData = [];
        }
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableContainerWidth = entry.contentRect.width;
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    mapMilesData(data: any) {
        return {
            ...data,
            isSelected: false,
            unit: data.truck.truckNumber,
            truckTypeIcon: data.truck.truckType.logoName,
            truckTypeClass: data.truck.truckType.logoName.replace('.svg', ''),
        };
    }

    getGridColumns(activeTab: string, configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getMilesColumnsDefinition();
    }

    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showLocationFilter: this.selectedTab !== 'applicants',
                showArhiveFilter: this.selectedTab === 'applicants',
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                ],
            },
            actions: [],
        };
    }

    onToolBarAction(event: any) {
        console.log(event);
    }

    onTableHeadActions(event: any) {
        console.log(event);
    }

    onTableBodyActions(event: any) {
        console.log(event);
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
