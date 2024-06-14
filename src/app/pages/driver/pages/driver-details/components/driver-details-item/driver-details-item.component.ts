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

// services
import { DropDownService } from '@shared/services/drop-down.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DriverCdlService } from '@pages/driver/pages/driver-modals/driver-cdl-modal/services/driver-cdl.service';
import { DriverMedicalService } from '@pages/driver/pages/driver-modals/driver-medical-modal/services/driver-medical.service';
import { DriverMvrService } from '@pages/driver/pages/driver-modals/driver-mvr-modal/services/driver-mvr.service';
import { DriverDrugAlcoholTestService } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/services/driver-drug-alcohol-test.service';

// components
import { DriverDetailsCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/driver-details-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { DriverDetailsItemCdlComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/components/driver-details-item-cdl/driver-details-item-cdl.component';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';
import { cardAnimation } from '@shared/animations/card.animation';

// helpers
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// enums
import { DriverDetailsItemStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-item/enums/driver-details-item-string.enum';

// models
import { GetMvrModalResponse } from 'appcoretruckassist';
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
        DriverDetailsItemCdlComponent,
    ],
})
export class DriverDetailsItemComponent
    implements OnInit, OnDestroy, OnChanges
{
    @Input() detailsConfig: DriverDetailsConfig;

    private destroy$ = new Subject<void>();

    public toggler: boolean[] = [];

    ///////////////////////////////////////

    public mvrNote: UntypedFormControl = new UntypedFormControl();
    public testNote: UntypedFormControl = new UntypedFormControl();
    public medNote: UntypedFormControl = new UntypedFormControl();

    public dataDropDownMvr: any;

    public test: boolean;

    public dataMvr: any;
    public dataMedical: any;
    public dataTest: any;

    constructor(
        private cdlService: DriverCdlService,
        private medicalService: DriverMedicalService,
        private mvrService: DriverMvrService,
        private testService: DriverDrugAlcoholTestService,
        private confirmationService: ConfirmationService,
        private tableService: TruckassistTableService,
        private dropDownService: DropDownService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            !changes.detailsConfig.firstChange &&
            changes.detailsConfig.currentValue
        ) {
            this.detailsConfig = changes.detailsConfig.currentValue;
        }

        this.getDetailsOptions(changes.detailsConfig.currentValue[0].data);
    }

    ngOnInit(): void {
        console.log('detailsConfig', this.detailsConfig);

        ////////////////////////////////

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
                            if (
                                res.template === DriverDetailsItemStringEnum.CDL
                            ) {
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
                                case DriverDetailsItemStringEnum.CDL: {
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

    public getNameForDrop(type: string, cdlId?: number): void {
        this.getDetailsOptions(this.detailsConfig[0].data);
    }

    public getDetailsOptions(data: any): void {
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
                    name: 'delete-cdl',
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

    public optionsEvent(eventData: any, action: string): void {
        /* const name = DropActionNameHelper.dropActionNameDriver(
            eventData,
            action
        );
        let driverId = this.detailsConfig[0].data.id;
        let dataCdls: any = [];

        if (
            this.activeCdlArray.length &&
            this.activeCdlArray[0].id == eventData.id &&
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
            (this.activeCdlArray.length && eventData.type === 'activate-item') ||
            eventData.type === 'deactivate-item'
        ) {
            dataForCdl = this.activeCdlArray;
        } else {
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
        }, 200); */
    }

    ///////////////////////////////////////////////////////////////////////////////////

    public onFileAction(event: File, type: string): void {}

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
        if (title == DriverDetailsItemStringEnum.CDL) {
        } else if (title == 'test') {
            this.dataTest = data;
        } else if (title == 'med') {
            this.dataMedical = data;
        } else if (title == 'mvr') {
            this.dataMvr = data;
        }
    }

    public onButtonAction(data: { template: string; action: string }) {
        switch (data.template) {
            case DriverDetailsItemStringEnum.CDL: {
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
    public toggleResizePage(value: number, indexName: string): void {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
    }
}
