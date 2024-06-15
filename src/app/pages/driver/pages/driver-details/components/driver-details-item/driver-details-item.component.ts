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
import { DriverDetailsItemTestComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/components/driver-details-item-test/driver-details-item-test.component';

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
        DriverDetailsItemTestComponent,
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
    public medNote: UntypedFormControl = new UntypedFormControl();

    public dataDropDownMvr: any;

    public test: boolean;

    public dataMvr: any;
    public dataMedical: any;

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
    }

    ngOnInit(): void {
        console.log('detailsConfig', this.detailsConfig);

        ////////////////////////////////

        this.dataMvr = this.detailsConfig[0].data.mvrs;
        this.dataMedical = this.detailsConfig[0].data.medicals;
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

    ///////////////////////////////////////////////////////////////////////////////////

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

    public preloadData(data: any, title?: any) {
        if (title == DriverDetailsItemStringEnum.CDL) {
        } else if (title == 'test') {
        } else if (title == 'med') {
            this.dataMedical = data;
        } else if (title == 'mvr') {
            this.dataMvr = data;
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
