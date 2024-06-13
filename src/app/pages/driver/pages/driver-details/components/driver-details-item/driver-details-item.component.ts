import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    OnChanges,
    Input,
    SimpleChanges,
} from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// decorators
import { Titles } from '@core/decorators/titles.decorator';

// moment
import moment from 'moment';

// services
import { DropDownService } from '@shared/services/drop-down.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ModalService } from '@shared/services/modal.service';
import { DriverCdlService } from '@pages/driver/pages/driver-modals/driver-cdl-modal/services/driver-cdl.service';
import { DriverMedicalService } from '@pages/driver/pages/driver-modals/driver-medical-modal/services/driver-medical.service';
import { DriverMvrService } from '@pages/driver/pages/driver-modals/driver-mvr-modal/services/driver-mvr.service';
import { DriverDrugAlcoholTestService } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/services/driver-drug-alcohol-test.service';

// components
import { DriverDetailsCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/driver-details-card.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';
import { cardAnimation } from '@shared/animations/card.animation';

// helpers
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// enums
import { DriverDetailsItemStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-item/enums/driver-details-item-string.enum';

// models
import { CdlResponse, GetMvrModalResponse } from 'appcoretruckassist';
import { DriverDetailsConfig } from '@pages/driver/pages/driver-details/models/driver-details-config.model';

@Titles()
@Component({
    selector: 'app-driver-details-item',
    templateUrl: './driver-details-item.component.html',
    styleUrls: ['./driver-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        cardComponentAnimation('showHideCardBody'),
        cardAnimation('cardAnimation'),
    ],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,

        // components
        DriverDetailsCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCounterComponent,
        TaCustomCardComponent,
    ],
})
export class DriverDetailsItemComponent
    implements OnInit, OnDestroy, OnChanges
{
    @Input() detailsConfig: DriverDetailsConfig;

    private destroy$ = new Subject<void>();

    public toggler: boolean[] = [];

    public cdlData: CdlResponse;

    public currentDate: string;

    public dataCdl: any;

    ///////////////////////////////////////

    public cdlNote: UntypedFormControl = new UntypedFormControl();
    public mvrNote: UntypedFormControl = new UntypedFormControl();
    public testNote: UntypedFormControl = new UntypedFormControl();
    public medNote: UntypedFormControl = new UntypedFormControl();

    public showMoreEmployment: boolean = false;
    public dataDropDown: any;
    public dataDropDownMvr: any;

    public templateName: boolean;
    public hasActiveCdl: boolean;
    public arrayOfRenewCdl: any[] = [];
    public test: boolean;

    public dataMvr: any;
    public dataMedical: any;
    public dataTest: any;
    public isActiveCdl: boolean;
    public activateShow: any[] = [];
    public expiredCard: any[] = [];
    public currentIndex: number;
    public activeCdl: any;

    constructor(
        private cdlService: DriverCdlService,
        private medicalService: DriverMedicalService,
        private mvrService: DriverMvrService,
        private testService: DriverDrugAlcoholTestService,
        private confirmationService: ConfirmationService,
        private tableService: TruckassistTableService,
        private dropDownService: DropDownService,
        private modalService: ModalService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            !changes.detailsConfig.firstChange &&
            changes.detailsConfig.currentValue
        ) {
            this.detailsConfig = changes.detailsConfig.currentValue;
            this.getCdlData();

            this.activeCdl =
                changes.detailsConfig.currentValue[0].data?.cdls?.filter(
                    (item) => item.status === 1
                );
        }
        this.initTableOptions(changes.detailsConfig.currentValue[0].data);
    }

    ngOnInit(): void {
        console.log('detailsConfig', this.detailsConfig);

        this.getCdlData();

        this.getCurrentDate();

        ////////////////////////////////

        this.activeCdl = this.detailsConfig[0].data.cdls.filter(
            (item) => item.status === 1
        );

        this.dataMvr = this.detailsConfig[0].data.mvrs;
        this.dataMedical = this.detailsConfig[0].data.medicals;
        this.dataTest = this.detailsConfig[0].data.dataTest;

        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    let driverData = this.detailsConfig[0].data;
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
    }

    public trackByIdentity(index: number): number {
        return index;
    }

    public formatDate(date: string): string {
        return MethodsCalculationsHelper.convertDateFromBackend(date);
    }

    public getCurrentDate(): void {
        this.currentDate = moment(new Date()).format();
    }

    public getCdlData(): void {
        this.cdlData = this.detailsConfig[1]?.data?.map((cdl: CdlResponse) => {
            const endDate = moment(cdl.expDate);

            const isExpDateCard = moment(cdl.expDate).isBefore(moment());

            const isDeadlineExpDateCard =
                endDate.diff(moment(), DriverDetailsItemStringEnum.DAYS) <= 365;

            return {
                ...cdl,
                showButton:
                    (!isExpDateCard && isDeadlineExpDateCard) ||
                    (isExpDateCard && this.detailsConfig[1]?.data.length === 1),
                isExpired: isExpDateCard,
            };
        });

        console.log('cdlData', this.cdlData);
    }

    public openCommand(cdl?: CdlResponse): void {
        let data = this.detailsConfig;

        if (this.activeCdl.length) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    data: {
                        ...this.activeCdl[0],
                        state: this.activeCdl[0].state.stateShortName,
                        data,
                        driver: {
                            id: this.detailsConfig[0].data.id,
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

    ///////////////////////////////////////////////////////////////////////////////////

    public onFileAction(event: File, type: string): void {}

    public getNameForDrop(name: string, cdlId?: number) {
        this.templateName = name === 'cdl' ? false : true;
        this.currentIndex = this.detailsConfig[1]?.data?.cdls?.findIndex(
            (item) => item.id === cdlId
        );
        this.initTableOptions(this.detailsConfig[0].data);
        if (name === 'cdl') {
            this.getCdlData();
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
        const name = DropActionNameHelper.dropActionNameDriver(
            eventData,
            action
        );
        let driverId = this.detailsConfig[0].data.id;
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
                this.detailsConfig[0].data.id,
                null,
                null,
                this.detailsConfig[0].data,
                null,
                null,
                dataCdls
            );
        }, 200);
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

    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string) {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
    }
}
