import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    OnChanges,
    ViewChild,
    Input,
    SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

//Services
import { DropDownService } from 'src/app/shared/services/drop-down.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { ConfirmationService } from 'src/app/core/components/modals/confirmation-modal/state/state/services/confirmation.service';
import { ModalService } from 'src/app/shared/components/ta-modal/modal.service';
import { DriverCdlService } from '../../../../services/driver-cdl.service';
import { DriverMedicalService } from '../../../../services/driver-medical.service';
import { DriverMvrService } from '../../../../services/driver-mvr.service';
import { DriverTestService } from '../../../../services/driver-test.service';

//Components
import { ConfirmationModalComponent } from 'src/app/core/components/modals/confirmation-modal/confirmation-modal.component';

//Models
import { GetMvrModalResponse } from 'appcoretruckassist';

//Animations
import {
    animate,
    style,
    transition,
    trigger,
    state,
    keyframes,
} from '@angular/animations';
import { card_component_animation } from 'src/app/core/components/shared/animations/card-component.animations';

//Helpers
import { dropActionNameDriver } from 'src/app/core/utils/function-drop.details-page';
import { onFileActionMethods } from 'src/app/core/utils/methods.globals';
import { Titles } from 'src/app/core/utils/application.decorators';
import { convertDateFromBackend } from 'src/app/core/utils/methods.calculations';

