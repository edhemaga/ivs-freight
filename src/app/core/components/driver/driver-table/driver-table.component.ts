import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { DriversActiveQuery } from '../state/driver-active-state/driver-active.query';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DriverModalComponent } from '../../modals/driver-modal/driver-modal.component';
import { DatePipe } from '@angular/common';
import { DriverTService } from '../state/driver.service';
import { DriversActiveState } from '../state/driver-active-state/driver-active.store';
import { DriverCdlModalComponent } from '../../modals/driver-modal/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../../modals/driver-modal/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../../modals/driver-modal/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../../modals/driver-modal/driver-mvr-modal/driver-mvr-modal.component';

import { DriversInactiveState } from '../state/driver-inactive-state/driver-inactive.store';
import { DriversInactiveQuery } from '../state/driver-inactive-state/driver-inactive.query';
import { ApplicantShortResponse, DriverListResponse } from 'appcoretruckassist';

import {
    Confirmation,
    ConfirmationModalComponent,
} from '../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { Subject, takeUntil } from 'rxjs';
import { NameInitialsPipe } from '../../../pipes/nameinitials';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { ImageBase64Service } from '../../../utils/base64.image';
import {
    tableSearch,
    closeAnimationAction,
} from '../../../utils/methods.globals';
import { getApplicantColumnsDefinition } from '../../../../../assets/utils/settings/applicant-columns';
import { getDriverColumnsDefinition } from '../../../../../assets/utils/settings/driver-columns';
import { ApplicantModalComponent } from '../../modals/applicant-modal/applicant-modal.component';
import { ApplicantTableQuery } from '../state/applicant-state/applicant-table.query';
import { getLoadModalColumnDefinition } from 'src/assets/utils/settings/modal-columns-configuration/table-load-modal-columns';

