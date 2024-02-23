import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
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

import { Subject, distinctUntilChanged, takeUntil, throttleTime } from 'rxjs';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaInputComponent } from '../../../../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../../../shared/ta-input-dropdown/ta-input-dropdown.component';

// validations
import { descriptionValidation } from '../../../../shared/ta-input/ta-input.regex-validations';

// constants
import { LoadStopItemsConstants } from '../../state/utils/constants/load-stop-items.constants';

// enums
import { ConstantStringEnum } from '../../state/enums/load-modal-stop-items.enum';

// model
import { StopItemDropdownLists } from '../../state/models/load-modal-stop-items-model/load-stop-item-dropdowns.model';
import { EnumValue, LoadStopItemCommand } from 'appcoretruckassist';

@Component({
    selector: 'app-load-modal-stop-items',
    templateUrl: './load-modal-stop-items.component.html',
    styleUrls: ['./load-modal-stop-items.component.scss'],
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
export class LoadModalStopItemsComponent
    implements OnInit, OnChanges, OnDestroy
{
    @Input() createNewStopItemsRow: boolean = false;
    @Input() stopItemsData: LoadStopItemCommand[] = [];
    @Input() stopItemDropdownLists: StopItemDropdownLists;

    @Output() stopItemsDataValueEmitter = new EventEmitter<
        LoadStopItemCommand[]
    >();
    @Output() stopItemsValidStatusEmitter = new EventEmitter<boolean>();

    private destroy$ = new Subject<void>();

    public stopItemHeaders: string[] = LoadStopItemsConstants.STOP_ITEM_HEADERS;

    public stopItemsForm: UntypedFormGroup;

    public isInputHoverRows: boolean[][] = [];

    // dropdowns
    public selectedQuantity: EnumValue[] = [];
    public selectedStack: EnumValue[] = [];
    public selectedSecure: EnumValue[] = [];

    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.createForm();

        this.checkForInputChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.stopItemsData?.currentValue)
            this.updateStopItems(changes.stopItemsData.currentValue);

        if (
            changes.createNewStopItemsRow &&
            !changes.createNewStopItemsRow.firstChange &&
            changes.createNewStopItemsRow.currentValue
        ) {
            this.createStopItemsRow();

            this.getStopItemsDataValue();
        }

        console.log(changes);
    }

    public trackByIdentity = (_: number, item: string): string => item;

    private createForm(): void {
        this.stopItemsForm = this.formBuilder.group({
            stopItems: this.formBuilder.array([]),
        });
    }

    public handleInputSelect(
        dropdownListItem: EnumValue,
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

    private getStopItemsDataValue(): void {
        const stopItemsDataValue = this.getStopItems().value;

        this.stopItemsDataValueEmitter.emit(stopItemsDataValue);
    }

    private createIsHoverRow(): boolean[] {
        return JSON.parse(
            JSON.stringify(LoadStopItemsConstants.IS_INPUT_HOVER_ROW)
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

    public updateStopItems(stopItemsData: LoadStopItemCommand[]): void {
        for (let i = 0; i < stopItemsData.length; i++) {
            this.createStopItemsRow();

            this.getStopItems()
                .at(i)
                .patchValue({
                    ...stopItemsData[i],
                });
        }
    }

    private checkForInputChanges(): void {
        this.getStopItems()
            .valueChanges.pipe(
                distinctUntilChanged(),
                throttleTime(2),
                takeUntil(this.destroy$)
            )
            .subscribe((res: LoadStopItemCommand[]) => {
                if (res) {
                    this.getStopItemsDataValue();

                    if (
                        this.getStopItems().status === ConstantStringEnum.VALID
                    ) {
                        this.stopItemsValidStatusEmitter.emit(true);
                    } else {
                        this.stopItemsValidStatusEmitter.emit(false);
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
