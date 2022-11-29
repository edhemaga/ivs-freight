import { SumArraysPipe } from './../../../pipes/sum-arrays.pipe';
import { card_component_animation } from './../../shared/animations/card-component.animations';
import { dropActionNameDriver } from '../../../utils/function-drop.details-page';

import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DriverResponse } from 'appcoretruckassist';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DriverCdlModalComponent } from '../../modals/driver-modal/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../../modals/driver-modal/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../../modals/driver-modal/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../../modals/driver-modal/driver-mvr-modal/driver-mvr-modal.component';
import moment from 'moment';
import { DriversMinimalListQuery } from '../state/driver-details-minimal-list-state/driver-minimal-list.query';
import { Confirmation } from '../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { CdlTService } from '../state/cdl.service';
import { MedicalTService } from '../state/medical.service';
import { MvrTService } from '../state/mvr.service';
import { TestTService } from '../state/test.service';
import { DriverTService } from '../state/driver.service';
import { Subject, takeUntil } from 'rxjs';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { ImageBase64Service } from '../../../utils/base64.image';
import { NotificationService } from '../../../services/notification/notification.service';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { onFileActionMethods } from 'src/app/core/utils/methods.globals';

@Component({
    selector: 'app-driver-details-card',
    templateUrl: './driver-details-card.component.html',
    styleUrls: ['./driver-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [card_component_animation('showHideCardBody')],
    providers: [SumArraysPipe],
})
export class DriverDetailsCardComponent
    implements OnInit, OnDestroy, OnChanges
{
    @ViewChild('revenueChart', { static: false }) public revenueChart: any;
    @Input() driver: any;
    @Input() templateCard: boolean;
    public note: FormControl = new FormControl();
    public cdlNote: FormControl = new FormControl();
    public testNote: FormControl = new FormControl();
    public medicalNote: FormControl = new FormControl();
    public mvrNote: FormControl = new FormControl();
    public isAccountVisibleDriver: boolean = false;
    public toggler: boolean[] = [];
    public dataTest: any;
    public selectedTab: number;
    public yearsService: number = 0;
    public daysService: number = 0;
    public activePercentage: number = 0;
    public firstDate: any;
    public lastDate: any;
    public deactivatePeriod: boolean;
    public tooltipData: any;
    public tooltipFormatStartDate: any;
    public tooltipFormatEndDate: any;
    public showTooltip: boolean;
    public tabsDriver: any[] = [];
    public dropData: any;
    public dataProggress: any;
    public hideArrow: boolean;
    public expDateCard: boolean;
    public templateName: boolean;
    // Driver Dropdown
    public driversDropdowns: any[] = [];
    public driversList: any[] = this.driverMinimalQuery.getAll();
    public dataCDl: any;
    public dropActionName: string = '';
    public driverOwner: boolean;
    public dataCdl: any;
    public dataMvr: any;
    public dataMedical: any;
    public dataTestCard: any;
    public driverObject: any;
    private destroy$ = new Subject<void>();
    public showMoreEmployment: boolean;
    barChartConfig: any = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        1050, 950, 2200, 1100, 1250, 1550, 2100, 2500, 2000,
                        1150, 1300, 1700,
                    ],
                    label: 'Salary',
                    yAxisID: 'y-axis-1',
                    borderColor: '#6D82C7',
                    pointBackgroundColor: '#FFFFFF',
                    pointHoverBackgroundColor: '#6D82C7',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                },
            },
            {
                defaultConfig: {
                    type: 'bar',
                    data: [
                        2200, 1700, 2800, 1100, 1500, 2200, 3300, 3700, 2500,
                        1400, 2200, 2800,
                    ],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#FFCC80',
                    backgroundColor: '#FFCC80',
                    hoverBackgroundColor: '#FFA726',
                    barThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [46, 755, 0, 36.854],
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        defaultType: 'bar',
        chartWidth: '417',
        chartHeight: '130',
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        dataLabels: [
            '',
            'NOV',
            '',
            '2021',
            '',
            'MAR',
            '',
            'MAY',
            '',
            'JUL',
            '',
            'SEP',
        ],
        noChartImage: 'assets/svg/common/yellow_no_data.svg',
    };

    public barChartLegend: any[] = [
        {
            title: 'Miles',
            value: 46755,
            image: 'assets/svg/common/round_yellow.svg',
            sufix: 'mi',
            elementId: 1,
        },
        {
            title: 'Salary',
            value: 36854,
            image: 'assets/svg/common/round_blue.svg',
            prefix: '$',
            elementId: 0,
        },
    ];

    public barAxes: object = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 4000,
            stepSize: 1000,
            showGridLines: true,
        },
        verticalRightAxes: {
            visible: true,
            minValue: 0,
            maxValue: 2800,
            stepSize: 700,
            showGridLines: false,
        },
        horizontalAxes: {
            visible: true,
            position: 'bottom',
            showGridLines: false,
        },
    };

    constructor(
        private modalService: ModalService,
        private detailsPageDriverSer: DetailsPageService,
        private sumArr: SumArraysPipe,
        private cdRef: ChangeDetectorRef,
        private tableService: TruckassistTableService,
        private driverMinimalQuery: DriversMinimalListQuery,
        public imageBase64Service: ImageBase64Service,
        private cdlService: CdlTService,
        private medicalService: MedicalTService,
        private mvrService: MvrTService,
        private testService: TestTService,
        private driverService: DriverTService,
        private confirmationService: ConfirmationService,
        private notificationService: NotificationService,
        private dropDownService: DropDownService
    ) {}
    ngOnChanges(changes: SimpleChanges) {
        if (!changes?.driver?.firstChange && changes?.driver) {
            this.note.patchValue(changes?.driver?.currentValue?.note);
            this.getExpireDate(changes?.driver?.currentValue);
            this.getYearsAndDays(changes?.driver?.currentValue);
            this.widthOfProgress();
            this.getDriverById(changes.driver.currentValue.id);
            this.getDriversDropdown();
            if (changes?.driver?.firstChange) {
                if (this.templateCard == true) {
                    this.hideArrow = true;
                } else {
                    this.hideArrow = false;
                }
            }
        }
        this.driverMinimalQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.driversList = item));
    }

    ngOnInit(): void {
        this.getDriverById(this.driver.id);
        this.note.patchValue(this.driver.note);
        // Confirmation Subscribe
        if (this.templateCard) {
            this.confirmationService.confirmationData$
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res: Confirmation) => {
                        switch (res.type) {
                            case 'delete': {
                                if (res.template === 'cdl') {
                                    this.deleteCdlByIdFunction(res.id);
                                } else if (res.template === 'medical') {
                                    this.deleteMedicalByIdFunction(res.id);
                                } else if (res.template === 'mvr') {
                                    this.deleteMvrByIdFunction(res.id);
                                } else if (res.template === 'test') {
                                    this.deleteTestByIdFunction(res.id);
                                }
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    },
                });
        }
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation) {
                    this.driver = res.data;
                    this.getExpireDate(res.data);
                    this.cdRef.detectChanges();
                }
            });
        if (this.templateCard == true) {
            this.hideArrow = true;
        } else {
            this.hideArrow = false;
        }
        this.initTableOptions();
        this.initTableOptionsCard(this.driver);
        this.getDriversDropdown();
        this.tabsButton();
        this.getYearsAndDays(this.driver);
        this.widthOfProgress();
        this.getExpireDate(this.driver);
    }
    public getNameForDrop(name: string) {
        switch (name) {
            case 'cdl':
                this.templateName = false;
                this.initTableOptions();
                this.getExpireDate(this.driver);
                break;
            case 'test':
                this.templateName = true;
                this.initTableOptions();
                break;
            case 'medical':
                this.templateName = true;
                this.initTableOptions();
                break;
            case 'mvr':
                this.templateName = true;
                this.initTableOptions();
                break;
        }
    }

    public tabsButton() {
        this.tabsDriver = [
            {
                id: 223,
                name: '1M',
            },
            {
                name: '3M',
                checked: false,
            },
            {
                id: 412,
                name: '6M',
                checked: false,
            },
            {
                id: 515,
                name: '1Y',
                checked: false,
            },
            {
                id: 1210,
                name: 'YTD',
                checked: false,
            },
            {
                id: 1011,
                name: 'ALL',
                checked: false,
            },
        ];
    }
    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string) {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }
    public changeTab(ev: any) {
        this.selectedTab = ev.id;
    }
    public getDriverById(id: number) {
        this.driverService
            .getDriverById(id, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.driverObject = item));
    }
    public onDriverActions(event: any) {
        this.dropDownService.dropActionsHeader(
            event,
            this.driverObject,
            this.driver.id
        );
    }
    public optionsEvent(any: any, action: string) {
        const name = dropActionNameDriver(any, action);
        this.dropDownService.dropActions(
            any,
            name,
            this.dataCDl,
            this.dataMvr,
            this.dataMedical,
            this.dataTest,
            this.driver.id
        );
    }
    public optionsDropDown(any: any, actions: string) {}
    public getCdlById(id: number) {
        this.cdlService
            .getCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataCdl = item));
    }

    public getMedicalById(id: number) {
        this.medicalService
            .getMedicalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataMedical = item));
    }

    public getMvrById(id: number) {
        this.mvrService
            .getMvrById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataMvr = item));
    }

    public getTestById(id: number) {
        this.testService
            .getTestById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataTestCard = item));
    }
    public deleteCdlByIdFunction(id: number) {
        this.cdlService
            .deleteCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    
                },
                error: () => {
                    
                },
            });
    }

    private deleteMedicalByIdFunction(id: number) {
        this.medicalService
            .deleteMedicalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    
                },
                error: () => {
                    
                },
            });
    }

    private deleteMvrByIdFunction(id: number) {
        this.mvrService
            .deleteMvrById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    
                },
                error: () => {
                    
                },
            });
    }

    private deleteTestByIdFunction(id: number) {
        this.testService
            .deleteTestById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                   
                },
                error: () => {
                    
                },
            });
    }
    /**Function retrun id */
    public identity(index: number, item: any): number {
        return index;
    }

    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dataTest = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: 'Edit',
                    name: 'edit',
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                },
                {
                    title: 'Renew',
                    name: 'renew',
                    svg: 'assets/svg/common/ic_reload_renew.svg',
                    show: !this.templateName ? true : false,
                },
                {
                    title: 'Void',
                    name: 'activate-item',
                    svg: 'assets/svg/common/ic_cancel_violation.svg',
                    show: !this.templateName ? true : false,
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    danger: true,
                    show: true,
                },
            ],
            export: true,
        };
    }

    /**Function for dots in cards */
    public initTableOptionsCard(data: DriverResponse): void {
        this.dropData = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: 'Send Message',
                    name: 'dm',
                    svg: 'assets/svg/common/ic_dm.svg',
                    show: data.status == 1 ? true : false,
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: data.status == 1 || data.status == 0 ? true : false,
                },

                {
                    title: 'Edit',
                    name: 'edit',
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: data.status == 1 ? true : false,
                },
                {
                    title: data.status == 0 ? 'Activate' : 'Deactivate',
                    name: 'deactivate',
                    svg: 'assets/svg/common/ic_deactivate.svg',
                    activate: data.status == 0 ? true : false,
                    deactivate: data.status == 1 ? true : false,
                    show: data.status == 1 || data.status == 0 ? true : false,
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    danger: true,
                    show: data.status == 1 || data.status == 0 ? true : false,
                },
            ],
            export: true,
        };
    }

    public getExpireDate(data: DriverResponse) {
        this.dataCDl = data?.cdls?.map((ele) => {
            if (moment(ele.expDate).isBefore(moment())) {
                this.expDateCard = false;
            } else {
                this.expDateCard = true;
            }
            return {
                ...ele,
                showButton: this.expDateCard,
            };
        });
    }

    public onModalAction(action: string): void {
        if (action.includes('Drug')) {
            action = 'DrugAlcohol';
        }
        switch (action) {
            case 'CDL': {
                this.modalService.openModal(
                    DriverCdlModalComponent,
                    { size: 'small' },
                    { id: this.driver.id, type: 'new-licence' }
                );
                break;
            }
            case 'DrugAlcohol': {
                this.modalService.openModal(
                    DriverDrugAlcoholModalComponent,
                    { size: 'small' },
                    { id: this.driver.id, type: 'new-drug' }
                );

                break;
            }
            case 'Medical': {
                this.modalService.openModal(
                    DriverMedicalModalComponent,
                    { size: 'small' },
                    { id: this.driver.id, type: 'new-medical' }
                );
                break;
            }
            case 'MVR': {
                this.modalService.openModal(
                    DriverMvrModalComponent,
                    { size: 'small' },
                    { id: this.driver.id, type: 'new-mvr' }
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    public widthOfProgress() {
        let arrMinDate = [];
        let arrMaxDate = [];
        let dateDeactivate = [];
        if (this.driver?.employmentHistories) {
            const sum = this.sumArr.transform(
                this.driver?.employmentHistories.map((item) => {
                    return {
                        id: item.id,
                        value:
                            item.duration.Years * 365.25 + item.duration.Days,
                    };
                })
            );
            this.dataProggress = this.driver?.employmentHistories.map(
                (element) => {
                    let res =
                        element.duration.Years * 365.25 + element.duration.Days;
                    this.activePercentage = (res / sum) * 100;
                    let dates = moment(element.startDate)
                        .min(element.startDate)
                        .format('MM/DD/YY');
                    let endDate = moment(element.endDate)
                        .max(element.endDate)
                        .format('MM/DD/YY');
                    arrMinDate.push(new Date(dates));
                    arrMaxDate.push(new Date(endDate));
                    let deactivate = element.isDeactivate;
                    dateDeactivate.push(deactivate);
                    return {
                        ...element,
                        activePercentage: this.activePercentage.toFixed(1),
                    };
                }
            );

            let dateRes = moment(
                new Date(Math.min.apply(null, arrMinDate))
            ).format('MM/DD/YY');
            if (dateDeactivate.includes(true)) {
                this.deactivatePeriod = true;
            } else {
                this.deactivatePeriod = false;
            }
            this.firstDate = dateRes;
            if (!arrMaxDate.includes('Invalid Date')) {
                let maxEmpDate = moment(
                    new Date(Math.max.apply(null, arrMaxDate))
                ).format('MM/DD/YY');
                this.lastDate = maxEmpDate;
            } else {
                this.lastDate = 'Today';
            }
        }
    }

    public getYearsAndDays(data: any) {
        let sum = 0;
        let sum2 = 0;
        if (data?.employmentHistories) {
            data.employmentHistories.forEach((element) => {
                sum += element.duration.Years;
                sum2 += element.duration.Days;
            });
            let sum3 = sum * 365.25 + sum2;
            this.yearsService = Math.trunc(sum3 / 365.25);
            this.daysService = Math.trunc(sum3 % 365.25);
        }
    }
    public mouseEnter(dat: any) {
        this.tooltipData = dat;
        this.tooltipFormatStartDate = moment(
            dat.startDate,
            'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
        ).format('DD MMMM, YYYY');
        this.tooltipFormatEndDate = moment(
            dat.endDate,
            'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
        ).format('DD MMMM, YYYY');
        this.showTooltip = true;
    }
    public getDriversDropdown() {
        this.driversDropdowns = this.driverMinimalQuery.getAll().map((item) => {
            let fullname = item.firstName + ' ' + item.lastName;
            return {
                id: item.id,
                name: fullname,
                status: item.status,
                svg: item.owner ? 'ic_owner-status.svg' : null,
                folder: 'common',
                active: item.id === this.driver.id,
            };
        });
    }

    public onSelectedDriver(event: any) {
        if (event.id !== this.driver.id) {
            this.driversDropdowns = this.driverMinimalQuery
                .getAll()
                .map((item) => {
                    let fullname = item.firstName + ' ' + item.lastName;
                    return {
                        id: item.id,
                        name: fullname,
                        status: item.status,
                        svg: item.owner ? 'ic_owner-status.svg' : null,
                        folder: 'common',
                        active: item.id === event.id,
                    };
                });
            this.detailsPageDriverSer.getDataDetailId(event.id);
        }
    }

    public onChangeDriver(action: string) {
        let currentIndex = this.driversList.findIndex(
            (driver) => driver.id === this.driver.id
        );

        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.driversList[currentIndex].id
                    );
                    this.onSelectedDriver({
                        id: this.driversList[currentIndex].id,
                    });
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.driversList.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.driversList[currentIndex].id
                    );
                    this.onSelectedDriver({
                        id: this.driversList[currentIndex].id,
                    });
                }
                break;
            }
            default: {
                break;
            }
        }
    }
    public onFileAction(action: string) {
        onFileActionMethods(action);
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
