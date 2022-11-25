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
import { FormControl } from '@angular/forms';
import { DriverResponse } from 'appcoretruckassist';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { DropDownService } from 'src/app/core/services/details-page/drop-down.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { dropActionNameDriver } from 'src/app/core/utils/function-drop.details-page';
import { onFileActionMethods } from 'src/app/core/utils/methods.globals';
import { ConfirmationModalComponent } from '../../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../../modals/confirmation-modal/confirmation.service';
import { card_component_animation } from '../../../shared/animations/card-component.animations';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { CdlTService } from '../../state/cdl.service';
import { MedicalTService } from '../../state/medical.service';
import { MvrTService } from '../../state/mvr.service';
import { TestTService } from '../../state/test.service';
import { DriverCdlModalComponent } from '../../../modals/driver-modal/driver-cdl-modal/driver-cdl-modal.component';

@Component({
    selector: 'app-driver-details-item',
    templateUrl: './driver-details-item.component.html',
    styleUrls: ['./driver-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [card_component_animation('showHideCardBody')],
})
export class DriverDetailsItemComponent
    implements OnInit, OnDestroy, OnChanges
{
    private destroy$ = new Subject<void>();
    @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
    @Input() drivers: DriverResponse | any = null;
    public cdlNote: FormControl = new FormControl();
    public mvrNote: FormControl = new FormControl();
    public testNote: FormControl = new FormControl();
    public medNote: FormControl = new FormControl();
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
    constructor(
        private cdlService: CdlTService,
        private medicalService: MedicalTService,
        private mvrService: MvrTService,
        private testService: TestTService,
        private confirmationService: ConfirmationService,
        private notificationService: NotificationService,
        private tableService: TruckassistTableService,
        private dropDownService: DropDownService,
        private modalService: ModalService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.drivers.firstChange && changes.drivers.currentValue) {
            this.drivers = changes.drivers.currentValue;
            this.getExpireDate();

            this.activeCdl = changes.drivers.currentValue[0].data.cdls.filter(
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
        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    console.log('confirmation service: ', res);
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
                        case 'info': {
                            switch (res.template) {
                                case 'cdl': {
                                    const timeout = setTimeout(() => {
                                        this.modalService.openModal(
                                            DriverCdlModalComponent,
                                            { size: 'small' },
                                            {
                                                id: res.data.driver?.id,
                                                file_id:
                                                    res.data.driver.file_id,
                                                type: 'renew-licence',
                                                renewData:
                                                    res.data.driver.renewData,
                                            }
                                        );
                                        clearTimeout(timeout);
                                    }, 300);

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
    }
    public getExpireDate() {
        this.dataCDl = this.drivers[1]?.data?.cdls?.map((ele) => {
          
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
    /**Function for dots in cards */
    public initTableOptions(data: DriverResponse): void {
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
            if (item.dateDeactivated) {
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
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    show: true,
                },
                {
                    title: 'Renew',
                    name: 'renew',
                    svg: 'assets/svg/common/ic_reload_renew.svg',
                    disabled: this.arrayOfRenewCdl[this.currentIndex],
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
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
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: 'View Details',
                    name: 'view-details',
                    svg: 'assets/svg/common/ic_hazardous-info.svg',
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
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
                    danger: true,
                    show: true,
                    redIcon: true,
                },
            ],
            export: true,
        };
    }

    public getCdlById(id: number) {
        console.log('--here--getCdlById', id);
        this.cdlService
            .getCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataCdl = item));
    }

    public getMedicalById(id: number) {
        console.log('--here--getMedicalById')
        this.medicalService
            .getMedicalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataMedical = item));
    }

    public getMvrById(id: number) {
        console.log('--here--getMvrById')
        this.mvrService
            .getMvrById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataMvr = item));
    }

    public getTestById(id: number) {
        console.log('--here--getTestById')
        this.testService
            .getTestById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.dataTest = item));
    }
    public optionsEvent(any: any, action: string) {
        const name = dropActionNameDriver(any, action);
        let dataForCdl;
        console.log(any);

        if (
            (this.activeCdl.length && any.type === 'activate-item') ||
            any.type === 'deactivate-item'
        ) {
            dataForCdl = this.activeCdl;
        } else {
            dataForCdl = this.dataCdl;
        }

        setTimeout(() => {
            this.dropDownService.dropActions(
                any,
                name,
                dataForCdl,
                this.dataMvr,
                this.dataMedical,
                this.dataTest,
                this.drivers[0].data.id,
                null,
                null,
                null,
                null,
                this.drivers[0].data
            );
        }, 100);
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
                    type: 'info',
                    subType: 'cdl void',
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
                next: () => {
                    this.notificationService.success(
                        'Cdl successfully deleted',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        `Cdl with id: ${id} couldn't be deleted`,
                        'Error:'
                    );
                },
            });
    }

    private deleteMedicalByIdFunction(id: number) {
        this.medicalService
            .deleteMedicalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Medical successfully deleted',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        `Medical with id: ${id} couldn't be deleted`,
                        'Error:'
                    );
                },
            });
    }

    private deleteMvrByIdFunction(id: number) {
        this.mvrService
            .deleteMvrById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Mvr successfully deleted',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        `Mvr with id: ${id} couldn't be deleted`,
                        'Error:'
                    );
                },
            });
    }

    private deleteTestByIdFunction(id: number) {
        this.testService
            .deleteTestById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Test successfully deleted',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        `Test with id: ${id} couldn't be deleted`,
                        'Error:'
                    );
                },
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
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