@Component({
    selector: 'app-driver-table',
    templateUrl: './driver-table.component.html',
    styleUrls: ['./driver-table.component.scss'],
    providers: [NameInitialsPipe, TaThousandSeparatorPipe],
})
export class DriverTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();

    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    selectedTab = 'active';
    activeViewMode: string = 'List';
    driversActive: DriversActiveState[] = [];
    driversInactive: DriversInactiveState[] = [];
    applicantData: ApplicantShortResponse[] = [];
    loadingPage: boolean = true;
    backFilterQuery = {
        active: 1,
        long: undefined,
        lat: undefined,
        distance: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };
    tableContainerWidth: number = 0;
    resizeObserver: ResizeObserver;
    mapingIndex: number = 0;

    constructor(
        private modalService: ModalService,
        private driversActiveQuery: DriversActiveQuery,
        private driversInactiveQuery: DriversInactiveQuery,
        private applicantQuery: ApplicantTableQuery,
        private tableService: TruckassistTableService,
        public datePipe: DatePipe,
        private driverTService: DriverTService,
        private notificationService: NotificationService,
        private nameInitialsPipe: NameInitialsPipe,
        private thousandSeparator: TaThousandSeparatorPipe,
        private imageBase64Service: ImageBase64Service,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.modalTestInitialization();

        this.sendDriverData();

        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'driver') {
                                this.deleteDriverById(res.id);
                            }
                            break;
                        }
                        case 'activate': {
                            this.changeDriverStatus(res.id);
                            break;
                        }
                        case 'deactivate': {
                            this.changeDriverStatus(res.id);
                            break;
                        }
                        case 'multiple delete': {
                            this.multipleDeleteDrivers(res.array);
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
                    this.sendDriverData();
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

        // Search
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res) {
                    this.mapingIndex = 0;

                    this.backFilterQuery.active =
                        this.selectedTab === 'active' ? 1 : 0;
                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(res, this.backFilterQuery);

                    if (searchEvent) {
                        if (searchEvent.action === 'api') {
                            this.driverBackFilter(searchEvent.query, true);
                        } else if (searchEvent.action === 'store') {
                            this.sendDriverData();
                        }
                    }
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
                                name: item.tableData?.fullName,
                            },
                        };
                    });
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: 'small' },
                        {
                            data: null,
                            array: mappedRes,
                            template: 'driver',
                            type: 'multiple delete',
                            image: true,
                        }
                    );
                }
            });

        // Driver Actions
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // On Add Driver Active
                if (res.animation === 'add' && this.selectedTab === 'active') {
                    this.viewData.push(this.mapDriverData(res.data));

                    this.viewData = this.viewData.map((driver: any) => {
                        if (driver.id === res.id) {
                            driver.actionAnimation = 'add';
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
                    res.animation === 'add' &&
                    this.selectedTab === 'inactive'
                ) {
                    this.updateDataCount();
                }
                // On Update Driver
                else if (res.animation === 'update') {
                    const updatedDriver = this.mapDriverData(res.data);

                    this.viewData = this.viewData.map((driver: any) => {
                        if (driver.id === res.id) {
                            driver = updatedDriver;
                            driver.actionAnimation = 'update';
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
                else if (res.animation === 'update-status') {
                    let driverIndex: number;

                    this.viewData = this.viewData.map(
                        (driver: any, index: number) => {
                            if (driver.id === res.id) {
                                driver.actionAnimation =
                                    this.selectedTab === 'active'
                                        ? 'deactivate'
                                        : 'activate';
                                driverIndex = index;
                            }

                            return driver;
                        }
                    );

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
                else if (res.animation === 'delete') {
                    let driverIndex: number;

                    this.viewData = this.viewData.map(
                        (driver: any, index: number) => {
                            if (driver.id === res.id) {
                                driver.actionAnimation = 'delete';
                                driverIndex = index;
                            }

                            return driver;
                        }
                    );

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

        this.loadingPage = false;
    }

    modalColumns: any[] = [];
    modalViewData: any[] = [];
    modalTestInitialization() {
        this.modalColumns = getLoadModalColumnDefinition();

        for (let i = 0; i < 3; i++) {
            this.modalViewData.push({
                tableDescription: {
                    text: 'Jaffa Cakes',
                    extraText: '',
                },
                tableQuantity: {
                    text: 230,
                    extraText: 'Boxes',
                },
                tableBolNo: {
                    text: 1598550,
                    extraText: '',
                },
                tableWeight: {
                    text: '2,360',
                    extraText: 'lbs',
                },
                tableAction: 'delete',
            });
        }
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
                showLocationFilter: this.selectedTab !== 'applicants',
                showArhiveFilter: this.selectedTab === 'applicants',
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                ],
            },
            actions: this.getTableActions(),
        };
    }

    getTableActions() {
        return this.selectedTab === 'applicants'
            ? [
                  {
                      title: 'Hire Applicant',
                      name: 'hire-applicant',
                      class: '',
                      contentType: '',
                  },
                  {
                      title: 'Resend Invitation',
                      name: 'resend-invitation',
                      class: '',
                      contentType: '',
                  },
                  {
                      title: 'Add to Favourites',
                      name: 'add-to-favourites',
                      class: '',
                      contentType: '',
                  },
                  {
                      title: 'Delete',
                      name: 'delete-applicant',
                      type: 'driver',
                      text: 'Are you sure you want to delete applicant(s)?',
                      class: 'delete-text',
                      contentType: 'delete',
                  },
              ]
            : [
                  {
                      title: 'Edit Driver',
                      name: 'edit',
                      class: 'regular-text',
                      contentType: 'edit',
                  },
                  {
                      title: 'Add CDL',
                      name: 'new-licence',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title: 'Add Medical',
                      name: 'new-medical',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title: 'Add MVR',
                      name: 'new-mvr',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title: 'Add Test',
                      name: 'new-drug',
                      class: 'regular-text',
                      contentType: 'add',
                  },
                  {
                      title:
                          this.selectedTab === 'inactive'
                              ? 'Activate'
                              : 'Deactivate',
                      name: 'activate-item',
                      class: 'regular-text',
                      contentType: 'activate',
                  },
                  {
                      title: 'Delete',
                      name: 'delete-item',
                      type: 'driver',
                      text: 'Are you sure you want to delete driver(s)?',
                      class: 'delete-text',
                      contentType: 'delete',
                  },
              ];
    }

    sendDriverData() {
        this.initTableOptions();

        const applicantCount = JSON.parse(
            localStorage.getItem('applicantTableCount')
        );

        const driverCount = JSON.parse(
            localStorage.getItem('driverTableCount')
        );

        const applicantsData =
            this.selectedTab === 'applicants'
                ? this.getTabData('applicants')
                : [];

        const driverActiveData =
            this.selectedTab === 'active' ? this.getTabData('active') : [];

        const driverInactiveData =
            this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

        this.tableData = [
            {
                title: 'Applicants',
                field: 'applicants',
                length: applicantCount.applicant,
                data: applicantsData,
                extended: true,
                gridNameTitle: 'Driver',
                stateName: 'applicants',
                tableConfiguration: 'APPLICANT',
                isActive: this.selectedTab === 'applicants',
                gridColumns: this.getGridColumns('applicants', 'APPLICANT'),
            },
            {
                title: 'Active',
                field: 'active',
                length: driverCount.active,
                data: driverActiveData,
                extended: false,
                gridNameTitle: 'Driver',
                stateName: 'drivers',
                tableConfiguration: 'DRIVER',
                isActive: this.selectedTab === 'active',
                gridColumns: this.getGridColumns('drivers', 'DRIVER'),
            },
            {
                title: 'Inactive',
                field: 'inactive',
                length: driverCount.inactive,
                data: driverInactiveData,
                extended: false,
                gridNameTitle: 'Driver',
                stateName: 'drivers',
                tableConfiguration: 'DRIVER',
                isActive: this.selectedTab === 'inactive',
                gridColumns: this.getGridColumns('drivers', 'DRIVER'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setDriverData(td);
    }

    getTabData(dataType: string) {
        if (dataType === 'active') {
            this.driversActive = this.driversActiveQuery.getAll();

            return this.driversActive?.length ? this.driversActive : [];
        } else if (dataType === 'inactive') {
            this.driversInactive = this.driversInactiveQuery.getAll();

            return this.driversInactive?.length ? this.driversInactive : [];
        } else if ('applicants') {
            this.applicantData = this.applicantQuery.getAll();

            return this.applicantData?.length ? this.applicantData : [];
        }
    }

    getGridColumns(activeTab: string, configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (activeTab === 'applicants') {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getApplicantColumnsDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getDriverColumnsDefinition();
        }
    }

    setDriverData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data: any) => {
                return this.selectedTab === 'applicants'
                    ? this.mapApplicantsData(data)
                    : this.mapDriverData(data);
            });
        } else {
            this.viewData = [];
        }
    }

    mapDriverData(data: any) {
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
                : '',
            tableAddress: data.address.address ? data.address.address : '',
            tableDOB: data.dateOfBirth
                ? this.datePipe.transform(data.dateOfBirth, 'MM/dd/yy')
                : '',
            tableAssignedUnitTruck: 'Nema podatak sa back-a',
            tableAssignedUnitTruckType: 'Nema podatak sa back-a',
            tableAssignedUnitTrailer: 'Nema podatak sa back-a',
            tableAssignedUnitTrailerType: 'Nema podatak sa back-a',
            tablePayrollDetailType: data?.payType?.name
                ? data.payType.name
                : '',
            tableBankDetailBankName: data?.bank?.name ? data.bank.name : '',
            tableBankDetailRouting: data.routing ? data.routing : '',
            tableOwnerDetailsType: data?.owner?.ownerType?.name
                ? data.owner.ownerType.name
                : '',
            tableOwnerDetailsBusinesName: data?.owner?.name
                ? data.owner.name
                : '',
            tableOwnerDetailsEin: data?.owner?.ssnEin ? data.owner.ssnEin : '',
            tableOffDutyLocation: 'Nema podatak sa back-a',
            tableEmergContact: data?.emergencyContactPhone
                ? data.emergencyContactPhone
                : '',
            tableTwicExp: 'Nema podatak sa back-a',
            tableFuelCardDetailNumber: data?.fuelCard ? data.fuelCard : '',
            tableFuelCardDetailType: 'Nema podatak sa back-a',
            tableFuelCardDetailAccount: 'Nema podatak sa back-a',
            tableCdlDetailNumber: data?.cdlNumber
                ? data.cdlNumber
                : data?.cdls?.length
                ? data.cdls[0].cdlNumber
                : '',
            tableCdlDetailState: data.address.stateShortName
                ? data.address.stateShortName
                : '',
            tableCdlDetailEndorsment: 'Nema podatak sa back-a',
            tableCdlDetailRestriction: 'Nema podatak sa back-a',
            tableCdlDetailExpiration: {
                expirationDays: data?.cdlExpirationDays
                    ? this.thousandSeparator.transform(data.cdlExpirationDays)
                    : null,
                percentage:
                    data?.cdlPercentage || data?.cdlPercentage === 0
                        ? 100 - data.cdlPercentage
                        : null,
            },
            tableTestDetailsType: 'Nema podatak sa back-a',
            tableTestDetailsReason: 'Nema podatak sa back-a',
            tableTestDetailsIssued: 'Nema podatak sa back-a',
            tableTestDetailsResult: 'Nema podatak sa back-a',
            tableMedicalData: {
                expirationDays: data?.medicalExpirationDays
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
                    ? this.thousandSeparator.transform(data.mvrExpirationDays)
                    : null,
                percentage:
                    data?.mvrPercentage || data?.mvrPercentage === 0
                        ? 100 - data.mvrPercentage
                        : null,
            },

            tabelNotificationGeneral: `${
                data?.general?.mailNotification ? 'Email•' : ''
            }${data?.general?.pushNotification ? 'Push•' : ''}${
                data?.general?.smsNotification ? 'SMS' : ''
            }`,
            tabelNotificationPayroll: `${
                data?.payroll?.mailNotification ? 'Email•' : ''
            }${data?.payroll?.pushNotification ? 'Push•' : ''}${
                data?.payroll?.smsNotification ? 'SMS' : ''
            }`,
            tabelHired: data.hired
                ? this.datePipe.transform(data.hired, 'MM/dd/yy')
                : '',
            tableTerminated: 'Nema podatak sa back-a',
            tableAdded: 'Nema podatak sa back-a',
            tableEdited: 'Nema podatak sa back-a',
            tableAttachments: data?.files ? data.files : [],
        };
    }

    mapApplicantsData(data: any) {
        return {
            ...data,
            isSelected: false,
            tableInvited: data?.invitedDate
                ? this.datePipe.transform(data.invitedDate, 'MM/dd/yy')
                : '',
            tableAccepted: data?.acceptedDate
                ? this.datePipe.transform(data.acceptedDate, 'MM/dd/yy')
                : '',
            tableDOB: data?.doB ? data.doB : '',
            tableApplicantProgress: [
                {
                    title: 'App.',
                    status: data.applicationStatus,
                    width: 34,
                    class: 'complete-icon',
                    percentage: 34,
                },
                {
                    title: 'Mvr',
                    status: data.mvrStatus,
                    width: 34,
                    class: 'complete-icon',
                    percentage: 34,
                },
                {
                    title: 'Psp',
                    status: data.pspStatus,
                    width: 29,
                    class: 'wrong-icon',
                    percentage: 34,
                },
                {
                    title: 'Sph',
                    status: data.sphStatus,
                    width: 30,
                    class: 'complete-icon',
                    percentage: 34,
                },
                {
                    title: 'Hos',
                    status: data.hosStatus,
                    width: 32,
                    class: 'done-icon',
                    percentage: 34,
                },
                {
                    title: 'Ssn',
                    status: data.ssnStatus,
                    width: 29,
                    class: 'wrong-icon',
                    percentage: 34,
                },
            ],
            tableMedical: {
                class: '',
                hideProgres: false,
                isApplicant: true,
                expirationDays: data?.medicalDaysLeft
                    ? this.thousandSeparator.transform(data.medicalDaysLeft)
                    : '',
                percentage: data?.medicalPercentage
                    ? data.medicalPercentage
                    : null,
            },
            tableCdl: {
                class: '',
                hideProgres: false,
                isApplicant: true,
                expirationDays: data?.cdlDaysLeft
                    ? this.thousandSeparator.transform(data.cdlDaysLeft)
                    : '',
                percentage: data?.cdlPercentage ? data.cdlPercentage : null,
            },
            tableRev: {
                title: 'Incomplete',
                iconLink:
                    '../../../../../assets/svg/truckassist-table/applicant-wrong-icon.svg',
                // index === 0 || index === 2
                //     ? '../../../../../assets/svg/truckassist-table/applicant-wrong-icon.svg'
                //     : '../../../../../assets/svg/truckassist-table/applicant-done-icon.svg',
            },
            hire: false,
            isFavorite: false,
        };
    }

    // Applicant Interface
    // return {
    //     // Complete, Done, Wrong, In Progres, Not Started
    //     medical: {
    //         class:
    //             index === 0
    //                 ? 'complete-icon'
    //                 : index === 1
    //                 ? 'done-icon'
    //                 : index === 2
    //                 ? 'wrong-icon'
    //                 : '',
    //         hideProgres: index !== 3,
    //         isApplicant: true,
    //         expirationDays: this.thousandSeparator.transform('3233'),
    //         percentage: 34,
    //     },
    //     cdl: {
    //         class:
    //             index === 0
    //                 ? 'complete-icon'
    //                 : index === 1
    //                 ? 'done-icon'
    //                 : index === 2
    //                 ? 'wrong-icon'
    //                 : '',
    //         hideProgres: index !== 3,
    //         isApplicant: true,
    //         expirationDays: this.thousandSeparator.transform('12'),
    //         percentage: 10,
    //     },
    //     rev: {
    //         title:
    //             index === 0
    //                 ? 'Reviewed'
    //                 : index === 1
    //                 ? 'Finished'
    //                 : index === 2
    //                 ? 'Incomplete'
    //                 : 'Ready',
    //         iconLink:
    //             index === 0 || index === 2
    //                 ? '../../../../../assets/svg/truckassist-table/applicant-wrong-icon.svg'
    //                 : '../../../../../assets/svg/truckassist-table/applicant-done-icon.svg',
    //     },
    // };

    // Get Avatar Color
    getAvatarColors() {
        let textColors: string[] = [
            '#6D82C7',
            '#4DB6A2',
            '#E57373',
            '#E3B00F',
            '#BA68C8',
            '#BEAB80',
            '#81C784',
            '#FF8A65',
            '#64B5F6',
            '#F26EC2',
            '#A1887F',
            '#919191',
        ];

        let backgroundColors: string[] = [
            '#DAE0F1',
            '#D2EDE8',
            '#F9DCDC',
            '#F8EBC2',
            '#EED9F1',
            '#EFEADF',
            '#DFF1E0',
            '#FFE2D8',
            '#D8ECFD',
            '#FCDAF0',
            '#E7E1DF',
            '#E3E3E3',
        ];

        this.mapingIndex = this.mapingIndex <= 11 ? this.mapingIndex : 0;

        return {
            background: backgroundColors[this.mapingIndex],
            color: textColors[this.mapingIndex],
        };
    }

    updateDataCount() {
        const driverCount = JSON.parse(
            localStorage.getItem('driverTableCount')
        );

        this.tableData[1].length = driverCount.active;
        this.tableData[2].length = driverCount.inactive;
    }

    driverBackFilter(
        filter: {
            active: number;
            long?: number;
            lat?: number;
            distance?: number;
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

                    this.viewData = this.viewData.map((data: any) => {
                        return this.mapDriverData(data);
                    });

                    if (isSearch) {
                        this.tableData[
                            this.selectedTab === 'active'
                                ? 1
                                : this.selectedTab === 'inactive'
                                ? 2
                                : 0
                        ].length = drivers.pagination.count;
                    }
                } else {
                    let newData = [...this.viewData];

                    drivers.pagination.data.map((data: any) => {
                        newData.push(this.mapDriverData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    onToolBarAction(event: any) {
        if (event.action === 'open-modal') {
            if (this.selectedTab === 'applicants') {
                this.modalService.openModal(ApplicantModalComponent, {
                    size: 'small',
                });
            } else {
                this.modalService.openModal(DriverModalComponent, {
                    size: 'medium',
                });
            }
        } else if (event.action === 'tab-selected') {
            this.selectedTab = event.tabData.field;
            this.mapingIndex = 0;

            this.backFilterQuery.pageIndex = 1;

            this.sendDriverData();
        } else if (event.action === 'view-mode') {
            this.mapingIndex = 0;

            this.activeViewMode = event.mode;
        }
    }

    onTableHeadActions(event: any) {
        if (event.action === 'sort') {
            this.mapingIndex = 0;

            if (event.direction) {
                this.backFilterQuery.active =
                    this.selectedTab === 'active' ? 1 : 0;
                this.backFilterQuery.pageIndex = 1;
                this.backFilterQuery.sort = event.direction;

                this.driverBackFilter(this.backFilterQuery);
            } else {
                this.sendDriverData();
            }
        }
    }

    onTableBodyActions(event: any) {
        const mappedEvent = {
            ...event,
            data: {
                ...event.data,
                name: event.data?.fullName,
            },
        };
        if (event.type === 'show-more') {
            this.backFilterQuery.pageIndex++;
            this.driverBackFilter(this.backFilterQuery, false, true);
        } else if (event.type === 'edit') {
            if (this.selectedTab === 'applicants') {
                this.modalService.openModal(
                    ApplicantModalComponent,
                    {
                        size: 'small',
                    },
                    {
                        id: 1,
                        type: 'edit',
                    }
                );
            } else {
                this.modalService.openModal(
                    DriverModalComponent,
                    { size: 'medium' },
                    {
                        ...event,
                        disableButton: true,
                    }
                );
            }
        } else if (event.type === 'new-licence') {
            this.modalService.openModal(
                DriverCdlModalComponent,
                { size: 'small' },
                { ...event }
            );
        } else if (event.type === 'new-medical') {
            this.modalService.openModal(
                DriverMedicalModalComponent,
                {
                    size: 'small',
                },
                { ...event }
            );
        } else if (event.type === 'new-mvr') {
            this.modalService.openModal(
                DriverMvrModalComponent,
                { size: 'small' },
                { ...event }
            );
        } else if (event.type === 'new-drug') {
            this.modalService.openModal(
                DriverDrugAlcoholModalComponent,
                {
                    size: 'small',
                },
                { ...event }
            );
        } else if (event.type === 'activate-item') {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    ...mappedEvent,
                    template: 'driver',
                    type: event.data.status === 1 ? 'deactivate' : 'activate',
                    image: true,
                }
            );
        } else if (event.type === 'delete-item') {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    ...mappedEvent,
                    template: 'driver',
                    type: 'delete',
                    image: true,
                }
            );
        }
    }

    private changeDriverStatus(id: number) {
        this.driverTService
            .changeDriverStatus(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private deleteDriverById(id: number) {
        this.driverTService
            .deleteDriverById(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((driver: any) => {
                        if (driver.id === id) {
                            driver.actionAnimation = 'delete';
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

    
    private multipleDeleteDrivers(response: any[]) {
        this.driverTService
            .deleteDriverList(response)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((driver: any) => {
                    response.map((id: any) => {
                        if (driver.id === id) {
                            driver.actionAnimation = 'delete-multiple';
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
        this.resizeObserver.unobserve(
            document.querySelector('.table-container')
        );
        this.resizeObserver.disconnect();
    }
}
