import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { forkJoin, Subject, takeUntil } from 'rxjs';

// Components
import { DriverModalComponent } from '../../modals/driver-modal/driver-modal.component';
import { DriverCdlModalComponent } from '../../modals/driver-modal/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../../modals/driver-modal/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../../modals/driver-modal/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../../modals/driver-modal/driver-mvr-modal/driver-mvr-modal.component';
import {
    Confirmation,
    ConfirmationModalComponent,
} from '../../modals/confirmation-modal/confirmation-modal.component';
import { ApplicantModalComponent } from '../../modals/applicant-modal/applicant-modal.component';

// Services
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DriverTService } from '../state/driver.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { ImageBase64Service } from '../../../utils/base64.image';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { ApplicantTService } from '../state/applicant.service';

// Queries
import { DriversActiveQuery } from '../state/driver-active-state/driver-active.query';
import { ApplicantTableQuery } from '../state/applicant-state/applicant-table.query';

// Store
import { DriversActiveState } from '../state/driver-active-state/driver-active.store';
import {
    DriversInactiveState,
    DriversInactiveStore,
} from '../state/driver-inactive-state/driver-inactive.store';
import { DriversInactiveQuery } from '../state/driver-inactive-state/driver-inactive.query';
import { ApplicantTableStore } from '../state/applicant-state/applicant-table.store';

// Pipes
import { DatePipe } from '@angular/common';
import { NameInitialsPipe } from '../../../pipes/nameinitials';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';

// Modals
import {
    AvatarColors,
    FilterOptionApplicant,
    FilterOptionDriver,
    OnTableBodyActionsModal,
    OnTableHeadActionsModal,
    MappedApplicantData,
} from '../../shared/model/table-components/driver-modal';
import { DataForCardsAndTables } from '../../shared/model/table-components/all-tables.modal';
import {
    ApplicantShortResponse,
    DriverListResponse,
    DriverResponse,
} from 'appcoretruckassist';
import { getLoadModalColumnDefinition } from 'src/assets/utils/settings/modal-columns-configuration/table-load-modal-columns';
import { getApplicantColumnsDefinition } from '../../../../../assets/utils/settings/applicant-columns';
import { getDriverColumnsDefinition } from '../../../../../assets/utils/settings/driver-columns';

// Globals
import {
    tableSearch,
    closeAnimationAction,
} from '../../../utils/methods.globals';
import { CardRows } from '../../shared/model/cardData';
import { DisplayDriverConfiguration } from '../driver-card-data';
import {
    DropdownItem,
    GridColumn,
    ToolbarActions,
} from '../../shared/model/cardTableData';

// Enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

// Constants
import {
    TableDriverColorsConstants,
    TableDropdownDriverComponentConstants,
} from 'src/app/core/utils/constants/table-components.constants';
import { checkSpecialFilterArray } from 'src/app/core/helpers/dataFilter';

@Component({
    selector: 'app-driver-table',
    templateUrl: './driver-table.component.html',
    styleUrls: ['./driver-table.component.scss'],
    providers: [NameInitialsPipe, TaThousandSeparatorPipe],
})
export class DriverTableComponent implements OnInit, AfterViewInit, OnDestroy {
    driverTableData: any[] = [];
    private destroy$ = new Subject<void>();
    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: GridColumn[] = [];
    public selectedTab: string = ConstantStringTableComponentsEnum.ACTIVE;
    public activeViewMode: string = ConstantStringTableComponentsEnum.LIST;
    public driversActive: DriversActiveState[] = [];
    public driversInactive: DriversInactiveState[] = [];
    public applicantData: ApplicantShortResponse[] = [];
    public loadingPage: boolean = true;
    public inactiveTabClicked: boolean = false;
    public applicantTabActive: boolean = false;
    public activeTableData: DataForCardsAndTables;
    public driverBackFilterQuery: FilterOptionDriver =
        TableDropdownDriverComponentConstants.DRIVER_BACK_FILTER;
    public applicantBackFilterQuery: FilterOptionApplicant =
        TableDropdownDriverComponentConstants.APPLICANT_BACK_FILTER;
    public resizeObserver: ResizeObserver;
    public mapingIndex: number = 0;

    //Data to display from model Active
    public displayRowsFront: CardRows[] =
        DisplayDriverConfiguration.displayRowsActiveFront;
    public displayRowsBack: CardRows[] =
        DisplayDriverConfiguration.displayRowsActiveBack;

