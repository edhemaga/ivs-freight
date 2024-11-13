import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// modules
import moment from 'moment';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';
import { cardAnimation } from '@shared/animations/card.animation';

// components
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';

// services
import { DropDownService } from '@shared/services/drop-down.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DriverMedicalService } from '@pages/driver/pages/driver-modals/driver-medical-modal/services/driver-medical.service';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DriverDetailsItemHelper } from '@pages/driver/pages/driver-details/components/driver-details-item/utils/helpers/driver-details-item.helper';
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// enums
import { DriverDetailsItemStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-item/enums/driver-details-item-string.enum';

// models
import { DriverResponse, MedicalResponse } from 'appcoretruckassist';
import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';

@Component({
    selector: 'app-driver-details-item-medical',
    templateUrl: './driver-details-item-medical.component.html',
    styleUrls: ['./driver-details-item-medical.component.scss'],
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
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TaCustomCardComponent,
        TaProgressExpirationComponent,
    ],
})
export class DriverDetailsItemMedicalComponent
    implements OnInit, OnChanges, OnDestroy
{
    @ViewChild('driverMedicalFiles') driverMedicalFiles: TaUploadFilesComponent;

    @Input() cardsData: MedicalResponse[];
    @Input() driver: DriverResponse;

    private destroy$ = new Subject<void>();

    public medicalNote: UntypedFormControl = new UntypedFormControl();

    public medicalData: MedicalResponse[] = [];
    public medicalOptionsDropdownList: DetailsDropdownOptions;

    public isMedicalCardOpen: boolean[] = [];

    public currentDate: string;

    public toggler: boolean[] = [];

    constructor(
        private dropDownService: DropDownService,
        private confirmationService: ConfirmationService,
        private medicalService: DriverMedicalService
    ) {}

    ngOnInit(): void {
        this.getCurrentDate();

        this.confirmationSubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.cardsData?.currentValue) {
            this.getDetailsOptions();

            this.getMedicalData(changes.cardsData.currentValue);
        }
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

    public toggleResizePage(value: number, indexName: string): void {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ data, type, template }) => {
                if (template === DriverDetailsItemStringEnum.MEDICAL) {
                    if (type === DriverDetailsItemStringEnum.DELETE)
                        this.deleteMedicalById(data?.id);
                }
            });
    }

    public handleIsCardOpenEmit(event: {
        isCardOpen: boolean;
        id: number;
    }): void {
        const { isCardOpen, id } = event;

        const index = this.medicalData.findIndex(
            (medical) => medical.id === id
        );

        this.isMedicalCardOpen[index] = isCardOpen;
    }

    public getMedicalData(data: MedicalResponse[]): void {
        this.medicalData = data?.map((medical) => {
            const isExpDateCard = moment(medical.expDate).isBefore(moment());

            return {
                ...medical,
                isExpired: isExpDateCard,
            };
        });
    }

    public getDetailsOptions(): void {
        this.medicalOptionsDropdownList =
            DriverDetailsItemHelper.getTestMedicalMvrDropdownList(
                this.driver?.status
            );
    }

    private deleteMedicalById(id: number): void {
        const data = {
            id,
            driverId: this.driver?.id,
            driverStatus: this.driver?.status,
        };

        this.medicalService
            .deleteMedicalById(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public onOptions(
        event: { id: number; type: string },
        action: string
    ): void {
        const name = DropActionNameHelper.dropActionNameDriver(event, action);
        const medical = this.cardsData.find(
            (medical) => medical.id === event.id
        );

        if (
            event.type === DriverDetailsItemStringEnum.EDIT ||
            event.type === DriverDetailsItemStringEnum.DELETE_ITEM
        )
            setTimeout(() => {
                this.dropDownService.dropActions(
                    event,
                    name,
                    null,
                    null,
                    medical,
                    null,
                    this.driver.id,
                    null,
                    null,
                    this.driver,
                    null,
                    null,
                    null
                );
            }, 200);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
