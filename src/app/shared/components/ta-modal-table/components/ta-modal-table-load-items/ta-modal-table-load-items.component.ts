import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormGroup,
} from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Const
import { LoadStopItems } from '@pages/load/pages/load-modal/utils/constants/load-stop-items.constants';

// Enums
import { TaModalTableStringEnum } from '../../enums/ta-modal-table-string.enum';

//pipes
import { TrackByPropertyPipe } from '@shared/pipes/track-by-property.pipe';

// Models
import { LoadStopItemDropdownLists } from '@pages/load/pages/load-modal/models/load-stop-item-dropdowns-list.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { EnumValue } from 'appcoretruckassist';

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
export class TaModalTableLoadItemsComponent implements OnInit {
    @Input() modalTableForm: UntypedFormGroup;
    @Input() arrayName: TaModalTableStringEnum;
    @Input() isInputHoverRows: boolean[][];
    @Input() stopItemDropdownLists: LoadStopItemDropdownLists;
    @Input() selectedQuantity: EnumValue[] = [];
    @Input() selectedStack: EnumValue[] = [];
    @Input() selectedSecure: EnumValue[] = [];
    @Input() selectedTarps: EnumValue[] = [];
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
    public tarpInputConfig: ITaInput = LoadStopItems.TARP_INPUT_CONFIG;
    public codeInputConfig: ITaInput = LoadStopItems.CODE_INPUT_CONFIG;
    public sealNumberInputConfig: ITaInput =
        LoadStopItems.SEAL_NUMBER_INPUT_CONFIG;
    public pickupInputConfig: ITaInput = LoadStopItems.PICKUP_INPUT_CONFIG;
    public secureInputConfig: ITaInput = LoadStopItems.SECURE_INPUT_CONFIG;
    public stackableInputConfig: ITaInput =
        LoadStopItems.STACKABLE_INPUT_CONFIG;
    public temperatureInputConfig: ITaInput =
        LoadStopItems.TEMPERATURE_INPUT_CONFIG;

    constructor() {}

    ngOnInit(): void {}

    get formArray() {
        return this.modalTableForm?.get(this.arrayName) as UntypedFormArray;
    }

    public emitDeleteFormArrayRowClick(index: number): void {
        this.deleteFormArrayRowClick.emit(index);
    }
}
