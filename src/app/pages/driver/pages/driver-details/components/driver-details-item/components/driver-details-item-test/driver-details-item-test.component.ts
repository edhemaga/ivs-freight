import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';

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

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DriverDetailsItemHelper } from '@pages/driver/pages/driver-details/components/driver-details-item/utils/helpers/driver-details-item.helper';
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// enums
import { DriverDetailsItemStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-item/enums/driver-details-item-string.enum';

// models
import { DriverResponse, MedicalResponse } from 'appcoretruckassist';
import { DetailsDropdownOptions } from '@pages/driver/pages/driver-details/models/details-dropdown-options.model';

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
export class DriverDetailsItemTestComponent implements OnChanges {
    @Input() cardsData: MedicalResponse[];
    @Input() driver: DriverResponse;

    public testNote: UntypedFormControl = new UntypedFormControl();

    public testOptionsDropdownList: DetailsDropdownOptions[] = [];

    public toggler: boolean[] = [];

    constructor(private dropDownService: DropDownService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.cardsData?.currentValue) {
            this.getDetailsOptions(changes.cardsData.currentValue);
        }
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

    public getDetailsOptions(data: MedicalResponse[]): void {
        data.forEach((_, index) => {
            this.testOptionsDropdownList[index] =
                DriverDetailsItemHelper.getTestMedicalMvrDropdownList(
                    this.driver?.status
                );
        });
    }

    public onOptions(
        event: { id: number; type: string },
        action: string
    ): void {
        const name = DropActionNameHelper.dropActionNameDriver(event, action);
        const test = this.cardsData.find((test) => test.id === event.id);

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
}
