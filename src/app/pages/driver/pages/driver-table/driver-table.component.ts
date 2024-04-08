import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { forkJoin, map, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

// Components
import { DriverModalComponent } from 'src/app/pages/driver/pages/driver-modals/driver-modal/driver-modal.component';
import { DriverCdlModalComponent } from 'src/app/pages/driver/pages/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from 'src/app/pages/driver/pages/driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from 'src/app/pages/driver/pages/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from 'src/app/pages/driver/pages/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ApplicantModalComponent } from 'src/app/pages/applicant/pages/applicant-modal/applicant-modal.component';

// Services
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { DriverService } from '../../services/driver.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { ImageBase64Service } from 'src/app/shared/services/image-base64.service';
import { ConfirmationService } from 'src/app/shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ApplicantService } from '../../../../shared/services/applicant.service';
import { AddressService } from 'src/app/shared/services/address.service';

// Queries
import { DriversActiveQuery } from '../../state/driver-active-state/driver-active.query';
import { ApplicantTableQuery } from '../../state/applicant-state/applicant-table.query';

// Store
import { DriversActiveState } from '../../state/driver-active-state/driver-active.store';
import {
    DriversInactiveState,
    DriversInactiveStore,
} from '../../state/driver-inactive-state/driver-inactive.store';
import { DriversInactiveQuery } from '../../state/driver-inactive-state/driver-inactive.query';
import { ApplicantTableStore } from '../../state/applicant-state/applicant-table.store';

// Pipes
import { DatePipe } from '@angular/common';
import { NameInitialsPipe } from 'src/app/shared/pipes/name-initials.pipe';
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';

// Modals
import { MappedApplicantData } from './models/mapped-applicant-data.model';
import { FilterOptionApplicant } from 'src/app/pages/driver/pages/driver-table/models/filter-option-applicant.model';
import { TableHeadActions } from 'src/app/pages/driver/pages/driver-table/models/table-head-actions.model';
import { TableBodyActions } from 'src/app/pages/driver/pages/driver-table/models/table-body-actions.model';
import { AvatarColors } from 'src/app/pages/driver/pages/driver-table/models/avatar-colors.model';
import { FilterOptionDriver } from 'src/app/pages/driver/pages/driver-table/models/filter-option-driver.model';
import { CardTableData } from 'src/app/shared/models/table-models/card-table-data.model';
import {
    ApplicantShortResponse,
    DriverListResponse,
    DriverResponse,
} from 'appcoretruckassist';
import { getLoadModalColumnDefinition } from 'src/assets/utils/settings/modal-columns-configuration/table-load-modal-columns';
import { getApplicantColumnsDefinition } from 'src/assets/utils/settings/applicant-columns';
import { getDriverColumnsDefinition } from 'src/assets/utils/settings/driver-columns';

// Globals
import { MethodsGlobalHelper } from 'src/app/shared/utils/helpers/methods-global.helper';
import { CardRows } from 'src/app/shared/models/card-models/card-rows.model';

import {
    DropdownItem,
    GridColumn,
} from 'src/app/shared/models/card-models/card-table-data.model';
import { TableToolbarActions } from 'src/app/shared/models/table-models/table-toolbar-actions.model';

// Enums
import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';

// Constants
import { TableDropdownComponentConstants } from 'src/app/shared/utils/constants/table-dropdown-component.constants';
import { DriverTableConfiguration } from './utils/constants/driver-table-configuration.constants';

//Helpers
import { DataFilterHelper } from 'src/app/shared/utils/helpers/data-filter.helper';

