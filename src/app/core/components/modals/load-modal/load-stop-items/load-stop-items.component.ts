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
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../../shared/ta-input-dropdown/ta-input-dropdown.component';

// validations
import { descriptionValidation } from '../../../shared/ta-input/ta-input.regex-validations';

// constants
import { LoadModalConstants } from '../state/utils/constants/load-modal.constants';

// enums
import { ConstantStringEnum } from '../state/enums/constant-string.enum';

// models
import { DropdownListItem } from '../state/models/dropdown-list-item.model';
import { StopItemsData } from '../state/models/load-stop-items-data.model';

@Component({
    selector: 'app-load-stop-items',
    templateUrl: './load-stop-items.component.html',
    styleUrls: ['./load-stop-items.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        ReactiveFormsModule,

        // components
        TaInputComponent,
        TaInputDropdownComponent,
    ],
})
export class LoadStopItemsComponent implements OnInit, OnChanges {
    @Input() createNewStopItemsRow: boolean = false;
    @Input() stopItemsData: StopItemsData[] = [];

    @Output() stopItemsDataValueEmitter = new EventEmitter<StopItemsData[]>();

    public stopItemHeaders: string[] = [];

    public stopItemsForm: UntypedFormGroup;

    public isInputHoverRows: boolean[][] = [];

    // dropdowns
    public quantityDropdownList: DropdownListItem[] = [];
    public stackDropdownList: DropdownListItem[] = [];
    public secureDropdownList: DropdownListItem[] = [];

    public selectedQuantity: DropdownListItem[] = [];
    public selectedStack: DropdownListItem[] = [];
    public selectedSecure: DropdownListItem[] = [];

    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.stopItemsData?.currentValue)
            this.updateStopItems(changes.stopItemsData.currentValue);

        if (
            !changes.createNewStopItemsRow.firstChange &&
            changes.createNewStopItemsRow.currentValue
        ) {
            this.createStopItemsRow();

            this.getStopItemsDataValue();
        }
    }

    public trackByIdentity = (_: number, item: string): string => item;

    private createForm(): void {
        this.stopItemsForm = this.formBuilder.group({
            stopItems: this.formBuilder.array([]),
        });
    }

    public handleInputSelect(
        dropdownListItem: DropdownListItem,
        action: string,
        stopItemsRowId: number
    ): void {
        if (dropdownListItem) {
            switch (action) {
                case ConstantStringEnum.QUANTITY:
                    this.selectedQuantity[stopItemsRowId] = dropdownListItem;

                    break;
                case ConstantStringEnum.STACK:
                    this.selectedStack[stopItemsRowId] = dropdownListItem;

                    break;
                case ConstantStringEnum.SECURE:
                    this.selectedSecure[stopItemsRowId] = dropdownListItem;

                    break;
                default:
                    break;
            }
        }
    }

    public handleInputHover(
        isHovering: boolean,
        isInputHoverRowIndex: number,
        inputIndex: number
    ): void {
        if (isHovering) {
            this.isInputHoverRows[isInputHoverRowIndex][inputIndex] = true;
        } else {
            this.isInputHoverRows[isInputHoverRowIndex][inputIndex] = false;
        }
    }

    public getStopItems(): UntypedFormArray {
        return this.stopItemsForm.get(
            ConstantStringEnum.STOP_ITEMS
        ) as UntypedFormArray;
    }

    private getConstantData(): void {
        this.stopItemHeaders = LoadModalConstants.STOP_ITEM_HEADERS;

        this.quantityDropdownList = LoadModalConstants.QUANTITY_DROPDOWN_LIST;
        this.stackDropdownList = LoadModalConstants.STACK_DROPDOWN_LIST;
        this.secureDropdownList = LoadModalConstants.SECURE_DROPDOWN_LIST;
    }

    private getStopItemsDataValue(): void {
        const stopItemsDataValue = this.getStopItems().value;

        this.stopItemsDataValueEmitter.emit(stopItemsDataValue);
    }

    private createIsHoverRow(): boolean[] {
        return JSON.parse(
            JSON.stringify(LoadModalConstants.IS_INPUT_HOVER_ROW)
        );
    }

    private createStopItemsRow(): void {
        const newIsInputHoverRow = this.createIsHoverRow();

        const newStopItemsRow = this.formBuilder.group({
            description: [
                null,
                [...descriptionValidation, Validators.required],
            ],
            quantity: [null],
            tmp: [null],
            weight: [null],
            length: [null],
            height: [null],
            tarp: [null],
            stack: [null],
            secure: [null],
            bolNo: [null],
            pickupNo: [null],
            sealNo: [null],
            code: [null],
        });

        this.isInputHoverRows = [...this.isInputHoverRows, newIsInputHoverRow];

        this.getStopItems().push(newStopItemsRow);
    }

    public deleteStopItemsRow(stopItemsRowId: number): void {
        this.getStopItems().removeAt(stopItemsRowId);

        this.getStopItemsDataValue();
    }

    public updateStopItems(stopItemsData: StopItemsData[]): void {
        for (let i = 0; i < stopItemsData.length; i++) {
            this.createStopItemsRow();

            this.getStopItems()
                .at(i)
                .patchValue({
                    ...stopItemsData[i],
                });
        }
    }
}
