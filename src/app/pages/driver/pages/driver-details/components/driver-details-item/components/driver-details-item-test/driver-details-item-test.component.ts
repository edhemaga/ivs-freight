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

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';
import { cardAnimation } from '@shared/animations/card.animation';

// components
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// services
import { DropDownService } from '@shared/services/drop-down.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DriverDrugAlcoholTestService } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/services/driver-drug-alcohol-test.service';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DriverDetailsItemHelper } from '@pages/driver/pages/driver-details/components/driver-details-item/utils/helpers/driver-details-item.helper';
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// enums
import { DriverDetailsItemStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-item/enums/driver-details-item-string.enum';

// models
import { DriverResponse, TestResponse } from 'appcoretruckassist';
import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';

@Component({
    selector: 'app-driver-details-item-test',
    templateUrl: './driver-details-item-test.component.html',
    styleUrls: ['./driver-details-item-test.component.scss'],
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
    ],
})
export class DriverDetailsItemTestComponent
    implements OnInit, OnChanges, OnDestroy
{
    @ViewChild('driverTestFiles') driverTestFiles: TaUploadFilesComponent;

    @Input() testList: TestResponse[];
    @Input() driver: DriverResponse;

    private destroy$ = new Subject<void>();

    public testNote: UntypedFormControl = new UntypedFormControl();

    public testOptionsDropdownList: DetailsDropdownOptions;

    public toggler: boolean[] = [];

    constructor(
        private dropDownService: DropDownService,
        private confirmationService: ConfirmationService,
        private testService: DriverDrugAlcoholTestService
    ) {}

    ngOnInit(): void {
        this.confirmationSubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.testList?.currentValue) this.getDetailsOptions();
    }

    public trackByIdentity(index: number): number {
        return index;
    }

    public formatDate(date: string): string {
        return MethodsCalculationsHelper.convertDateFromBackend(date);
    }

    public toggleResizePage(value: number, indexName: string): void {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ data, type, template }) => {
                if (template === DriverDetailsItemStringEnum.TEST) {
                    if (type === DriverDetailsItemStringEnum.DELETE)
                        this.deleteTestById(data?.id);
                }
            });
    }

    public getDetailsOptions(): void {
        this.testOptionsDropdownList =
            DriverDetailsItemHelper.getTestMedicalMvrDropdownList(
                this.driver?.status
            );
    }

    public onOptions(
        event: { id: number; type: string },
        action: string
    ): void {
        const name = DropActionNameHelper.dropActionNameDriver(event, action);
        const test = this.testList.find((test) => test.id === event.id);

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
                    null,
                    test,
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

    private deleteTestById(id: number): void {
        const data = {
            id,
            driverId: this.driver?.id,
            driverStatus: this.driver?.status,
        };

        this.testService
            .deleteTestById(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