@Component({
    selector: 'app-driver-table',
    templateUrl: './driver-table.component.html',
    styleUrls: ['./driver-table.component.scss'],
    providers: [NameInitialsPipe, ThousandSeparatorPipe],
})
export class DriverTableComponent implements OnInit, AfterViewInit, OnDestroy {
    public driverTableData: any[] = [];
    private destroy$ = new Subject<void>();
    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: GridColumn[] = [];
    public selectedTab: string = TableStringEnum.ACTIVE;
    public activeViewMode: string = TableStringEnum.LIST;
    public driversActive: DriversActiveState[] = [];
    public driversInactive: DriversInactiveState[] = [];
    public applicantData: ApplicantShortResponse[] = [];
    public loadingPage: boolean = true;
    public inactiveTabClicked: boolean = false;
    public applicantTabActive: boolean = false;
    public activeTableData: CardTableData;
    public driverBackFilterQuery: FilterOptionDriver =
        TableDropdownComponentConstants.DRIVER_BACK_FILTER;
    public applicantBackFilterQuery: FilterOptionApplicant =
        TableDropdownComponentConstants.APPLICANT_BACK_FILTER;
    public resizeObserver: ResizeObserver;
    public mapingIndex: number = 0;
    public isSearching: boolean = false;
    //Data to display from model Active & Inactive
    public displayRowsFront: CardRows[] =
        DriverTableConfiguration.displayRowsActiveFront;
    public displayRowsBack: CardRows[] =
        DriverTableConfiguration.displayRowsActiveBack;

    //Data to display from model Applicants
    public displayRowsFrontApplicants: CardRows[] =
        DriverTableConfiguration.displayRowsFrontApplicants;
    public displayRowsBackApplicants: CardRows[] =
        DriverTableConfiguration.displayRowsBackApplicants;

    //Title
    public cardTitle: string = DriverTableConfiguration.cardTitle;

    // Page
    public page: string = DriverTableConfiguration.page;

    public activeTab: string;
    //  Number of rows in card
    public rows: number = DriverTableConfiguration.rows;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    constructor(
        private addressService: AddressService,
        private applicantService: ApplicantService,
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private driverService: DriverService,
        private imageBase64Service: ImageBase64Service,
        private confirmationService: ConfirmationService,
        private driversActiveQuery: DriversActiveQuery,
        private driversInactiveQuery: DriversInactiveQuery,
        private applicantQuery: ApplicantTableQuery,
        public datePipe: DatePipe,
        private nameInitialsPipe: NameInitialsPipe,
        private thousandSeparator: ThousandSeparatorPipe,
        private driversInactiveStore: DriversInactiveStore,
        private applicantStore: ApplicantTableStore,
        private router: Router
    ) {}

    // ---------------------------- ngOnInit ------------------------------
    ngOnInit(): void {
        this.modalTestInitialization();

        this.sendDriverData();

        this.setTableFilter();

        this.confiramtionSubscribe();

        this.getSelectedTabTableData();

        this.resetColumns();

        this.resize();

        this.toogleColumns();

        this.search();

        this.deleteSelectedRow();

        this.driverActions();

        this.loadingPage = false;
    }