@Titles()
@Component({
    selector: 'app-driver-details-item',
    templateUrl: './driver-details-item.component.html',
    styleUrls: ['./driver-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        card_component_animation('showHideCardBody'),
        trigger('cardAnimation', [
            state('in', style({ opacity: 1, 'max-height': '0px' })),
            transition(':enter', [
                animate(
                    5100,
                    keyframes([
                        style({ opacity: 0, 'max-height': '0px' }),
                        style({ opacity: 1, 'max-height': '600px' }),
                    ])
                ),
            ]),
            transition(':leave', [
                animate(
                    5100,
                    keyframes([
                        style({ opacity: 1, 'max-height': '600px' }),
                        style({ opacity: 0, 'max-height': '0px' }),
                    ])
                ),
            ]),
        ]),
    ],
})
export class DriverDetailsItemComponent
    implements OnInit, OnDestroy, OnChanges
{
    private destroy$ = new Subject<void>();
    @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
    @Input() drivers: any = null;
    public cdlNote: UntypedFormControl = new UntypedFormControl();
    public mvrNote: UntypedFormControl = new UntypedFormControl();
    public testNote: UntypedFormControl = new UntypedFormControl();
    public medNote: UntypedFormControl = new UntypedFormControl();
    public toggler: boolean[] = [];
    public showMoreEmployment: boolean = false;
    public dataDropDown: any;
    public dataDropDownMvr: any;
    public expDateCard: any;
    public dataCDl: any;
    public templateName: boolean;
    public hasActiveCdl: boolean;
    public arrayOfRenewCdl: any[] = [];
    public inactiveCdl: boolean;
    public test: boolean;
    public dataCdl: any;
    public dataMvr: any;
    public dataMedical: any;
    public dataTest: any;
    public isActiveCdl: boolean;
    public activateShow: any[] = [];
    public expiredCard: any[] = [];
    public currentIndex: number;
    public activeCdl: any;
    public currentDate: any;

    constructor(
        private cdlService: DriverCdlService,
        private medicalService: DriverMedicalService,
        private mvrService: DriverMvrService,
        private testService: DriverTestService,
        private confirmationService: ConfirmationService,
        private tableService: TruckassistTableService,
        private dropDownService: DropDownService,
        private modalService: ModalService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.drivers.firstChange && changes.drivers.currentValue) {
            this.drivers = changes.drivers.currentValue;
            this.getExpireDate();

            this.activeCdl = changes.drivers.currentValue[0].data?.cdls?.filter(
                (item) => item.status === 1
            );
        }
        this.initTableOptions(changes.drivers.currentValue[0].data);
    }

    ngOnInit(): void {
        this.getExpireDate();
        this.activeCdl = this.drivers[0].data.cdls.filter(
            (item) => item.status === 1
        );

        this.dataMvr = this.drivers[0].data.mvrs;
        this.dataMedical = this.drivers[0].data.medicals;
        this.dataTest = this.drivers[0].data.dataTest;

        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    let driverData = this.drivers[0].data;
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'cdl') {
                                this.deleteCdlByIdFunction(res.id);
                                if (res?.data?.newCdlID) {
                                    setTimeout(() => {
                                        this.activateCdl(res?.data?.newCdlID);
                                    }, 1000);
                                }
                            } else if (res.template === 'medical') {
                                this.deleteMedicalByIdFunction(res.id);
                            } else if (res.template === 'mvr') {
                                this.deleteMvrByIdFunction(res.id);
                            } else if (res.template === 'test') {
                                this.deleteTestByIdFunction(res.id);
                            }
                            break;
                        }
                        case 'info': {
                            switch (res.template) {
                                case 'cdl': {
                                    /*
                                    const timeout = setTimeout(() => {                        
                                        this.modalService.openModal(
                                            DriverCdlModalComponent,
                                            { size: 'small' },
                                            {
                                                id: driverData.id,
                                                file_id:
                                                    driverData?.file_id,
                                                type: 'renew-licence',
                                                renewData:
                                                    res?.data,
                                            }
                                        );
                                        clearTimeout(timeout);
                                    }, 300);
                                    */
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
        this.currentDate = moment(new Date()).format();
    }
    public getExpireDate() {
        this.dataCDl = this.drivers[0]?.data?.cdls?.map((ele) => {
            let endDate = moment(ele.expDate);

            if (
                moment(ele.expDate).isBefore(moment()) ||
                endDate.diff(moment(), 'days') <= 365
            ) {
                this.expDateCard = false;
            } else {
                this.expDateCard = true;
            }
            if (ele.status == 0) {
                this.inactiveCdl = true;
            } else {
                this.inactiveCdl = false;
            }

            return {
                ...ele,
                showButton: this.expDateCard,
                inactiveCdl: this.inactiveCdl,
            };
        });
    }
    public getNameForDrop(name: string, cdlId?: number) {
        this.templateName = name === 'cdl' ? false : true;
        this.currentIndex = this.drivers[1]?.data?.cdls?.findIndex(
            (item) => item.id === cdlId
        );
        this.initTableOptions(this.drivers[0].data);
        if (name === 'cdl') {
            this.getExpireDate();
        }
    }

    private activateCdl(id: number) {
        this.cdlService
            .activateCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({});
    }

    /**Function for dots in cards */
    public initTableOptions(data: any): void {
        this.arrayOfRenewCdl = [];
        this.activateShow = [];
        this.expiredCard = [];
        data?.cdls?.map((item) => {
            let endDate = moment(item.expDate);
            let daysDiff = endDate.diff(moment(), 'days');
            if (moment(item.expDate).isBefore(moment())) {
                this.expiredCard.push(true);
            } else {
                this.expiredCard.push(false);
            }
            if (!item.status) {
                this.activateShow.push(true);
            } else {
                this.activateShow.push(false);
            }

            if (daysDiff < -365) {
                this.arrayOfRenewCdl.push(true);
            } else {
                this.arrayOfRenewCdl.push(false);
            }
        });

        this.dataDropDown = {
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
                    iconName: 'edit',
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    iconName: 'view-details',
                    show: true,
                },
                {
                    title: 'Renew',
                    name: 'renew',
                    svg: 'assets/svg/common/ic_reload_renew.svg',
                    iconName: 'renew',
                    disabled: this.arrayOfRenewCdl[this.currentIndex],
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    iconName: 'share',
                    show: true,
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    iconName: 'print',
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title:
                        this.activateShow[this.currentIndex] == true
                            ? 'Activate'
                            : 'Void',
                    name:
                        this.activateShow[this.currentIndex] == true
                            ? 'activate-item'
                            : 'deactivate-item',
                    iconName:
                        this.activateShow[this.currentIndex] == true
                            ? 'activate-item'
                            : 'deactivate-item',
                    svg:
                        this.activateShow[this.currentIndex] == true
                            ? 'assets/svg/common/ic_deactivate.svg'
                            : 'assets/svg/common/ic_cancel_violation.svg',
                    show:
                        !this.templateName &&
                        this.expiredCard[this.currentIndex] == false
                            ? true
                            : false,
                    redIcon:
                        this.activateShow[this.currentIndex] == true
                            ? false
                            : true,
                    blueIcon:
                        this.activateShow[this.currentIndex] == true
                            ? true
                            : false,
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    iconName: 'delete',
                    danger: true,
                    show: true,
                    redIcon: true,
                },
            ],
            export: true,
        };

        this.dataDropDownMvr = {
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
                    iconName: 'edit',
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    iconName: 'view-details',
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    iconName: 'share',
                    show: true,
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    iconName: 'print',
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    iconName: 'delete',
                    danger: true,
                    show: true,
                    redIcon: true,
                },
            ],
            export: true,
        };
    }

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
            .subscribe((item) => (this.dataTest = item));
    }

    public preloadData(data: any, title?: any) {
        if (title == 'cdl') {
            this.dataCdl = data;
        } else if (title == 'test') {
            this.dataTest = data;
        } else if (title == 'med') {
            this.dataMedical = data;
        } else if (title == 'mvr') {
            this.dataMvr = data;
        }
    }

    public optionsEvent(eventData: any, action: string) {
        const name = dropActionNameDriver(eventData, action);
        let driverId = this.drivers[0].data.id;
        let dataCdls: any = [];

        if (
            this.activeCdl.length &&
            this.activeCdl[0].id == eventData.id &&
            (eventData.type == 'deactivate-item' ||
                eventData.type == 'delete-item')
        ) {
            this.mvrService
                .getMvrModal(driverId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res: GetMvrModalResponse) => {
                        res?.cdls?.map((item) => {
                            if (item.id != eventData.id) {
                                dataCdls.push({
                                    ...item,
                                    name: item.cdlNumber,
                                });
                            }
                        });
                    },
                });
        }

        let dataForCdl;
        if (
            (this.activeCdl.length && eventData.type === 'activate-item') ||
            eventData.type === 'deactivate-item'
        ) {
            dataForCdl = this.activeCdl;
        } else {
            dataForCdl = this.dataCdl;
        }

        setTimeout(() => {
            this.dropDownService.dropActions(
                eventData,
                name,
                dataForCdl,
                this.dataMvr,
                this.dataMedical,
                this.dataTest,
                this.drivers[0].data.id,
                null,
                null,
                this.drivers[0].data,
                null,
                null,
                dataCdls
            );
        }, 200);
    }
    public openCommand(cdl?: any, modal?: string) {
        if (this.activeCdl.length) {
            let data = this.drivers;
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    data: {
                        ...this.activeCdl[0],
                        state: this.activeCdl[0].state.stateShortName,
                        data,
                        driver: {
                            id: this.drivers[0].data.id,
                            file_id: cdl.id,
                            type: 'renew-licence',
                            renewData: cdl,
                        },
                    },
                    template: 'cdl',
                    type: 'info',
                    subType: 'cdl void',
                    cdlStatus: 'New',
                    modalHeader: true,
                }
            );
        } else {
            let data = this.drivers;
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    data: { ...cdl, state: cdl.state.stateShortName, data },
                    template: 'cdl',
                    type: 'activate',
                    //subType: 'cdl void',
                    cdlStatus: 'Activate',
                    modalHeader: true,
                }
            );
        }
    }

    public onButtonAction(data: { template: string; action: string }) {
        switch (data.template) {
            case 'cdl': {
                if (data.action === 'attachments') {
                    // TODO: attachments
                } else if (data.action === 'notes') {
                    // TODO: notes
                } else {
                    // TODO: dots
                }
                break;
            }
        }
    }

    public deleteCdlByIdFunction(id: number) {
        this.cdlService
            .deleteCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private deleteMedicalByIdFunction(id: number) {
        this.medicalService
            .deleteMedicalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private deleteMvrByIdFunction(id: number) {
        this.mvrService
            .deleteMvrById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private deleteTestByIdFunction(id: number) {
        this.testService
            .deleteTestById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }
    public onShowDetails(componentData: any) {
        componentData.showDetails = !componentData.showDetails;
    }
    /**Function retrun id */
    public identity(index: number, item: any): number {
        return index;
    }

    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string) {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    public onFileAction(action: string) {
        onFileActionMethods(action);
    }

    public formatDate(mod) {
        return convertDateFromBackend(mod);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
