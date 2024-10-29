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
    Validators,
} from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Const
import { LoadStopItemsConfig } from '@pages/load/pages/load-modal/utils/constants';

// Enums
import { TaModalTableStringEnum } from '@shared/components/ta-modal-table/enums/';

// Models
import { LoadStopItemDropdownLists } from '@pages/load/pages/load-modal/models';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { EnumValue, TrailerTypeResponse } from 'appcoretruckassist';

// Components
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';

// Svg routes
import { LoadModalSvgRoutes } from '@pages/load/pages/load-modal/utils/svg-routes/load-modal-svg-routes';

// svg routes
import { ModalTableSvgRoutes } from '@shared/components/ta-modal-table/utils/svg-routes';

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

        // Components
        TaInputComponent,
        TaInputDropdownComponent,
    ],
})
export class TaModalTableLoadItemsComponent implements OnInit, OnChanges {
    public loadModalSvgRoutes = LoadModalSvgRoutes;
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

    @Output() onFieldReset: EventEmitter<number> = new EventEmitter();
    @Output() unitsChanged: EventEmitter<{ unit: EnumValue; index: number }> =
        new EventEmitter();

    public svgRoutes = ModalTableSvgRoutes;

    // input configurations
    public descriptionInputConfig: ITaInput =
        LoadStopItemsConfig.DESCRIPTION_INPUT_CONFIG;
    public quantityInputConfig: ITaInput =
        LoadStopItemsConfig.QUANTITY_INPUT_CONFIG;
    public bolInputConfig: ITaInput = LoadStopItemsConfig.BOL_INPUT_CONFIG;
    public weightInputConfig: ITaInput =
        LoadStopItemsConfig.WEIGHT_INPUT_CONFIG;
    public lengthInputConfig: ITaInput =
        LoadStopItemsConfig.LENGTH_INPUT_CONFIG;
    public heightInputConfig: ITaInput =
        LoadStopItemsConfig.HEIGHT_INPUT_CONFIG;
    public tarpInputConfig: ITaInput;
    public codeInputConfig: ITaInput = LoadStopItemsConfig.CODE_INPUT_CONFIG;
    public sealNumberInputConfig: ITaInput =
        LoadStopItemsConfig.SEAL_NUMBER_INPUT_CONFIG;
    public pickupInputConfig: ITaInput =
        LoadStopItemsConfig.PICKUP_INPUT_CONFIG;
    public secureInputConfig: ITaInput;
    public stackableInputConfig: ITaInput =
        LoadStopItemsConfig.STACKABLE_INPUT_CONFIG;
    public temperatureInputConfig: ITaInput =
        LoadStopItemsConfig.TEMPERATURE_INPUT_CONFIG;

    constructor() {}

    ngOnInit(): void {
        this.createDynamicFields();

        setTimeout(() => this.fieldValidators(false), 1);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.selectedTrailer?.previousValue !==
            changes.selectedTrailer?.currentValue
        ) {
            this.createDynamicFields();
        }
        if (
            changes.isHazardous?.previousValue !==
            changes.isHazardous?.currentValue
        ) {
            this.fieldValidators(true);
        }
    }

    private fieldValidators(resetField: boolean): void {
        this.formArray.controls.forEach((control, index) => {
            const descriptionControl = control.get(
                TaModalTableStringEnum.DESCRIPTION
            );
            const hazardousControl = control.get(
                TaModalTableStringEnum.HAZARDOUS
            );

            if (this.isHazardous) {
                descriptionControl.removeValidators(Validators.required);
                hazardousControl.addValidators(Validators.required);
            } else {
                descriptionControl.addValidators(Validators.required);
                hazardousControl.removeValidators(Validators.required);
            }

            hazardousControl.patchValue(null);
            descriptionControl.patchValue(null);
            if (resetField) {
                this.onFieldReset.emit(index);
            }
        });
    }

    public get formArray(): UntypedFormArray {
        return this.modalTableForm?.get(this.arrayName) as UntypedFormArray;
    }

    private createDynamicFields() {
        this.tarpInputConfig = LoadStopItemsConfig.getTarpInputConfig(
            this.isTarpDisabled
        );
        this.secureInputConfig = LoadStopItemsConfig.getSecureInputConfig(
            this.isStrapChainDisabled
        );

        // Reset values if field is disabled
        if (this.isTarpDisabled || this.isStrapChainDisabled) {
            this.formArray.controls.forEach((control) => {
                if (this.isTarpDisabled)
                    control.get(TaModalTableStringEnum.TARP).patchValue(null);
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

    public emitOnSelectDropdown(unit: EnumValue, index: number): void {
        this.selectedQuantity[index] = unit;
        this.unitsChanged.emit({ unit, index });
    }

    public unitInputConfig(i: number): ITaInput {
        return LoadStopItemsConfig.getUnitsInputConfig(
            this.selectedQuantity[i].name
        );
    }
}