    // ---------------------------- ngAfterViewInit ------------------------------
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observeTableContainer();
        }, 10);
    }

    // Confirmation Subscribe
    private confiramtionSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case TableStringEnum.DELETE: {
                            if (res.template === TableStringEnum.DRIVER) {
                                this.deleteDriverById(res.id);
                            }
                            break;
                        }
                        case TableStringEnum.ACTIVATE: {
                            this.changeDriverStatus(res.id);
                            break;
                        }
                        case TableStringEnum.DEACTIVATE: {
                            this.changeDriverStatus(res.id);
                            break;
                        }
                        case TableStringEnum.MULTIPLE_DELETE: {
                            this.multipleDeleteDrivers(res.array);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
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
                                        .getAddressInfo(
                                            repairData.address.address
                                        )
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
                if (response && !this.loadingPage) {
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
        this.tableService.currentSearchTableData
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
                if (response.length && !this.loadingPage) {
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
            .subscribe((res) => {
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

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
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

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
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

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        this.viewData.splice(driverIndex, 1);
                        clearInterval(inetval);
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

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        this.viewData.splice(driverIndex, 1);
                        clearInterval(inetval);
                    }, 900);
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
                    TableStringEnum.APPLICANT
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
                    TableStringEnum.DRIVER
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
                    TableStringEnum.DRIVER
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setDriverData(td);
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

    private getGridColumns(activeTab: string, configType: string): void {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (activeTab === TableStringEnum.APPLICANTS) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getApplicantColumnsDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getDriverColumnsDefinition();
        }
    }

    private setDriverData(tdata: CardTableData): void {
        this.columns = tdata.gridColumns;

        if (tdata.data.length) {
            this.viewData = tdata.data;

            this.viewData = this.viewData.map((data: any) => {
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
                this.cardTitle = TableStringEnum.NAME;
                this.sendDataToCardsFront = this.displayRowsFrontApplicants;
                this.sendDataToCardsBack = this.displayRowsBackApplicants;
                break;

            default:
                this.sendDataToCardsFront = this.displayRowsFront;
                this.sendDataToCardsBack = this.displayRowsBack;
                break;
        }
    }

    // TODO find model for this data
    private mapDriverData(data): DriverResponse {
        if (!data?.avatar) this.mapingIndex++;

        return {
            ...data,
            isSelected: false,
            isOwner: data?.owner ? data.owner : false,
            textShortName: this.nameInitialsPipe.transform(data.fullName),
            avatarColor: this.getAvatarColors(),
            avatarImg: data?.avatar
                ? this.imageBase64Service.sanitizer(data.avatar)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAddress: data.address.address
                ? data.address.address
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDOB: data.dateOfBirth
                ? this.datePipe.transform(
                      data.dateOfBirth,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAssignedUnitTruck: TableStringEnum.NA,
            tableAssignedUnitTruckType: TableStringEnum.NA,
            tableAssignedUnitTrailer: TableStringEnum.NA,
            tableAssignedUnitTrailerType: TableStringEnum.NA,
            tablePayrollDetailType: data?.payType?.name
                ? data.payType.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableBankDetailBankName: data?.bank?.name
                ? data.bank.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableBankDetailRouting: data.routing
                ? data.routing
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableOwnerDetailsType: data?.owner?.ownerType?.name
                ? data.owner.ownerType.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableOwnerDetailsBusinesName: data?.owner?.name
                ? data.owner.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableOwnerDetailsEin: data?.owner?.ssnEin
                ? data.owner.ssnEin
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableOffDutyLocation: TableStringEnum.NA,
            tableEmergContact: data?.emergencyContactPhone
                ? data.emergencyContactPhone
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTwicExp: TableStringEnum.NA,
            tableFuelCardDetailNumber: data?.fuelCard
                ? data.fuelCard
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableFuelCardDetailType: TableStringEnum.NA,
            tableFuelCardDetailAccount: TableStringEnum.NA,
            tableCdlDetailNumber: data?.cdlNumber
                ? data.cdlNumber
                : data?.cdls?.length
                ? data.cdls[0].cdlNumber
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableCdlDetailState: data.address.stateShortName
                ? data.address.stateShortName
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableCdlDetailEndorsment: data.cdls
                ? data.cdls[0]?.cdlEndorsements.map(
                      (endorsement) => endorsement.code
                  )
                : null,
            tableCdlDetailRestriction: data.cdls
                ? data.cdls[0]?.cdlRestrictions.map(
                      (restriction) => restriction.code
                  )
                : null,
            tableCdlDetailExpiration: {
                expirationDays:
                    data?.cdlExpirationDays || data?.cdlExpirationDays === 0
                        ? data.cdlExpirationDays
                        : null,
                expirationDaysText: data?.cdlExpirationDays
                    ? this.thousandSeparator.transform(data.cdlExpirationDays)
                    : null,
                percentage:
                    data?.cdlPercentage || data?.cdlPercentage === 0
                        ? 100 - data.cdlPercentage
                        : null,
            },
            tableTestDetailsType: TableStringEnum.NA,
            tableTestDetailsReason: TableStringEnum.NA,
            tableTestDetailsIssued: TableStringEnum.NA,
            tableTestDetailsResult: TableStringEnum.NA,
            tableMedicalData: {
                expirationDays: data?.medicalExpirationDays
                    ? data.medicalExpirationDays
                    : null,
                expirationDaysText: data?.medicalExpirationDays
                    ? this.thousandSeparator.transform(
                          data.medicalExpirationDays
                      )
                    : null,
                percentage:
                    data?.medicalPercentage || data?.medicalPercentage === 0
                        ? 100 - data.medicalPercentage
                        : null,
            },
            tableMvrDetailsExpiration: {
                expirationDays: data?.mvrExpirationDays
                    ? data.mvrExpirationDays
                    : null,
                expirationDaysText: data?.mvrExpirationDays
                    ? this.thousandSeparator.transform(data.mvrExpirationDays)
                    : null,
                percentage:
                    data?.mvrPercentage || data?.mvrPercentage === 0
                        ? 100 - data.mvrPercentage
                        : null,
            },

            tabelNotificationGeneral: `${
                data?.general?.mailNotification
                    ? TableStringEnum.EMAIL
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.general?.pushNotification
                    ? TableStringEnum.PUSH
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.general?.smsNotification
                    ? TableStringEnum.SMS
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }`,
            tabelNotificationPayroll: `${
                data?.payroll?.mailNotification
                    ? TableStringEnum.EMAIL
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.payroll?.pushNotification
                    ? TableStringEnum.PUSH
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.payroll?.smsNotification
                    ? TableStringEnum.SMS
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER
            }`,
            tabelHired: data.hired
                ? this.datePipe.transform(
                      data.hired,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTerminated: TableStringEnum.NA,
            tableAdded: TableStringEnum.NA,
            tableEdited: TableStringEnum.NA,
            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownDriverContent(),
            },
        };
    }

    private mapApplicantsData(data: MappedApplicantData): MappedApplicantData {
        return {
            ...data,
            isSelected: false,
            tableInvited: data?.invitedDate
                ? this.datePipe.transform(
                      data.invitedDate,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAccepted: data?.acceptedDate
                ? this.datePipe.transform(
                      data.acceptedDate,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableDOB: data?.doB
                ? data.doB
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableApplicantProgress: [
                {
                    title: TableStringEnum.APP,
                    status: data.applicationStatus,
                    width: 34,
                    class: TableStringEnum.COMPLETE_ICON,
                    percentage: 34,
                },
                {
                    title: TableStringEnum.MVR,
                    status: data.mvrStatus,
                    width: 34,
                    class: TableStringEnum.COMPLETE_ICON,
                    percentage: 34,
                },
                {
                    title: TableStringEnum.PSP,
                    status: data.pspStatus,
                    width: 29,
                    class: TableStringEnum.COMPLETE_ICON,
                    percentage: 34,
                },
                {
                    title: TableStringEnum.SPH,
                    status: data.sphStatus,
                    width: 30,
                    class: TableStringEnum.COMPLETE_ICON,
                    percentage: 34,
                },
                {
                    title: TableStringEnum.HOS,
                    status: data.hosStatus,
                    width: 32,
                    class: TableStringEnum.DONE_ICON,
                    percentage: 34,
                },
                {
                    title: TableStringEnum.SSN,
                    status: data.ssnStatus,
                    width: 29,
                    class: TableStringEnum.WRONG_ICON,
                    percentage: 34,
                },
            ],
            tableMedical: {
                class: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                hideProgres: false,
                isApplicant: true,
                expirationDays: data?.medicalDaysLeft
                    ? this.thousandSeparator.transform(data.medicalDaysLeft)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                percentage: data?.medicalPercentage
                    ? data.medicalPercentage
                    : null,
            },
            tableCdl: {
                class: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                hideProgres: false,
                isApplicant: true,
                expirationDays: data?.cdlDaysLeft
                    ? this.thousandSeparator.transform(data.cdlDaysLeft)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                percentage: data?.cdlPercentage ? data.cdlPercentage : null,
            },
            tableRev: {
                title: TableStringEnum.INCOMPLETE,
                iconLink:
                    '../../../../../assets/svg/truckassist-table/applicant-wrong-icon.svg',
            },
            hire: false,
            isFavorite: false,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownApplicantContent(),
            },
        };
    }

    private getDropdownDriverContent(): DropdownItem[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
            },

            {
                title: TableStringEnum.VIEW_DETAILS_2,
                name: TableStringEnum.VIEW_DETAILS,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.SEND_MESSAGE_2,
                name: TableStringEnum.SEND_MESSAGE,
                svgUrl: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.REGULAR,
            },
            {
                title: TableStringEnum.ADD_NEW_2,
                name: TableStringEnum.ADD_NEW,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: TableStringEnum.ADD_CDL,
                        name: TableStringEnum.NEW_LICENCE,
                    },
                    {
                        title: TableStringEnum.ADD_MVR,
                        name: TableStringEnum.NEW_MVR,
                    },
                    {
                        title: TableStringEnum.MEDICAL_EXAM_3,
                        name: TableStringEnum.NEW_MEDICAL,
                    },
                    {
                        title: TableStringEnum.TEST_DRUG_ALCOHOL,
                        name: TableStringEnum.NEW_DRUG,
                    },
                ],
            },
            {
                title: TableStringEnum.REQUEST,
                name: TableStringEnum.ADD_TO_FAVORITES,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: TableStringEnum.REGULAR,
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: TableStringEnum.BACKGROUND_CHECK_2,
                        name: TableStringEnum.BACKGROUND_CHECK,
                    },
                    {
                        title: TableStringEnum.MEDICAL_EXAM_2,
                        name: TableStringEnum.MEDICAL_EXAM,
                    },
                    {
                        title: TableStringEnum.TEST_DRUG_ALCOHOL,
                        name: TableStringEnum.TEST_DRUG,
                    },
                    {
                        title: TableStringEnum.MVR_2,
                        name: TableStringEnum.TEST_MVR,
                    },
                ],
                hasBorder: true,
            },
            {
                title: TableStringEnum.SHARE_2,
                name: TableStringEnum.SHARE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.PRINT_2,
                name: TableStringEnum.PRINT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            {
                title:
                    this.selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE_2
                        : TableStringEnum.ACTIVATE_2,
                name: TableStringEnum.ACTIVATE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass:
                    this.selectedTab === TableStringEnum.ACTIVE
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    private getDropdownApplicantContent(): DropdownItem[] {
        return TableDropdownComponentConstants.DROPDOWN_APPLICANT;
    }

    // Get Avatar Color
    private getAvatarColors(): AvatarColors {
        const textColors: string[] =
            TableDropdownComponentConstants.TEXT_COLORS;

        const backgroundColors: string[] =
            TableDropdownComponentConstants.BACKGROUND_COLORS;

        this.mapingIndex = this.mapingIndex <= 11 ? this.mapingIndex : 0;

        return {
            background: backgroundColors[this.mapingIndex],
            color: textColors[this.mapingIndex],
        };
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
                forkJoin([
                    this.applicantService.getApplicantAdminList(
                        undefined,
                        undefined,
                        undefined,
                        1,
                        25
                    ),
                    this.tableService.getTableConfig(7),
                ])
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(([applicantPagination, tableConfig]) => {
                        if (tableConfig) {
                            const config = JSON.parse(tableConfig.config);

                            localStorage.setItem(
                                `table-${tableConfig.tableType}-Configuration`,
                                JSON.stringify(config)
                            );
                        }

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
                            data: {
                                ...data,
                                name: data?.fullName,
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
                    template: TableStringEnum.DRIVER,
                    type: status
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                    svg: true,
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

    public onTableBodyActions(event: TableBodyActions): void {
        const mappedEvent = {
            ...event,
            data: {
                ...event.data,
                name: event.data?.fullName,
            },
        };
        if (event.type === TableStringEnum.SHOW_MORE) {
            if (this.selectedTab === TableStringEnum.APPLICANTS) {
                this.applicantBackFilterQuery.applicantSpecParamsPageIndex++;

                this.applicantBackFilter(this.applicantBackFilterQuery, true);
            } else {
                this.driverBackFilterQuery.active =
                    this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
                this.driverBackFilterQuery.pageIndex++;

                this.driverBackFilter(this.driverBackFilterQuery, true);
            }
        } else if (event.type === TableStringEnum.EDIT) {
            if (this.selectedTab === TableStringEnum.APPLICANTS) {
                this.modalService.openModal(
                    ApplicantModalComponent,
                    {
                        size: TableStringEnum.SMALL,
                    },
                    {
                        id: 1,
                        type: TableStringEnum.EDIT,
                    }
                );
            } else {
                this.modalService.openModal(
                    DriverModalComponent,
                    { size: TableStringEnum.MEDIUM },
                    {
                        ...event,
                        disableButton: true,
                    }
                );
            }
        } else if (event.type === TableStringEnum.NEW_LICENCE) {
            this.modalService.openModal(
                DriverCdlModalComponent,
                { size: TableStringEnum.SMALL },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (event.type === TableStringEnum.VIEW_DETAILS) {
            this.router.navigate([`/list/driver/${event.id}/details`]);
        } else if (event.type === TableStringEnum.NEW_MEDICAL) {
            this.modalService.openModal(
                DriverMedicalModalComponent,
                {
                    size: TableStringEnum.SMALL,
                },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (event.type === TableStringEnum.NEW_MVR) {
            this.modalService.openModal(
                DriverMvrModalComponent,
                { size: TableStringEnum.SMALL },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (event.type === TableStringEnum.NEW_DRUG) {
            this.modalService.openModal(
                DriverDrugAlcoholModalComponent,
                {
                    size: TableStringEnum.SMALL,
                },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (event.type === TableStringEnum.ACTIVATE_ITEM) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.DRIVER,
                    type:
                        event.data.status === 1
                            ? TableStringEnum.DEACTIVATE
                            : TableStringEnum.ACTIVATE,
                    image: true,
                }
            );
        } else if (event.type === TableStringEnum.DELETE_ITEM) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.DRIVER,
                    type: TableStringEnum.DELETE,
                    image: true,
                }
            );
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

    // Show More Data
    public onShowMore(): void {
        this.onTableBodyActions({
            type: TableStringEnum.SHOW_MORE,
        });
    }

    private changeDriverStatus(id: number): void {
        this.driverService
            .changeDriverStatus(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
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

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                true,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 900);
                },
                error: () => {},
            });
    }

    // This function gets called but service deleteDriverList is commented out so it will not delete any drivers
    private multipleDeleteDrivers(response: DriverResponse[]): void {
        this.driverService
            .deleteDriverList(response)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((driver) => {
                    response.map((id) => {
                        if (driver.id === id) {
                            driver.actionAnimation =
                                TableStringEnum.DELETE_MULTIPLE;
                        }
                    });

                    return driver;
                });

                this.updateDataCount();

                const inetval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

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
        // this.resizeObserver.unobserve(
        //     document.querySelector(TableStringEnum.TABLE_CONTAINER)
        // );
        this.resizeObserver.disconnect();
    }

    // This is added probably for modal and unfinished
    modalColumns: any[] = [];
    modalViewData: any[] = [];

    private modalTestInitialization() {
        this.modalColumns = getLoadModalColumnDefinition();

        for (let i = 0; i < 3; i++) {
            this.modalViewData.push({
                tableDescription: {
                    text: 'Jaffa Cakes',
                    extraText: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                },
                tableQuantity: {
                    text: 230,
                    extraText: 'Boxes',
                },
                tableBolNo: {
                    text: 1598550,
                    extraText: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                },
                tableWeight: {
                    text: '2,360',
                    extraText: 'lbs',
                },
                tableAction: TableStringEnum.DELETE,
            });
        }
    }
}