    //Title
    public cardTitle: string = DisplayDriverConfiguration.cardTitle;

    // Page
    public page: string = DisplayDriverConfiguration.page;

    //  Number of rows in card
    public rows: number = DisplayDriverConfiguration.rows;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    constructor(
        private applicantService: ApplicantTService,
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private driverTService: DriverTService,
        private imageBase64Service: ImageBase64Service,
        private confirmationService: ConfirmationService,
        private driversActiveQuery: DriversActiveQuery,
        private driversInactiveQuery: DriversInactiveQuery,
        private applicantQuery: ApplicantTableQuery,
        public datePipe: DatePipe,
        private nameInitialsPipe: NameInitialsPipe,
        private thousandSeparator: TaThousandSeparatorPipe,
        private driversInactiveStore: DriversInactiveStore,
        private applicantStore: ApplicantTableStore
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
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case ConstantStringTableComponentsEnum.DELETE: {
                            if (
                                res.template ===
                                ConstantStringTableComponentsEnum.DRIVER
                            ) {
                                this.deleteDriverById(res.id);
                            }
                            break;
                        }
                        case ConstantStringTableComponentsEnum.ACTIVATE: {
                            this.changeDriverStatus(res.id);
                            break;
                        }
                        case ConstantStringTableComponentsEnum.DEACTIVATE: {
                            this.changeDriverStatus(res.id);
                            break;
                        }
                        case ConstantStringTableComponentsEnum.MULTIPLE_DELETE: {
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
                        this.viewData = this.driverTableData;
                        this.viewData = this.viewData?.filter((d) =>
                            res.filteredArray.some((i) => i.id == d.id)
                        );
                    }
                    if (!res.selectedFilter) {
                        this.sendDriverData();
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
                    this.mapingIndex = 0;

                    this.driverBackFilterQuery.active =
                        this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                            ? 1
                            : 0;
                    this.driverBackFilterQuery.pageIndex = 1;

                    this.applicantBackFilterQuery.applicantSpecParamsPageIndex = 1;

                    const searchEvent = tableSearch(
                        res,
                        this.selectedTab ===
                            ConstantStringTableComponentsEnum.APPLICANTS
                            ? this.applicantBackFilterQuery
                            : this.driverBackFilterQuery
                    );

                    if (searchEvent) {
                        if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.API
                        ) {
                            this.selectedTab ===
                            ConstantStringTableComponentsEnum.APPLICANTS
                                ? this.applicantBackFilter(searchEvent.query)
                                : this.driverBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.STORE
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
                        { size: ConstantStringTableComponentsEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: ConstantStringTableComponentsEnum.DRIVER,
                            type: ConstantStringTableComponentsEnum.MULTIPLE_DELETE,
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
                    res?.animation === ConstantStringTableComponentsEnum.ADD &&
                    this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                ) {
                    this.viewData.push(this.mapDriverData(res.data));
                    this.viewData = this.viewData.map((driver) => {
                        if (driver.id === res.id) {
                            driver.actionAnimation =
                                ConstantStringTableComponentsEnum.ADD;
                        }

                        return driver;
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
                // On Add Driver Inactive
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.ADD &&
                    this.selectedTab ===
                        ConstantStringTableComponentsEnum.INACTIVE
                ) {
                    this.updateDataCount();
                }
                // On Update Driver
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.UPDATE
                ) {
                    const updatedDriver = this.mapDriverData(res.data);
                    this.viewData = this.viewData.map((driver) => {
                        if (driver.id === res.id) {
                            driver = updatedDriver;
                            driver.actionAnimation =
                                ConstantStringTableComponentsEnum.UPDATE;
                        }

                        return driver;
                    });

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);
                }
                // On Update Driver Status
                else if (
                    res?.animation ===
                    ConstantStringTableComponentsEnum.UPDATE_STATUS
                ) {
                    let driverIndex: number;

                    this.viewData = this.viewData.map((driver, index) => {
                        if (driver.id === res.id) {
                            driver.actionAnimation =
                                this.selectedTab ===
                                ConstantStringTableComponentsEnum.ACTIVE
                                    ? ConstantStringTableComponentsEnum.DEACTIVATE
                                    : ConstantStringTableComponentsEnum.ACTIVATE;
                            driverIndex = index;
                        }

                        return driver;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        this.viewData.splice(driverIndex, 1);
                        clearInterval(inetval);
                    }, 900);
                }
                // On Delete Driver
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.DELETE
                ) {
                    let driverIndex: number;

                    this.viewData = this.viewData.map((driver, index) => {
                        if (driver.id === res.id) {
                            driver.actionAnimation =
                                ConstantStringTableComponentsEnum.DELETE;
                            driverIndex = index;
                        }

                        return driver;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
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
            document.querySelector(
                ConstantStringTableComponentsEnum.TABLE_CONTAINER
            )
        );
    }

    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showLocationFilter:
                    this.selectedTab !==
                    ConstantStringTableComponentsEnum.APPLICANTS,
                showArhiveFilter:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.APPLICANTS,
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

    private sendDriverData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.DRIVER_TABLE_VIEW
            )
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const driverCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.DRIVER_TABLE_COUNT
            )
        );

