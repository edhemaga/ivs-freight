import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin, map, Observable, Subject, takeUntil } from 'rxjs';

// components
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ApplicantModalComponent } from '@pages/applicant/pages/applicant-modal/applicant-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// base classes
import { DriverDropdownMenuActionsBase } from '@pages/driver/base-classes';

// settings
import { getDriverApplicantColumnsDefinition } from '@shared/utils/settings/table-settings/driver-applicant-columns';
import { getDriverColumnsDefinition } from '@shared/utils/settings/table-settings/driver-columns';

// services
import { ModalService } from '@shared/services/modal.service';
import { DriverService } from '@pages/driver/services/driver.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ApplicantService } from '@shared/services/applicant.service';
import { AddressService } from '@shared/services/address.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { DriverCardsModalService } from '@pages/driver/pages/driver-card-modal/services/driver-cards-modal.service';
import { CaSearchMultipleStatesService } from 'ca-components';

// store
import { DriverState } from '@pages/driver/state/driver-state/driver.store';
import {
    DriversInactiveState,
    DriversInactiveStore,
} from '@pages/driver/state/driver-inactive-state/driver-inactive.store';
import { DriversInactiveQuery } from '@pages/driver/state/driver-inactive-state/driver-inactive.query';
import { ApplicantTableStore } from '@pages/driver/state/applicant-state/applicant-table.store';
import { DriverQuery } from '@pages/driver/state/driver-state/driver.query';
import { ApplicantTableQuery } from '@pages/driver/state/applicant-state/applicant-table.query';
import { Store, select } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectDriverApplicantTabCards,
    selectInactiveTabCards,
} from '@pages/driver/pages/driver-card-modal/state/driver-card-modal.selectors';

// pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TruckNameStringEnum } from '@shared/enums/truck-name-string.enum';
import { TooltipColorsStringEnum } from '@shared/enums/tooltip-colors-string.enum';
import { TrailerNameStringEnum } from '@shared/enums/trailer-name-string.enum';
import { eDropdownMenu } from '@shared/enums';

// constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';
import { DriverTableConfiguration } from '@pages/driver/pages/driver-table/utils/constants/driver-table-configuration.constants';

// helpers
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// models
import {
    ApplicantShortResponse,
    DriverListResponse,
    DriverResponse,
} from 'appcoretruckassist';
import { FilterOptionApplicant } from '@pages/driver/pages/driver-table/models/filter-option-applicant.model';
import { TableHeadActions } from '@pages/driver/pages/driver-table/models/table-head-actions.model';
import { FilterOptionDriver } from '@pages/driver/pages/driver-table/models/filter-option-driver.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
import { GridColumn } from '@shared/models/table-models/grid-column.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';

