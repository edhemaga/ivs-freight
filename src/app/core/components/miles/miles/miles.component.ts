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
    milesActive: any;
    milesInactive: any;

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
            this.milesActive = this.milesTableQuery.getAll()[0];
            return this.milesActive?.length ? this.milesActive : [];
        } else if (dataType === 'inactive') {
            this.milesInactive = this.milesTableQuery.getAll()[1];
            return this.milesInactive?.length ? this.milesInactive : [];
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
            stopsCount: data.stopsCount.toFixed(0),
            loadedMiles: data.loadedMiles.toFixed(0) + ' mi',
            loadCount: data.loadCount.toFixed(0),
            emptyMiles: data.emptyMiles.toFixed(0) + ' mi',
            totalMiles: data.totalMiles.toFixed(0) + ' mi',
            milesPerGalon: `${
                data.milesPerGalon ? data.milesPerGalon.toFixed(2) : 0.0
            }`,
            fuelTotalGalons:
                `${data.fuelTotalGalons ? data.fuelTotalGalons : 0}` + ' gal',
            unit: data.truck.truckNumber,
            truckTypeIcon: data.truck.truckType.logoName,
            pickupPercentage: data.pickupPercentage.toFixed(2) + '%',
            deliveryPercentage: data.deliveryPercentage.toFixed(2) + '%',
            fuelPercentage: data.fuelPercentage.toFixed(2) + '%',
            repairPercentage: data.repairPercentage.toFixed(2) + '%',
            parkingPercentage: data.parkingPercentage.toFixed(2) + '%',
            deadHeadPercentage: data.deadHeadPercentage.toFixed(2) + '%',
            towingPercentage: data.towingPercentage.toFixed(2) + '%',
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
                hideOpenModalButton: true,
                hideDeleteButton: true,
                hideActivationButton: true,
                showTimeFilter: true,
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                ],
            },
            actions: [],
        };
    }

    onToolBarAction(event: any) {
        if (event.action === 'tab-selected') {
            this.selectedTab = event.tabData.field;
            this.sendMilesData();
        }
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
