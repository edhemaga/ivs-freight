import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Modules
import {
    getTruckPMColumnDefinition,
    getTrailerPMColumnDefinition,
} from '../../../../assets/utils/settings/pm-columns';
import { ConstantStringTableComponentsEnum } from '../../utils/enums/table-components.enum';

// Components
import { RepairPmModalComponent } from '../modals/repair-modals/repair-pm-modal/repair-pm-modal.component';

// Models
import {
    GridColumn,
    ToolbarActions,
} from '../shared/model/card-table-data.model';
import { Truck, Trailer } from '../shared/model/pm';
import { DataForCardsAndTables } from '../shared/model/table-components/all-tables.modal';
import { CardRows } from '../shared/model/card-data.model';

// Services
import { ModalService } from '../shared/ta-modal/modal.service';
import { TruckassistTableService } from '../../services/truckassist-table/truckassist-table.service';

// Constants
import { TableDropdownComponentConstants } from '../../utils/constants/table-components.constants';

// Data
import { DisplayPMConfiguration } from './pm-card-data';

@Component({
    selector: 'app-pm-truck-trailer',
    templateUrl: './pm-truck-trailer.component.html',
    styleUrls: ['./pm-truck-trailer.component.scss'],
})
export class PmTruckTrailerComponent implements OnInit {
    private destroy$ = new Subject<void>();
    public tableOptions: any = {};
    public tableData: any[] = [];
    private viewData: any[] = [];
    public columns: GridColumn[] = [];
    public selectedTab: string = ConstantStringTableComponentsEnum.ACTIVE;
    public activeViewMode: string = ConstantStringTableComponentsEnum.LIST;
    private resizeObserver: ResizeObserver;

    //Data to display from model Broker
    public displayRowsFront: CardRows[] =
        DisplayPMConfiguration.DISPLAY_ROWS_FRONT_ACTIVE;
    public displayRowsBack: CardRows[] =
        DisplayPMConfiguration.DISPLAY_ROWS_BACK_ACTIVE;

    //Data to display from model Shipper
    public displayRowsFrontInactive: CardRows[] =
        DisplayPMConfiguration.DISPLAY_ROWS_FRONT_INACTIVE;
    public displayRowsBackInactive: CardRows[] =
        DisplayPMConfiguration.DISPLAY_ROWS_BACK_INACTIVE;

    public cardTitle: string = DisplayPMConfiguration.CARD_TITLE;
    public page: string = DisplayPMConfiguration.PAGE;
    public rows: number = DisplayPMConfiguration.ROWS;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService
    ) {}

    // ---------------------------- ngOnInit ------------------------------
    ngOnInit(): void {
        this.sendPMData();

        this.resetColumns();
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
            .subscribe((response) => {
                if (response) this.sendPMData();
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
                showGeneralPmBtn: true,
                hideOpenModalButton: true,
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
            actions: TableDropdownComponentConstants.ACTIONS_DROPDOWN,
        };
    }

    private sendPMData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.PM_TABLE_VIEW
            )
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        this.tableData = [
            {
                title: ConstantStringTableComponentsEnum.TRUCK_2,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: 8,
                data: this.getDumyData(
                    8,
                    ConstantStringTableComponentsEnum.TRUCK
                ),
                extended: false,
                selectTab: true,
                gridNameTitle: ConstantStringTableComponentsEnum.PM_2,
                stateName: ConstantStringTableComponentsEnum.PM_TRUCKS,
                tableConfiguration: ConstantStringTableComponentsEnum.PM_TRUCK,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.PM_TRUCK
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.TRAILER_3,
                field: ConstantStringTableComponentsEnum.INACTIVE,
                length: 15,
                data: this.getDumyData(
                    15,
                    ConstantStringTableComponentsEnum.TRAILER_2
                ),
                extended: false,
                selectTab: true,
                gridNameTitle: ConstantStringTableComponentsEnum.PM_2,
                stateName: ConstantStringTableComponentsEnum.PM_TRAILERS,
                tableConfiguration:
                    ConstantStringTableComponentsEnum.PM_TRAILER,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.PM_TRAILER
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setPmData(td);
    }

    private getGridColumns(configType: string): void {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (configType === ConstantStringTableComponentsEnum.PM_TRUCK) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getTruckPMColumnDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getTrailerPMColumnDefinition();
        }
    }

    private setPmData(td: DataForCardsAndTables): void {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                data.isSelected = false;
                return data;
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

    // Data until backend point is fixed
    private getDumyData(
        numberOfCopy: number,
        dataType: string
    ): (Truck | Trailer)[] {
        const newDumyData = {
            expirationDays: 8350,
            expirationDaysText: '8350',
            percentage: 20,
        };

        const truck: Truck = {
            textUnit: '12345',
            textOdometer: '567,364',
            oilFilter: newDumyData,
            airFilter: newDumyData,
            transFluid: newDumyData,
            belts: newDumyData,
            textInv: 'W444-444',
            textLastShop: 'NEXTRAN TRUCKS',
            lastService: '04/04/24',
            ruMake: 'Carrier',
            repairShop: 'ARMEN’S TIRE AND SERVICE',
        };

        const trailer: Trailer = {
            textUnit: '123',
            textOdometer: '1,267,305',
            lastService: '01/29/21',
            repairShop: 'ARMEN’S TIRE AND SERVICE',
            color: '#7040A1',
            svgIcon: 'Treba da se sredi',
            alignment: newDumyData,
            general: newDumyData,
            ptoNumber: newDumyData,
            ruMake: 'Carrier',
            reeferUnit: newDumyData,
        };

        let data = [];

        for (let i = 0; i < numberOfCopy; i++) {
            if (dataType === ConstantStringTableComponentsEnum.TRUCK) {
                data.push(truck);
            } else {
                data.push(trailer);
            }
        }

        return data;
    }

    public onToolBarAction(event: ToolbarActions): void {
        if (event.action === ConstantStringTableComponentsEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;
            this.sendPMData();
        } else if (
            event.action === ConstantStringTableComponentsEnum.OPEN_MODAL
        ) {
        } else if (
            event.action === ConstantStringTableComponentsEnum.OPEN_GENERAL_PM
        ) {
            if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
                this.modalService.openModal(
                    RepairPmModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        type: ConstantStringTableComponentsEnum.NEW,
                        header: ConstantStringTableComponentsEnum.TRUCK_2,
                        action: ConstantStringTableComponentsEnum.GENERIC_PM,
                    }
                );
            } else {
                this.modalService.openModal(
                    RepairPmModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        type: ConstantStringTableComponentsEnum.NEW,
                        header: ConstantStringTableComponentsEnum.TRAILER_3,
                        action: ConstantStringTableComponentsEnum.GENERIC_PM,
                    }
                );
            }
        } else if (
            event.action === ConstantStringTableComponentsEnum.VIEW_MODE
        ) {
            this.activeViewMode = event.mode;
        }
    }

    public onTableBodyActions(event: any): void {
        switch (this.selectedTab) {
            case ConstantStringTableComponentsEnum.ACTIVE: {
                this.modalService.openModal(
                    RepairPmModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        header: ConstantStringTableComponentsEnum.TRUCK_2,
                        action: ConstantStringTableComponentsEnum.UNIT_PM,
                    }
                );
                break;
            }
            case ConstantStringTableComponentsEnum.INACTIVE: {
                this.modalService.openModal(
                    RepairPmModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                        header: ConstantStringTableComponentsEnum.TRAILER_3,
                        action: ConstantStringTableComponentsEnum.UNIT_PM,
                    }
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