@Component({
    selector: 'app-driver-table',
    templateUrl: './driver-table.component.html',
    styleUrls: ['./driver-table.component.scss'],
    providers: [NameInitialsPipe, ThousandSeparatorPipe],
})
export class DriverTableComponent
    extends DriverDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    public destroy$ = new Subject<void>();

    public eDropdownMenu = eDropdownMenu;

    public resizeObserver: ResizeObserver;
    public activeViewMode: string = TableStringEnum.LIST;

    public selectedTab: string = TableStringEnum.ACTIVE;
    public applicantTabActive: boolean = false;

    public driversActive: DriverState[] = [];
    public driversInactive: DriversInactiveState[] = [];

    public driverTableData: any[] = [];
    public applicantData: ApplicantShortResponse[] = [];

    public inactiveTabClicked: boolean = false;
    public activeTableData: CardTableData;

    // table
    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: GridColumn[] = [];

    // cards
    public displayRowsFront: CardRows[] =
        DriverTableConfiguration.displayRowsActiveFront;
    public displayRowsBack: CardRows[] =
        DriverTableConfiguration.displayRowsActiveBack;
    public displayRowsFrontApplicants: CardRows[] =
        DriverTableConfiguration.displayRowsFrontApplicants;
    public displayRowsBackApplicants: CardRows[] =
        DriverTableConfiguration.displayRowsBackApplicants;
    public applicantBackFilterQuery: FilterOptionApplicant =
        TableDropdownComponentConstants.APPLICANT_BACK_FILTER;

    public mapingIndex: number = 0;
    public isSearching: boolean = false;

    public activeTab: string;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];
    public displayRows$: Observable<any>;

    // filters
    public driverBackFilterQuery: FilterOptionDriver = JSON.parse(
        JSON.stringify(TableDropdownComponentConstants.DRIVER_BACK_FILTER)
    );

    constructor(
        protected router: Router,

        // services
        protected modalService: ModalService,
        protected driverService: DriverService,

        private addressService: AddressService,
        private applicantService: ApplicantService,
        private tableService: TruckassistTableService,
        private confirmationService: ConfirmationService,
        private confirmationActivationService: ConfirmationActivationService,
        private driverCardsModalService: DriverCardsModalService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,

        // store
        private driversActiveQuery: DriverQuery,
        private driversInactiveQuery: DriversInactiveQuery,
        private applicantQuery: ApplicantTableQuery,
        private driversInactiveStore: DriversInactiveStore,
        private applicantStore: ApplicantTableStore,
        private store: Store,

        // pipes
        private thousandSeparator: ThousandSeparatorPipe,
        private nameInitialsPipe: NameInitialsPipe
    ) {
        super();
    }

    ngOnInit(): void {
        this.sendDriverData();

        this.setTableFilter();

        this.confirmationSubscribe();

        this.confirmationActivationSubscribe();

        this.getSelectedTabTableData();

        this.resetColumns();

        this.resize();

        this.toogleColumns();

        this.search();

        this.deleteSelectedRow();

        this.driverActions();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observeTableContainer();
        }, 10);
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                switch (res.type) {
                    case TableStringEnum.DELETE:
                        this.deleteDriverById(res.id);

                        break;

                    case TableStringEnum.MULTIPLE_DELETE:
                        this.multipleDeleteDrivers(res.array);

                        break;
                    default:
                        break;
                }
            });
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                switch (res.type) {
                    case TableStringEnum.ACTIVATE:
                    case TableStringEnum.DEACTIVATE:
                        this.changeDriverStatus(res.id);

                        break;
                    case TableStringEnum.ACTIVATE_MULTIPLE:
                    case TableStringEnum.DEACTIVATE_MULTIPLE:
                        const driverIds = res.array.map((driver) => {
                            return driver.id;
                        });

                        this.changeDriverStatusList(driverIds);

                        break;
                    default:
                        break;
                }
            });
    }

    // Reset Columns
    private setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filteredArray) {
                    if (res.selectedFilter) {
                        this.viewData = this.driverTableData?.filter(
                            (driverData) =>
                                res.filteredArray.some(
                                    (filterData) =>
                                        filterData.id === driverData.id
                                )
                        );
                    }

                    if (!res.selectedFilter) this.sendDriverData();
                } else if (res?.filterType) {
                    if (res.filterType === TableStringEnum.LOCATION_FILTER) {
                        if (res.action === TableStringEnum.SET) {
                            forkJoin(
                                this.driverTableData.map((repairData) =>
                                    this.addressService
                                        .getAddressInfo(repairData.tableAddress)
                                        .pipe(
                                            map((address) => {
                                                const distance =
                                                    DataFilterHelper.calculateDistanceBetweenTwoCitysByCoordinates(
                                                        res.queryParams
                                                            .latValue,
                                                        res.queryParams
                                                            .longValue,
                                                        address.longLat
                                                            .latitude,
                                                        address.longLat
                                                            .longitude
                                                    );

                                                return { repairData, distance };
                                            })
                                        )
                                )
                            ).subscribe((results) => {
                                this.viewData = results
                                    .filter(
                                        (result) =>
                                            result.distance <
                                            res.queryParams.rangeValue
                                    )
                                    .map((result) => result.repairData);
                            });
                        } else this.viewData = this.driverTableData;
                    }
                }
            });
    }

    // Reset Columns
    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response) {
                    this.sendDriverData();
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

    // Toogle Columns
    private toogleColumns(): void {
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
                    if (res.search) {
                        this.isSearching = true;
                    } else if (res.doReset) {
                        this.isSearching = false;
                    }
                    this.mapingIndex = 0;

                    this.driverBackFilterQuery.active =
                        this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
                    this.driverBackFilterQuery.pageIndex = 1;

                    this.applicantBackFilterQuery.applicantSpecParamsPageIndex = 1;

                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.selectedTab === TableStringEnum.APPLICANTS
                            ? this.applicantBackFilterQuery
                            : this.driverBackFilterQuery
                    );

                    if (searchEvent) {
                        if (searchEvent.action === TableStringEnum.API) {
                            this.selectedTab === TableStringEnum.APPLICANTS
                                ? this.applicantBackFilter(searchEvent.query)
                                : this.driverBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action === TableStringEnum.STORE
                        ) {
                            this.sendDriverData();
                        }
                    }
                }
            });
    }

    // Delete Selected Rows
    private deleteSelectedRow(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.length) {
                    let mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                                name: item.tableData?.fullName,
                            },
                        };
                    });
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.DRIVER,
                            type: TableStringEnum.MULTIPLE_DELETE,
                            image: true,
                        }
                    );
                }
            });
    }

    // Driver Actions
    private driverActions(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // On Add Driver Active
                if (
                    res?.animation === TableStringEnum.ADD &&
                    this.selectedTab === TableStringEnum.ACTIVE
                ) {
                    this.viewData.push(this.mapDriverData(res.data));
                    this.viewData = this.viewData.map((driver) => {
                        if (driver.id === res.id) {
                            driver.actionAnimation = TableStringEnum.ADD;
                        }

                        return driver;
                    });

                    this.updateDataCount();

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(interval);
                    }, 2300);
                }
                // On Add Driver Inactive
                else if (
                    res?.animation === TableStringEnum.ADD &&
                    this.selectedTab === TableStringEnum.INACTIVE
                ) {
                    this.updateDataCount();
                }
                // On Update Driver
                else if (res?.animation === TableStringEnum.UPDATE) {
                    const updatedDriver = this.mapDriverData(res.data);
                    this.viewData = this.viewData.map((driver) => {
                        if (driver.id === res.id) {
                            driver = updatedDriver;
                            driver.actionAnimation = TableStringEnum.UPDATE;
                        }

                        return driver;
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
                // On Update Driver Status
                else if (res?.animation === TableStringEnum.UPDATE_STATUS) {
                    let driverIndex: number;

                    this.viewData = this.viewData.map((driver, index) => {
                        if (driver.id === res.id) {
                            driver.actionAnimation =
                                this.selectedTab === TableStringEnum.ACTIVE
                                    ? TableStringEnum.DEACTIVATE
                                    : TableStringEnum.ACTIVATE;
                            driverIndex = index;
                        }

                        return driver;
                    });

                    this.updateDataCount();

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        this.viewData.splice(driverIndex, 1);
                        clearInterval(interval);
                    }, 900);
                }
                // On Delete Driver
                else if (res?.animation === TableStringEnum.DELETE) {
                    let driverIndex: number;

                    this.viewData = this.viewData.map((driver, index) => {
                        if (driver.id === res.id) {
                            driver.actionAnimation = TableStringEnum.DELETE;
                            driverIndex = index;
                        }

                        return driver;
                    });

                    this.updateDataCount();

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        this.viewData.splice(driverIndex, 1);
                        clearInterval(interval);
                    }, 900);
                } else if (res?.animation === TableStringEnum.UPDATE_MULTIPLE) {
                    const driverIds = res?.data.map((driver) => {
                        return driver.id;
                    });

                    this.viewData = this.viewData.map((driver, index) => {
                        if (driverIds.includes(driver.id)) {
                            driver.actionAnimation =
                                this.selectedTab === TableStringEnum.ACTIVE
                                    ? TableStringEnum.DEACTIVATE
                                    : TableStringEnum.ACTIVATE;
                        }

                        return driver;
                    });

                    this.updateDataCount();

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        for (let i = 0; i < this.viewData.length; i++) {
                            if (driverIds.includes(this.viewData[i].id)) {
                                this.viewData.splice(i, 1);
                                i--;
                            }
                        }
                        clearInterval(interval);
                    }, 900);

                    this.tableService.sendRowsSelected([]);
                    this.tableService.sendResetSelectedColumns(true);
                }
            });
    }

    private observeTableContainer(): void {
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
                hideActivationButton:
                    this.selectedTab === TableStringEnum.APPLICANTS,
                showLocationFilter:
                    this.selectedTab !== TableStringEnum.APPLICANTS,
                showArhiveFilter:
                    this.selectedTab === TableStringEnum.APPLICANTS,
                showHireApplicantButton:
                    this.selectedTab === TableStringEnum.APPLICANTS,
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

    private sendDriverData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(TableStringEnum.DRIVER_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const driverCount = JSON.parse(
            localStorage.getItem(TableStringEnum.DRIVER_TABLE_COUNT)
        );

        const applicantsData =
            this.selectedTab === TableStringEnum.APPLICANTS
                ? this.getTabData(TableStringEnum.APPLICANTS)
                : [];

        const driverActiveData =
            this.selectedTab === TableStringEnum.ACTIVE
                ? this.getTabData(TableStringEnum.ACTIVE)
                : [];

        const driverInactiveData =
            this.selectedTab === TableStringEnum.INACTIVE
                ? this.getTabData(TableStringEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: TableStringEnum.APPLICANTS,
                field: TableStringEnum.APPLICANTS,
                length: driverCount.applicant,
                data: applicantsData,
                extended: true,
                gridNameTitle: TableStringEnum.DRIVER_1,
                stateName: TableStringEnum.APPLICANTS,
                tableConfiguration: TableStringEnum.APPLICANT,
                driverArhivedArray: DataFilterHelper.checkSpecialFilterArray(
                    applicantsData,
                    TableStringEnum.ARCHIVED_DATA
                ),
                isActive: this.selectedTab === TableStringEnum.APPLICANTS,
                gridColumns: this.getGridColumns(
                    TableStringEnum.APPLICANTS,
                    TableStringEnum.APPLICANT,
                    applicantsData as DriverResponse[]
                ),
            },
            {
                title: TableStringEnum.ACTIVE,
                field: TableStringEnum.ACTIVE,
                length: driverCount.active,
                data: driverActiveData,
                extended: false,
                gridNameTitle: TableStringEnum.DRIVER_1,
                stateName: TableStringEnum.DRIVER_2,
                tableConfiguration: TableStringEnum.DRIVER,
                isActive: this.selectedTab === TableStringEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    TableStringEnum.DRIVER_2,
                    TableStringEnum.DRIVER,
                    driverActiveData as DriverResponse[]
                ),
            },
            {
                title: TableStringEnum.INACTIVE,
                field: TableStringEnum.INACTIVE,
                length: driverCount.inactive,
                data: driverInactiveData,
                extended: false,
                gridNameTitle: TableStringEnum.DRIVER_1,
                stateName: TableStringEnum.DRIVER_2,
                tableConfiguration: TableStringEnum.DRIVER,
                isActive: this.selectedTab === TableStringEnum.INACTIVE,
                gridColumns: this.getGridColumns(
                    TableStringEnum.DRIVER_2,
                    TableStringEnum.DRIVER,
                    driverInactiveData as DriverResponse[]
                ),
            },
        ];

        const td = this.tableData.find(
            (tableData) => tableData.field === this.selectedTab
        );

        this.setDriverData(td);
        this.updateCardView();
    }

    private getTabData(dataType: string): DriversInactiveState[] {
        if (dataType === TableStringEnum.ACTIVE) {
            this.driversActive = this.driversActiveQuery.getAll();

            return this.driversActive?.length ? this.driversActive : [];
        } else if (dataType === TableStringEnum.INACTIVE) {
            this.inactiveTabClicked = true;

            this.driversInactive = this.driversInactiveQuery.getAll();

            return this.driversInactive?.length ? this.driversInactive : [];
        } else if (TableStringEnum.APPLICANTS) {
            this.applicantTabActive = true;

            this.activeTab = TableStringEnum.APPLICANTS;

            this.applicantData = this.applicantQuery.getAll();

            return this.applicantData?.length ? this.applicantData : [];
        }
    }

    private getGridColumns(
        activeTab: string,
        configType: string,
        data?: DriverResponse[]
    ): void {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (activeTab === TableStringEnum.APPLICANTS)
            return tableColumnsConfig ?? getDriverApplicantColumnsDefinition();

        return tableColumnsConfig ?? getDriverColumnsDefinition(data);
    }

    private setDriverData(tableData: CardTableData): void {
        this.columns = tableData.gridColumns;

        if (tableData.data.length) {
            this.viewData = tableData.data.map((data: any) => {
                return this.selectedTab === TableStringEnum.APPLICANTS
                    ? this.mapApplicantsData(data)
                    : this.mapDriverData(data);
            });

            // Set data for cards based on selected tab
            this.sendDataToCardsOnTabSwitch();

            // Get Tab Table Data For Selected Tab
            this.getSelectedTabTableData();
        } else {
            this.viewData = [];
        }

        this.driverTableData = this.viewData;
    }

    public sendDataToCardsOnTabSwitch(): void {
        switch (this.selectedTab) {
            case TableStringEnum.INACTIVE:
                this.sendDataToCardsFront = this.displayRowsFront;
                this.sendDataToCardsBack = this.displayRowsBack;

                break;
            case TableStringEnum.APPLICANTS:
                this.sendDataToCardsFront = this.displayRowsFrontApplicants;
                this.sendDataToCardsBack = this.displayRowsBackApplicants;

                break;
            default:
                this.sendDataToCardsFront = this.displayRowsFront;
                this.sendDataToCardsBack = this.displayRowsBack;

                break;
        }
    }

    private setTruckTooltipColor(truckName: string): string {
        if (truckName === TruckNameStringEnum.SEMI_TRUCK) {
            return TooltipColorsStringEnum.LIGHT_GREEN;
        } else if (truckName === TruckNameStringEnum.SEMI_SLEEPER) {
            return TooltipColorsStringEnum.YELLOW;
        } else if (truckName === TruckNameStringEnum.BOX_TRUCK) {
            return TooltipColorsStringEnum.RED;
        } else if (truckName === TruckNameStringEnum.CARGO_VAN) {
            return TooltipColorsStringEnum.BLUE;
        } else if (truckName === TruckNameStringEnum.CAR_HAULER) {
            return TooltipColorsStringEnum.PINK;
        } else if (truckName === TruckNameStringEnum.TOW_TRUCK) {
            return TooltipColorsStringEnum.PURPLE;
        } else if (truckName === TruckNameStringEnum.SPOTTER) {
            return TooltipColorsStringEnum.BROWN;
        }
    }

    private setTrailerTooltipColor(trailerName: string): string {
        if (trailerName === TrailerNameStringEnum.REEFER) {
            return TooltipColorsStringEnum.BLUE;
        } else if (trailerName === TrailerNameStringEnum.DRY_VAN) {
            return TooltipColorsStringEnum.DARK_BLUE;
        } else if (trailerName === TrailerNameStringEnum.TANKER) {
            return TooltipColorsStringEnum.GREEN;
        } else if (trailerName === TrailerNameStringEnum.PNEUMATIC_TANKER) {
            return TooltipColorsStringEnum.LIGHT_GREEN;
        } else if (trailerName === TrailerNameStringEnum.CAR_HAULER) {
            return TooltipColorsStringEnum.PINK;
        } else if (trailerName === TrailerNameStringEnum.CAR_HAULER_STINGER) {
            return TooltipColorsStringEnum.PINK;
        } else if (trailerName === TrailerNameStringEnum.CHASSIS) {
            return TooltipColorsStringEnum.BROWN;
        } else if (trailerName === TrailerNameStringEnum.LOW_BOY_RGN) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.STEP_DECK) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.FLAT_BED) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.SIDE_KIT) {
            return TooltipColorsStringEnum.ORANGE;
        } else if (trailerName === TrailerNameStringEnum.CONESTOGA) {
            return TooltipColorsStringEnum.GOLD;
        } else if (trailerName === TrailerNameStringEnum.CONTAINER) {
            return TooltipColorsStringEnum.YELLOW;
        }
    }

    private mapDriverData(data: any): any {
        const {
            id,
            status,
            owner,
            name,
            avatarFile,
            dateOfBirth,
            ssn,
            phone,
            email,
            address,
            driverType,
            solo,
            team,
            payType,
            bank,
            offDutyLocations,
            emergencyContact,
            twicExpirationDate,
            fuelCardNumber,
            cdl,
            test,
            medical,
            mvr,
            general,
            payroll,
            hiredAt,
            terminatedAt,
            createdAt,
            updatedAt,
            fileCount,
            trailer,
            truck,
            trailerType,
            truckType,
        } = data;

        if (!avatarFile?.url) this.mapingIndex++;

        return {
            id,
            status,
            isSelected: false,
            isOwner: !!owner,
            textShortName: this.nameInitialsPipe.transform(name),
            avatarColor: AvatarColorsHelper.getAvatarColors(this.mapingIndex),
            avatarImg: avatarFile?.url ?? null,
            fullName: name,
            tableDOB:
                MethodsCalculationsHelper.convertDateFromBackend(dateOfBirth),
            ssn,
            phone,
            email,
            tableAddress: address?.address,
            tableOwnerDetailsType: owner?.type,
            tableOwnerDetailsBusinesName: owner?.name,
            tableOwnerDetailsEin: owner?.ein,
            tableDriverType: driverType?.name,
            tablePayrollDetailType: payType?.name,

            emptyMileSolo:
                solo?.emptyMile &&
                TableStringEnum.DOLLAR_SIGN + solo?.emptyMile,
            loadedMileSolo:
                solo?.loadedMile &&
                TableStringEnum.DOLLAR_SIGN + solo?.loadedMile,
            perStopSolo:
                solo?.perStop && TableStringEnum.DOLLAR_SIGN + solo?.perStop,
            perMileSolo:
                solo?.perMile && TableStringEnum.DOLLAR_SIGN + solo?.perMile,
            flatRateSolo:
                solo?.flatRate && TableStringEnum.DOLLAR_SIGN + solo?.flatRate,
            commissionSolo:
                solo?.commission && solo?.commission + TableStringEnum.PERCENTS,

            emptyMileTeam:
                team?.emptyMile &&
                TableStringEnum.DOLLAR_SIGN + team?.emptyMile,
            loadedMileTeam:
                team?.loadedMile &&
                TableStringEnum.DOLLAR_SIGN + team?.loadedMile,
            perStopTeam:
                team?.perStop && TableStringEnum.DOLLAR_SIGN + team?.perStop,
            perMileTeam:
                team?.perMile && TableStringEnum.DOLLAR_SIGN + team?.perMile,
            flatRateTeam:
                team?.flatRate && TableStringEnum.DOLLAR_SIGN + team?.flatRate,
            commissionTeam:
                team?.commission && team?.commission + TableStringEnum.PERCENTS,

            tableBankDetailBankName: bank?.name,
            tableBankDetailRouting: bank?.routing,
            tableBankDetailAccount: bank?.account,
            tableOffDutyLocation: offDutyLocations,
            tableEmergContactName: emergencyContact?.name,
            tableEmergContactRelation: emergencyContact?.relationship,
            tableEmergContactPhone: emergencyContact?.phone,
            tableTwicExp: twicExpirationDate
                ? MethodsCalculationsHelper.convertDateFromBackend(
                      twicExpirationDate
                  )
                : null,
            tableFuelCardDetailNumber: fuelCardNumber,
            tableCdlDetailNumber: cdl?.number,
            tableCdlDetailState: cdl?.state,
            tableCdlDetailRestriction: cdl?.restrictions,
            tableCdlDetailEndorsment: cdl?.endorsements,
            tableCdlDetailExpiration: {
                expirationDays: cdl?.expirationDays ?? null,
                expirationDaysText: cdl?.expirationDays
                    ? this.thousandSeparator.transform(cdl?.expirationDays)
                    : null,
                percentage: cdl?.percentage ? 100 - cdl?.percentage : null,
            },
            tableTestDetailsIssued:
                MethodsCalculationsHelper.convertDateFromBackend(test?.date),
            tableTestDetailsType: test?.type,
            tableTestDetailsReason: test?.reason,
            tableTestDetailsResult: test?.result,
            tableMedicalData: {
                expirationDays: medical?.expirationDays ?? null,
                expirationDaysText: medical?.expirationDays
                    ? this.thousandSeparator.transform(medical?.expirationDays)
                    : null,
                percentage: medical?.percentage
                    ? 100 - medical?.percentage
                    : null,
            },
            tableMvrDetailsRenewalTerm: mvr?.expiration,
            tableAssignedUnitTrailer: {
                text: trailer,
                type: trailerType,
                color: this.setTrailerTooltipColor(trailerType),
                hover: false,
            },
            tableAssignedUnitTruck: {
                text: truck,
                type: truckType,
                color: this.setTruckTooltipColor(truckType),
                hover: false,
            },

            tableMvrDetailsExpiration: {
                expirationDays: mvr?.expirationDays ?? null,
                expirationDaysText: mvr?.expirationDays
                    ? this.thousandSeparator.transform(mvr?.expirationDays)
                    : null,
                percentage: mvr?.percentage ? 100 - mvr?.percentage : null,
            },
            tabelNotificationGeneral: `${
                general?.mail
                    ? TableStringEnum.EMAIL
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                general?.push
                    ? TableStringEnum.PUSH
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                general?.sms
                    ? TableStringEnum.SMS
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }`,
            tabelNotificationPayroll: `${
                payroll?.mail
                    ? TableStringEnum.EMAIL
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                payroll?.push
                    ? TableStringEnum.PUSH
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                payroll?.sms
                    ? TableStringEnum.SMS
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }`,
            tabelHired:
                MethodsCalculationsHelper.convertDateFromBackend(hiredAt),
            tableTerminated:
                terminatedAt &&
                MethodsCalculationsHelper.convertDateFromBackend(terminatedAt),
            tableAdded:
                MethodsCalculationsHelper.convertDateFromBackend(createdAt),
            tableEdited:
                MethodsCalculationsHelper.convertDateFromBackend(updatedAt),
            tableAttachments: data?.files,
            fileCount: fileCount,
            tableDropdownContent: this.getDriverDropdownContent(),
        };
    }

    private mapApplicantsData(data: any): any {
        const {
            id,
            name,
            doB,
            ssn,
            phone,
            email,
            applicationStatus,
            mvrStatus,
            pspStatus,
            sphStatus,
            hosStatus,
            medicalDaysLeft,
            medicalPercentage,
            invitedDate,
            acceptedDate,
            archivedDate,
            review,
        } = data;

        return {
            id,
            isSelected: false,
            name,
            tableDOB: doB
                ? MethodsCalculationsHelper.convertDateFromBackend(doB)
                : null,
            ssn,
            phone,
            email,
            tableApplicantProgress: [
                {
                    title: TableStringEnum.APP,
                    status: applicationStatus,
                },
                {
                    title: TableStringEnum.OWN,
                    status: null,
                },
                {
                    title: TableStringEnum.MED,
                    status: null,
                },
                {
                    title: TableStringEnum.MVR,
                    status: mvrStatus,
                },
                {
                    title: TableStringEnum.PSP,
                    status: pspStatus,
                },
                {
                    title: TableStringEnum.SPH,
                    status: sphStatus,
                },
                {
                    title: TableStringEnum.HOS,
                    status: hosStatus,
                },
                {
                    title: TableStringEnum.TEST,
                    status: null,
                },
            ],
            tableMedicalData: {
                expirationDays: medicalDaysLeft ?? null,
                expirationDaysText: medicalDaysLeft
                    ? this.thousandSeparator.transform(medicalDaysLeft)
                    : null,
                percentage: medicalPercentage ? 100 - medicalPercentage : null,
            },
            tableInvited: invitedDate
                ? MethodsCalculationsHelper.convertDateFromBackend(invitedDate)
                : null,
            tableAccepted: acceptedDate
                ? MethodsCalculationsHelper.convertDateFromBackend(acceptedDate)
                : null,
            tableArchived: archivedDate
                ? MethodsCalculationsHelper.convertDateFromBackend(archivedDate)
                : null,
            tableRev: {
                title: TableStringEnum.INCOMPLETE,
                iconLink:
                    'assets/svg/truckassist-table/applicant-wrong-icon.svg',
            },
            hire: false,
            isFavorite: false,
            tableDropdownContent: {
                hasContent: true,
                content: this.getApplicantDropdownContent(
                    archivedDate,
                    applicationStatus,
                    review
                ),
            },
        };
    }

    private getDriverDropdownContent(): DropdownItem[] {
        return DropdownMenuContentHelper.getDriverDropdownContent(
            this.selectedTab
        );
    }

    private getApplicantDropdownContent(
        archivedDate: string,
        applicationStatus: string,
        review: string
    ): DropdownItem[] {
        return DropdownMenuContentHelper.getApplicantDropdownContent(
            archivedDate,
            applicationStatus,
            review
        );
    }

    private updateDataCount(): void {
        const driverCount = JSON.parse(
            localStorage.getItem(TableStringEnum.DRIVER_TABLE_COUNT)
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[1].length = driverCount.active;
        updatedTableData[2].length = driverCount.inactive;

        this.tableData = [...updatedTableData];
    }

    // Get Driver Back Filter
    private driverBackFilter(
        filter: {
            active: number;
            long: number;
            lat: number;
            distance: number;
            pageIndex: number;
            pageSize: number;
            companyId: number | undefined;
            sort: string | undefined;
            searchOne: string | undefined;
            searchTwo: string | undefined;
            searchThree: string | undefined;
        },
        isShowMore?: boolean
    ): void {
        this.driverService
            .getDrivers(
                filter.active,
                filter.long,
                filter.lat,
                filter.distance,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((drivers: DriverListResponse) => {
                if (!isShowMore) {
                    this.viewData = drivers.pagination.data;

                    this.viewData = this.viewData.map((data) => {
                        return this.mapDriverData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    drivers.pagination.data.map((data) => {
                        newData.push(this.mapDriverData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    private applicantBackFilter(
        filter: {
            applicantSpecParamsArchived: boolean | undefined;
            applicantSpecParamsHired: boolean | undefined;
            applicantSpecParamsFavourite: boolean | undefined;
            applicantSpecParamsPageIndex: number;
            applicantSpecParamsPageSize: number;
            applicantSpecParamsCompanyId: number | undefined;
            applicantSpecParamsSort: string | undefined;
            searchOne: string | undefined;
            searchTwo: string | undefined;
            searchThree: string | undefined;
        },
        isShowMore?: boolean
    ): void {
        this.applicantService
            .getApplicantAdminList(
                filter.applicantSpecParamsArchived,
                filter.applicantSpecParamsHired,
                filter.applicantSpecParamsFavourite,
                filter.applicantSpecParamsPageIndex,
                filter.applicantSpecParamsPageSize,
                filter.applicantSpecParamsCompanyId,
                filter.applicantSpecParamsSort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((applicant) => {
                if (!isShowMore) {
                    this.viewData = applicant.pagination.data;

                    this.viewData = this.viewData.map((data) => {
                        return this.mapApplicantsData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    applicant.pagination.data.map((data) => {
                        newData.push(this.mapApplicantsData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    public onToolBarAction(event: TableToolbarActions): void {
        // Open Modal
        if (event.action === TableStringEnum.OPEN_MODAL) {
            if (this.selectedTab === TableStringEnum.APPLICANTS) {
                this.modalService.openModal(ApplicantModalComponent, {
                    size: TableStringEnum.SMALL,
                });
            } else {
                this.modalService.openModal(DriverModalComponent, {
                    size: TableStringEnum.MEDIUM,
                });
            }
        }
        // Select Tab
        else if (event.action === TableStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;
            this.mapingIndex = 0;

            this.driverBackFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
            this.driverBackFilterQuery.pageIndex = 1;

            this.applicantBackFilterQuery.applicantSpecParamsPageIndex = 1;

            // Driver Inactive Api Call
            if (
                this.selectedTab === TableStringEnum.INACTIVE &&
                !this.inactiveTabClicked
            ) {
                this.driverService
                    .getDrivers(0, undefined, undefined, undefined, 1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((driverPagination) => {
                        this.driversInactiveStore.set(
                            driverPagination.pagination.data
                        );

                        this.sendDriverData();
                    });
            }
            // Applicants Api Call
            else if (
                this.selectedTab === TableStringEnum.APPLICANTS &&
                !this.applicantTabActive
            ) {
                this.applicantService
                    .getApplicantAdminList(
                        undefined,
                        undefined,
                        undefined,
                        1,
                        25
                    )
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((applicantPagination) => {
                        this.applicantStore.set(
                            applicantPagination.pagination.data
                        );

                        this.sendDriverData();
                    });
            }
            // Send Driver Data
            else {
                this.sendDriverData();
            }
        }
        // Change View Mode
        else if (event.action === TableStringEnum.VIEW_MODE) {
            this.mapingIndex = 0;

            this.activeViewMode = event.mode;
        } else if (event.action === TableStringEnum.ACTIVATE_ITEM) {
            let status = false;
            let mappedEvent = [];

            this.viewData.map((data) => {
                event.tabData.data.map((element) => {
                    if (data.id === element) {
                        status = data.status;

                        mappedEvent.push({
                            ...data,
                            name: data?.fullName,
                        });
                    }
                });
            });

            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    data: null,
                    array: mappedEvent,
                    subType: TableStringEnum.DRIVER_1,
                    type: status
                        ? TableStringEnum.DEACTIVATE_MULTIPLE
                        : TableStringEnum.ACTIVATE_MULTIPLE,
                    template: TableStringEnum.DRIVER_1,
                    tableType: TableStringEnum.DRIVER_2,
                }
            );
        }
    }

    public onTableHeadActions(event: TableHeadActions): void {
        if (event.action === TableStringEnum.SORT) {
            this.mapingIndex = 0;

            if (event.direction) {
                if (this.selectedTab === TableStringEnum.APPLICANTS) {
                    this.applicantBackFilterQuery.applicantSpecParamsPageIndex = 1;
                    this.applicantBackFilterQuery.applicantSpecParamsSort =
                        event.direction;

                    this.applicantBackFilter(this.applicantBackFilterQuery);
                } else {
                    this.driverBackFilterQuery.active =
                        this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
                    this.driverBackFilterQuery.pageIndex = 1;
                    this.driverBackFilterQuery.sort = event.direction;
                    this.driverBackFilter(this.driverBackFilterQuery);
                }
            } else {
                this.sendDriverData();
            }
        }
    }

    // Get Tab Table Data For Selected Tab
    public getSelectedTabTableData(): void {
        if (this.tableData?.length) {
            this.activeTableData = this.tableData.find(
                (tab) => tab.field === this.selectedTab
            );
        }
    }

    private changeDriverStatus(id: number): void {
        this.driverService
            .changeDriverStatus(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private changeDriverStatusList(ids: number[]): void {
        this.driverService
            .changeDriverListStatus(ids, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteDriverById(id: number): void {
        this.driverService
            .deleteDriverById(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((driver) => {
                        if (driver.id === id) {
                            driver.actionAnimation = TableStringEnum.DELETE;
                        }

                        return driver;
                    });

                    this.updateDataCount();

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                true,
                                this.viewData
                            );

                        clearInterval(interval);
                    }, 900);
                },
            });
    }

    private multipleDeleteDrivers(driverIds: number[]): void {
        this.driverService
            .deleteDriverList(driverIds)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((driver) => {
                    driverIds.map((id) => {
                        if (driver.id === id) {
                            driver.actionAnimation =
                                TableStringEnum.DELETE_MULTIPLE;
                        }
                    });

                    return driver;
                });

                this.updateDataCount();

                const interval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

                    clearInterval(interval);
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    public updateCardView(): void {
        switch (this.selectedTab) {
            case TableStringEnum.ACTIVE:
                this.displayRows$ = this.store.pipe(
                    select(selectActiveTabCards)
                );
                break;

            case TableStringEnum.INACTIVE:
                this.displayRows$ = this.store.pipe(
                    select(selectInactiveTabCards)
                );
                break;
            case TableStringEnum.APPLICANTS:
                this.displayRows$ = this.store.pipe(
                    select(selectDriverApplicantTabCards)
                );
                break;
            default:
                break;
        }
        this.driverCardsModalService.updateTab(this.selectedTab);
    }

    public handleShowMoreAction(): void {
        if (this.selectedTab === TableStringEnum.APPLICANTS) {
            this.applicantBackFilterQuery.applicantSpecParamsPageIndex++;

            this.applicantBackFilter(this.applicantBackFilterQuery, true);
        } else {
            this.driverBackFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
            this.driverBackFilterQuery.pageIndex++;
            this.driverBackFilter(this.driverBackFilterQuery, true);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();
    }
}
