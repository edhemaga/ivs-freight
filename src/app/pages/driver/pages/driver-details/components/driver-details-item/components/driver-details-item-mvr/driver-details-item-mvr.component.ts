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
import { DriverMvrService } from '@pages/driver/pages/driver-modals/driver-mvr-modal/services/driver-mvr.service';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DriverDetailsItemHelper } from '@pages/driver/pages/driver-details/components/driver-details-item/utils/helpers/driver-details-item.helper';
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// enums
import { DriverDetailsItemStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-item/enums/driver-details-item-string.enum';

// models
import { DriverResponse, MvrResponse } from 'appcoretruckassist';
import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';

@Component({
    selector: 'app-driver-details-item-mvr',
    templateUrl: './driver-details-item-mvr.component.html',
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
    styleUrls: ['./driver-details-item-mvr.component.scss'],
})
export class DriverDetailsItemMvrComponent
    implements OnInit, OnChanges, OnDestroy
{
    @ViewChild('driverMvrFiles') driverMvrFiles: TaUploadFilesComponent;

    @Input() mvrList: MvrResponse[];
    @Input() driver: DriverResponse;

    private destroy$ = new Subject<void>();

    public mvrNote: UntypedFormControl = new UntypedFormControl();

    public mvrData: MvrResponse[] = [];
    public mvrOptionsDropdownList: DetailsDropdownOptions;

    public isMvrCardOpen: boolean[] = [];

    public currentDate: string;

    public toggler: boolean[] = [];

    constructor(
        private dropDownService: DropDownService,
        private confirmationService: ConfirmationService,
        private mvrService: DriverMvrService
    ) {}

    ngOnInit(): void {
        this.getCurrentDate();

        this.confirmationSubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.mvrList?.currentValue) {
            this.getDetailsOptions();

            this.getMvrData(changes.mvrList.currentValue);
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
                if (template === DriverDetailsItemStringEnum.MVR) {
                    if (type === DriverDetailsItemStringEnum.DELETE)
                        this.deleteMvrById(data?.id);
                }
            });
    }

    public handleIsCardOpenEmit(event: {
        isCardOpen: boolean;
        id: number;
    }): void {
        const { isCardOpen, id } = event;

        const index = this.mvrData.findIndex((medical) => medical.id === id);

        this.isMvrCardOpen[index] = isCardOpen;
    }

    public getMvrData(data: MvrResponse[]): void {
        this.mvrData = data?.map((mvr) => {
            const isExpDateCard = moment(mvr.expDate).isBefore(moment());

            return {
                ...mvr,
                isExpired: isExpDateCard,
            };
        });
    }

    public getDetailsOptions(): void {
        this.mvrOptionsDropdownList =
            DriverDetailsItemHelper.getTestMedicalMvrDropdownList(
                this.driver?.status
            );
    }

    private deleteMvrById(id: number): void {
        const data = {
            id,
            driverId: this.driver?.id,
            driverStatus: this.driver?.status,
        };

        this.mvrService
            .deleteMvrById(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public onOptions(
        event: { id: number; type: string },
        action: string
    ): void {
        const name = DropActionNameHelper.dropActionNameDriver(event, action);
        const mvr = this.mvrList.find((mvr) => mvr.id === event.id);

        if (
            event.type === DriverDetailsItemStringEnum.EDIT ||
            event.type === DriverDetailsItemStringEnum.DELETE_ITEM
        )
            setTimeout(() => {
                this.dropDownService.dropActions(
                    event,
                    name,
                    null,
                    mvr,
                    null,
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