        const applicantsData =
            this.selectedTab === ConstantStringTableComponentsEnum.APPLICANTS
                ? this.getTabData(ConstantStringTableComponentsEnum.APPLICANTS)
                : [];

        const driverActiveData =
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.ACTIVE)
                : [];

        const driverInactiveData =
            this.selectedTab === ConstantStringTableComponentsEnum.INACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: ConstantStringTableComponentsEnum.APPLICANTS,
                field: ConstantStringTableComponentsEnum.APPLICANTS,
                length: driverCount.applicant,
                data: applicantsData,
                extended: true,
                gridNameTitle: ConstantStringTableComponentsEnum.DRIVER,
                stateName: ConstantStringTableComponentsEnum.APPLICANTS,
                tableConfiguration: ConstantStringTableComponentsEnum.APPLICANT,
                driverArhivedArray: checkSpecialFilterArray(
                    applicantsData,
                    ConstantStringTableComponentsEnum.ARHIVED_DATA
                ),
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.APPLICANTS,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.APPLICANTS,
                    ConstantStringTableComponentsEnum.APPLICANT
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.ACTIVE,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: driverCount.active,
                data: driverActiveData,
                extended: false,
                gridNameTitle: ConstantStringTableComponentsEnum.DRIVER,
                stateName: ConstantStringTableComponentsEnum.DRIVER_2,
                tableConfiguration: ConstantStringTableComponentsEnum.DRIVER,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.DRIVER_2,
                    ConstantStringTableComponentsEnum.DRIVER
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.INACTIVE,
                field: ConstantStringTableComponentsEnum.INACTIVE,
                length: driverCount.inactive,
                data: driverInactiveData,
                extended: false,
                gridNameTitle: ConstantStringTableComponentsEnum.DRIVER,
                stateName: ConstantStringTableComponentsEnum.DRIVER_2,
                tableConfiguration: ConstantStringTableComponentsEnum.DRIVER,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.DRIVER_2,
                    ConstantStringTableComponentsEnum.DRIVER
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setDriverData(td);
    }

    private getTabData(dataType: string): DriversInactiveState[] {
        if (dataType === ConstantStringTableComponentsEnum.ACTIVE) {
            this.driversActive = this.driversActiveQuery.getAll();

            return this.driversActive?.length ? this.driversActive : [];
        } else if (dataType === ConstantStringTableComponentsEnum.INACTIVE) {
            this.inactiveTabClicked = true;

            this.driversInactive = this.driversInactiveQuery.getAll();

            return this.driversInactive?.length ? this.driversInactive : [];
        } else if (ConstantStringTableComponentsEnum.APPLICANTS) {
            this.applicantTabActive = true;

            this.applicantData = this.applicantQuery.getAll();

            return this.applicantData?.length ? this.applicantData : [];
        }
    }

    private getGridColumns(activeTab: string, configType: string): void {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (activeTab === ConstantStringTableComponentsEnum.APPLICANTS) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getApplicantColumnsDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getDriverColumnsDefinition();
        }
    }

    private setDriverData(tdata: DataForCardsAndTables): void {
        this.columns = tdata.gridColumns;

        if (tdata.data.length) {
            this.viewData = tdata.data;

            this.viewData = this.viewData.map((data: any) => {
                return this.selectedTab ===
                    ConstantStringTableComponentsEnum.APPLICANTS
                    ? this.mapApplicantsData(data)
                    : this.mapDriverData(data);
            });

            // Set data for cards based on tab active
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? ((this.sendDataToCardsFront = this.displayRowsFront),
                  (this.sendDataToCardsBack = this.displayRowsBack))
                : null;

            // Get Tab Table Data For Selected Tab
            this.getSelectedTabTableData();
        } else {
            this.viewData = [];
        }
        this.driverTableData = this.viewData;
    }

    // TODO find model for this data
    private mapDriverData(data): DriverResponse {
        if (!data?.avatar) {
            this.mapingIndex++;
        }

        return {
            ...data,
            isSelected: false,
            isOwner: data?.owner ? data.owner : false,
            textShortName: this.nameInitialsPipe.transform(data.fullName),
            avatarColor: this.getAvatarColors(),
            avatarImg: data?.avatar
                ? this.imageBase64Service.sanitizer(data.avatar)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableAddress: data.address.address
                ? data.address.address
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableDOB: data.dateOfBirth
                ? this.datePipe.transform(
                      data.dateOfBirth,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableAssignedUnitTruck: ConstantStringTableComponentsEnum.NA,
            tableAssignedUnitTruckType: ConstantStringTableComponentsEnum.NA,
            tableAssignedUnitTrailer: ConstantStringTableComponentsEnum.NA,
            tableAssignedUnitTrailerType: ConstantStringTableComponentsEnum.NA,
            tablePayrollDetailType: data?.payType?.name
                ? data.payType.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableBankDetailBankName: data?.bank?.name
                ? data.bank.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableBankDetailRouting: data.routing
                ? data.routing
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableOwnerDetailsType: data?.owner?.ownerType?.name
                ? data.owner.ownerType.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableOwnerDetailsBusinesName: data?.owner?.name
                ? data.owner.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableOwnerDetailsEin: data?.owner?.ssnEin
                ? data.owner.ssnEin
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableOffDutyLocation: ConstantStringTableComponentsEnum.NA,
            tableEmergContact: data?.emergencyContactPhone
                ? data.emergencyContactPhone
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableTwicExp: ConstantStringTableComponentsEnum.NA,
            tableFuelCardDetailNumber: data?.fuelCard
                ? data.fuelCard
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableFuelCardDetailType: ConstantStringTableComponentsEnum.NA,
            tableFuelCardDetailAccount: ConstantStringTableComponentsEnum.NA,
            tableCdlDetailNumber: data?.cdlNumber
                ? data.cdlNumber
                : data?.cdls?.length
                ? data.cdls[0].cdlNumber
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableCdlDetailState: data.address.stateShortName
                ? data.address.stateShortName
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableCdlDetailEndorsment: ConstantStringTableComponentsEnum.NA,
            tableCdlDetailRestriction: ConstantStringTableComponentsEnum.NA,
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
            tableTestDetailsType: ConstantStringTableComponentsEnum.NA,
            tableTestDetailsReason: ConstantStringTableComponentsEnum.NA,
            tableTestDetailsIssued: ConstantStringTableComponentsEnum.NA,
            tableTestDetailsResult: ConstantStringTableComponentsEnum.NA,
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
                    ? ConstantStringTableComponentsEnum.EMAIL
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.general?.pushNotification
                    ? ConstantStringTableComponentsEnum.PUSH
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.general?.smsNotification
                    ? ConstantStringTableComponentsEnum.SMS
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            }`,
            tabelNotificationPayroll: `${
                data?.payroll?.mailNotification
                    ? ConstantStringTableComponentsEnum.EMAIL
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.payroll?.pushNotification
                    ? ConstantStringTableComponentsEnum.PUSH
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            }${
                data?.payroll?.smsNotification
                    ? ConstantStringTableComponentsEnum.SMS
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER
            }`,
            tabelHired: data.hired
                ? this.datePipe.transform(
                      data.hired,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableTerminated: ConstantStringTableComponentsEnum.NA,
            tableAdded: ConstantStringTableComponentsEnum.NA,
            tableEdited: ConstantStringTableComponentsEnum.NA,
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
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableAccepted: data?.acceptedDate
                ? this.datePipe.transform(
                      data.acceptedDate,
                      ConstantStringTableComponentsEnum.DATE_FORMAT
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableDOB: data?.doB
                ? data.doB
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            tableApplicantProgress: [
                {
                    title: ConstantStringTableComponentsEnum.APP,
                    status: data.applicationStatus,
                    width: 34,
                    class: ConstantStringTableComponentsEnum.COMPLETE_ICON,
                    percentage: 34,
                },
                {
                    title: ConstantStringTableComponentsEnum.MVR,
                    status: data.mvrStatus,
                    width: 34,
                    class: ConstantStringTableComponentsEnum.COMPLETE_ICON,
                    percentage: 34,
                },
                {
                    title: ConstantStringTableComponentsEnum.PSP,
                    status: data.pspStatus,
                    width: 29,
                    class: ConstantStringTableComponentsEnum.COMPLETE_ICON,
                    percentage: 34,
                },
                {
                    title: ConstantStringTableComponentsEnum.SPH,
                    status: data.sphStatus,
                    width: 30,
                    class: ConstantStringTableComponentsEnum.COMPLETE_ICON,
                    percentage: 34,
                },
                {
                    title: ConstantStringTableComponentsEnum.HOS,
                    status: data.hosStatus,
                    width: 32,
                    class: ConstantStringTableComponentsEnum.DONE_ICON,
                    percentage: 34,
                },
                {
                    title: ConstantStringTableComponentsEnum.SSN,
                    status: data.ssnStatus,
                    width: 29,
                    class: ConstantStringTableComponentsEnum.WRONG_ICON,
                    percentage: 34,
                },
            ],
            tableMedical: {
                class: ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                hideProgres: false,
                isApplicant: true,
                expirationDays: data?.medicalDaysLeft
                    ? this.thousandSeparator.transform(data.medicalDaysLeft)
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                percentage: data?.medicalPercentage
                    ? data.medicalPercentage
                    : null,
            },
            tableCdl: {
                class: ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                hideProgres: false,
                isApplicant: true,
                expirationDays: data?.cdlDaysLeft
                    ? this.thousandSeparator.transform(data.cdlDaysLeft)
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                percentage: data?.cdlPercentage ? data.cdlPercentage : null,
            },
            tableRev: {
                title: ConstantStringTableComponentsEnum.INCOMPLETE,
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
                title: ConstantStringTableComponentsEnum.EDIT_2,
                name: ConstantStringTableComponentsEnum.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
            },

            {
                title: ConstantStringTableComponentsEnum.VIEW_DETAILS_2,
                name: ConstantStringTableComponentsEnum.VIEW_DETAILS,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: ConstantStringTableComponentsEnum.SEND_MESSAGE_2,
                name: ConstantStringTableComponentsEnum.SEND_MESSAGE,
                svgUrl: ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
            },
            {
                title: ConstantStringTableComponentsEnum.ADD_NEW_2,
                name: ConstantStringTableComponentsEnum.ADD_NEW,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: ConstantStringTableComponentsEnum.ADD_CDL,
                        name: ConstantStringTableComponentsEnum.NEW_LICENCE,
                    },
                    {
                        title: ConstantStringTableComponentsEnum.ADD_MVR,
                        name: ConstantStringTableComponentsEnum.NEW_MVR,
                    },
                    {
                        title: ConstantStringTableComponentsEnum.MEDICAL_EXAM_3,
                        name: ConstantStringTableComponentsEnum.NEW_MEDICAL,
                    },
                    {
                        title: ConstantStringTableComponentsEnum.TEST_DRUG_ALCOHOL,
                        name: ConstantStringTableComponentsEnum.NEW_DRUG,
                    },
                ],
            },
            {
                title: ConstantStringTableComponentsEnum.REQUEST,
                name: ConstantStringTableComponentsEnum.ADD_TO_FAVORITES,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Show More.svg',
                svgStyle: {
                    width: 15,
                    height: 15,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                isDropdown: true,
                insideDropdownContent: [
                    {
                        title: ConstantStringTableComponentsEnum.BACKGROUND_CHECK_2,
                        name: ConstantStringTableComponentsEnum.BACKGROUND_CHECK,
                    },
                    {
                        title: ConstantStringTableComponentsEnum.MEDICAL_EXAM_2,
                        name: ConstantStringTableComponentsEnum.MEDICAL_EXAM,
                    },
                    {
                        title: ConstantStringTableComponentsEnum.TEST_DRUG_ALCOHOL,
                        name: ConstantStringTableComponentsEnum.TEST_DRUG,
                    },
                    {
                        title: ConstantStringTableComponentsEnum.MVR_2,
                        name: ConstantStringTableComponentsEnum.TEST_MVR,
                    },
                ],
                hasBorder: true,
            },
            {
                title: ConstantStringTableComponentsEnum.SHARE_2,
                name: ConstantStringTableComponentsEnum.SHARE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: ConstantStringTableComponentsEnum.PRINT_2,
                name: ConstantStringTableComponentsEnum.PRINT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.REGULAR,
                hasBorder: true,
            },
            {
                title:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? ConstantStringTableComponentsEnum.DEACTIVATE_2
                        : ConstantStringTableComponentsEnum.ACTIVATE_2,
                name: ConstantStringTableComponentsEnum.ACTIVATE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? ConstantStringTableComponentsEnum.DEACTIVATE
                        : ConstantStringTableComponentsEnum.ACTIVATE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: ConstantStringTableComponentsEnum.DELETE_2,
                name: ConstantStringTableComponentsEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: ConstantStringTableComponentsEnum.DELETE,
            },
        ];
    }

    private getDropdownApplicantContent(): DropdownItem[] {
        return TableDropdownDriverComponentConstants.DROPDOWN_APPLICANT;
    }

    // Get Avatar Color
    private getAvatarColors(): AvatarColors {
        const textColors: string[] = TableDriverColorsConstants.TEXT_COLORS;

        const backgroundColors: string[] =
            TableDriverColorsConstants.BACKGROUND_COLORS;

        this.mapingIndex = this.mapingIndex <= 11 ? this.mapingIndex : 0;

        return {
            background: backgroundColors[this.mapingIndex],
            color: textColors[this.mapingIndex],
        };
    }

    private updateDataCount(): void {
        const driverCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.DRIVER_TABLE_COUNT
            )
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
        this.driverTService
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

    public onToolBarAction(event: ToolbarActions): void {
        // Open Modal
        if (event.action === ConstantStringTableComponentsEnum.OPEN_MODAL) {
            if (
                this.selectedTab ===
                ConstantStringTableComponentsEnum.APPLICANTS
            ) {
                this.modalService.openModal(ApplicantModalComponent, {
                    size: ConstantStringTableComponentsEnum.SMALL,
                });
            } else {
                this.modalService.openModal(DriverModalComponent, {
                    size: ConstantStringTableComponentsEnum.MEDIUM,
                });
            }
        }
        // Select Tab
        else if (
            event.action === ConstantStringTableComponentsEnum.TAB_SELECTED
        ) {
            this.selectedTab = event.tabData.field;
            this.mapingIndex = 0;

            this.driverBackFilterQuery.active =
                this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                    ? 1
                    : 0;
            this.driverBackFilterQuery.pageIndex = 1;

            this.applicantBackFilterQuery.applicantSpecParamsPageIndex = 1;

            // Driver Inactive Api Call
            if (
                this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE &&
                !this.inactiveTabClicked
            ) {
                this.driverTService
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
                this.selectedTab ===
                    ConstantStringTableComponentsEnum.APPLICANTS &&
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
        else if (event.action === ConstantStringTableComponentsEnum.VIEW_MODE) {
            this.mapingIndex = 0;

            this.activeViewMode = event.mode;
        }
    }

    public onTableHeadActions(event: OnTableHeadActionsModal): void {
        if (event.action === ConstantStringTableComponentsEnum.SORT) {
            this.mapingIndex = 0;

            if (event.direction) {
                if (
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.APPLICANTS
                ) {
                    this.applicantBackFilterQuery.applicantSpecParamsPageIndex = 1;
                    this.applicantBackFilterQuery.applicantSpecParamsSort =
                        event.direction;

                    this.applicantBackFilter(this.applicantBackFilterQuery);
                } else {
                    this.driverBackFilterQuery.active =
                        this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                            ? 1
                            : 0;
                    this.driverBackFilterQuery.pageIndex = 1;
                    this.driverBackFilterQuery.sort = event.direction;
                    this.driverBackFilter(this.driverBackFilterQuery);
                }
            } else {
                this.sendDriverData();
            }
        }
    }

    public onTableBodyActions(event: OnTableBodyActionsModal): void {
        const mappedEvent = {
            ...event,
            data: {
                ...event.data,
                name: event.data?.fullName,
            },
        };
        if (event.type === ConstantStringTableComponentsEnum.SHOW_MORE) {
            if (
                this.selectedTab ===
                ConstantStringTableComponentsEnum.APPLICANTS
            ) {
                this.applicantBackFilterQuery.applicantSpecParamsPageIndex++;

                this.applicantBackFilter(this.applicantBackFilterQuery, true);
            } else {
                this.driverBackFilterQuery.active =
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                        ? 1
                        : 0;
                this.driverBackFilterQuery.pageIndex++;

                this.driverBackFilter(this.driverBackFilterQuery, true);
            }
        } else if (event.type === ConstantStringTableComponentsEnum.EDIT) {
            if (
                this.selectedTab ===
                ConstantStringTableComponentsEnum.APPLICANTS
            ) {
                this.modalService.openModal(
                    ApplicantModalComponent,
                    {
                        size: ConstantStringTableComponentsEnum.SMALL,
                    },
                    {
                        id: 1,
                        type: ConstantStringTableComponentsEnum.EDIT,
                    }
                );
            } else {
                this.modalService.openModal(
                    DriverModalComponent,
                    { size: ConstantStringTableComponentsEnum.MEDIUM },
                    {
                        ...event,
                        disableButton: true,
                    }
                );
            }
        } else if (
            event.type === ConstantStringTableComponentsEnum.NEW_LICENCE
        ) {
            this.modalService.openModal(
                DriverCdlModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (
            event.type === ConstantStringTableComponentsEnum.NEW_MEDICAL
        ) {
            this.modalService.openModal(
                DriverMedicalModalComponent,
                {
                    size: ConstantStringTableComponentsEnum.SMALL,
                },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (event.type === ConstantStringTableComponentsEnum.NEW_MVR) {
            this.modalService.openModal(
                DriverMvrModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (event.type === ConstantStringTableComponentsEnum.NEW_DRUG) {
            this.modalService.openModal(
                DriverDrugAlcoholModalComponent,
                {
                    size: ConstantStringTableComponentsEnum.SMALL,
                },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (
            event.type === ConstantStringTableComponentsEnum.ACTIVATE_ITEM
        ) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...mappedEvent,
                    template: ConstantStringTableComponentsEnum.DRIVER,
                    type:
                        event.data.status === 1
                            ? ConstantStringTableComponentsEnum.DEACTIVATE
                            : ConstantStringTableComponentsEnum.ACTIVATE,
                    image: true,
                }
            );
        } else if (
            event.type === ConstantStringTableComponentsEnum.DELETE_ITEM
        ) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...mappedEvent,
                    template: ConstantStringTableComponentsEnum.DRIVER,
                    type: ConstantStringTableComponentsEnum.DELETE,
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
            type: ConstantStringTableComponentsEnum.SHOW_MORE,
        });
    }

    private changeDriverStatus(id: number): void {
        this.driverTService
            .changeDriverStatus(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private deleteDriverById(id: number): void {
        this.driverTService
            .deleteDriverById(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((driver) => {
                        if (driver.id === id) {
                            driver.actionAnimation =
                                ConstantStringTableComponentsEnum.DELETE;
                        }

                        return driver;
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

    // This function gets called but service deleteDriverList is commented out so it will not delete any drivers
    private multipleDeleteDrivers(response: DriverResponse[]): void {
        this.driverTService
            .deleteDriverList(response)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((driver) => {
                    response.map((id) => {
                        if (driver.id === id) {
                            driver.actionAnimation =
                                ConstantStringTableComponentsEnum.DELETE_MULTIPLE;
                        }
                    });

                    return driver;
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
        // this.resizeObserver.unobserve(
        //     document.querySelector(ConstantStringTableComponentsEnum.TABLE_CONTAINER)
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
                    extraText:
                        ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                },
                tableQuantity: {
                    text: 230,
                    extraText: 'Boxes',
                },
                tableBolNo: {
                    text: 1598550,
                    extraText:
                        ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                },
                tableWeight: {
                    text: '2,360',
                    extraText: 'lbs',
                },
                tableAction: ConstantStringTableComponentsEnum.DELETE,
            });
        }
    }
}
