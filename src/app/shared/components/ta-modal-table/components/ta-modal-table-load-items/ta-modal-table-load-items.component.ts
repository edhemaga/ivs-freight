import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormGroup,
} from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Const
import { LoadStopItems } from '@pages/load/pages/load-modal/utils/constants/load-stop-items.constants';

// Enums
import { TaModalTableStringEnum } from '@shared/components/ta-modal-table/enums/ta-modal-table-string.enum';

//pipes
import { TrackByPropertyPipe } from '@shared/pipes/track-by-property.pipe';

// Models
import { LoadStopItemDropdownLists } from '@pages/load/pages/load-modal/models/load-stop-item-dropdowns-list.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { EnumValue, TrailerTypeResponse } from 'appcoretruckassist';

// Components
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';

@Component({
    selector: 'app-ta-modal-table-load-items',
    templateUrl: './ta-modal-table-load-items.component.html',
    styleUrls: ['./ta-modal-table-load-items.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        TaInputComponent,
        TaInputDropdownComponent,

        //pipes
        TrackByPropertyPipe,
    ],
})
export class TaModalTableLoadItemsComponent implements OnInit, OnChanges {
    @Input() modalTableForm: UntypedFormGroup;
    @Input() arrayName: TaModalTableStringEnum;
    @Input() isInputHoverRows: boolean[][];
    @Input() stopItemDropdownLists: LoadStopItemDropdownLists;
    @Input() selectedQuantity: EnumValue[] = [];
    @Input() selectedStack: EnumValue[] = [];
    @Input() selectedSecure: EnumValue[] = [];
    @Input() selectedTarps: EnumValue[] = [];
    @Input() selectedHazardous: EnumValue[] = [];
    @Input() isHazardous: boolean;
    @Input() selectedTrailer: TrailerTypeResponse;

    @Output() deleteFormArrayRowClick: EventEmitter<number> =
        new EventEmitter();

    // input configurations
    public descriptionInputConfig: ITaInput =
        LoadStopItems.DESCRIPTION_INPUT_CONFIG;
    public quantityInputConfig: ITaInput = LoadStopItems.QUANTITY_INPUT_CONFIG;
    public bolInputConfig: ITaInput = LoadStopItems.BOL_INPUT_CONFIG;
    public weightInputConfig: ITaInput = LoadStopItems.WEIGHT_INPUT_CONFIG;
    public lengthInputConfig: ITaInput = LoadStopItems.LENGTH_INPUT_CONFIG;
    public heightInputConfig: ITaInput = LoadStopItems.HEIGHT_INPUT_CONFIG;
    public tarpInputConfig: ITaInput;
    public codeInputConfig: ITaInput = LoadStopItems.CODE_INPUT_CONFIG;
    public sealNumberInputConfig: ITaInput =
        LoadStopItems.SEAL_NUMBER_INPUT_CONFIG;
    public pickupInputConfig: ITaInput = LoadStopItems.PICKUP_INPUT_CONFIG;
    public secureInputConfig: ITaInput;
    public stackableInputConfig: ITaInput =
        LoadStopItems.STACKABLE_INPUT_CONFIG;
    public temperatureInputConfig: ITaInput =
        LoadStopItems.TEMPERATURE_INPUT_CONFIG;

    constructor() {}

    ngOnInit(): void {
        this.createDynamicFields();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.selectedTrailer?.previousValue !==
            changes.selectedTrailer?.currentValue
        ) {
            this.createDynamicFields();
        }

        if(changes.isHazardous?.previousValue !== changes.isHazardous?.currentValue) {
            this.formArray.controls.forEach((control) => {
                if(this.isHazardous) {
                    control.get(TaModalTableStringEnum.DESCRIPTION).patchValue(null)
                } else if(!this.isHazardous) {
                    control.get(TaModalTableStringEnum.HAZARDOUS).patchValue(null)

                }
            })
        }
    }

    public get formArray(): UntypedFormArray {
        return this.modalTableForm?.get(this.arrayName) as UntypedFormArray;
    }

    private createDynamicFields() {
        this.tarpInputConfig = LoadStopItems.getTarpInputConfig(
            this.isTarpDisabled
        );
        this.secureInputConfig = LoadStopItems.getSecureInputConfig(
            this.isStrapChainDisabled
        );
        
        // Reset values if field is disabled
        if (this.isTarpDisabled || this.isStrapChainDisabled) {
            this.formArray.controls.forEach((control) => {
                if (this.isTarpDisabled) control.get(TaModalTableStringEnum.TARP).patchValue(null);
                if (this.isStrapChainDisabled)
                    control.get(TaModalTableStringEnum.SECURE).patchValue(null);
            });
        }
    }

    public emitDeleteFormArrayRowClick(index: number): void {
        this.deleteFormArrayRowClick.emit(index);
    }

    public get isTarpDisabled(): boolean {
        if (!this.selectedTrailer) return false;
        // Tarp can only be edited if Flat Bed, Low Boy / RGN, Step Deck are selected
        return !(
            this.selectedTrailer.id === 9 ||
            this.selectedTrailer.id === 10 ||
            this.selectedTrailer.id === 12
        );
    }

    public get isStrapChainDisabled(): boolean {
        if (!this.selectedTrailer) return false;
        // Strap/Chain can only be edited if Conestoga, Flat Bed, Low Boy / RGN, Step Deck are selected.
        return !(
            this.selectedTrailer.id === 4 ||
            this.selectedTrailer.id === 9 ||
            this.selectedTrailer.id === 10 ||
            this.selectedTrailer.id === 12
        );
    }
}
