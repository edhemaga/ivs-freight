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
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, distinctUntilChanged, takeUntil, throttleTime } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../shared/ta-input-dropdown/ta-input-dropdown.component';

// services
import { ContactTService } from '../../contacts/state/contact.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';

// constants
import { ModalTableConstants } from 'src/app/core/utils/constants/ta-modal-table.constants';

// enums
import { ConstantStringEnum } from 'src/app/core/utils/enums/ta-modal-table.enum';

// validations
import {
    phoneExtension,
    phoneFaxRegex,
} from '../../shared/ta-input/ta-input.regex-validations';

// models
import { CreateContactPhoneCommand, EnumValue } from 'appcoretruckassist';

@Component({
    selector: 'app-ta-modal-table',
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
    templateUrl: './ta-modal-table.component.html',
    styleUrls: ['./ta-modal-table.component.scss'],
})
export class TaModalTableComponent implements OnInit, OnChanges, OnDestroy {
    @Input() isPhoneTable: boolean = false;
    @Input() isEmailTable: boolean = false;
    @Input() isNewRowCreated: boolean = false;

    @Output() modalTableValueEmitter = new EventEmitter<
        CreateContactPhoneCommand[]
    >();
    @Output() modalTableValidStatusEmitter = new EventEmitter<boolean>();

    private destroy$ = new Subject<void>();

    public modalTableForm: UntypedFormGroup;

    public modalTableHeaders: string[];

    public isInputHoverRows: boolean[][] = [];

    // phone table
    public isContactPhoneExtExist: boolean[] = [];
    public selectedContactPhoneType: EnumValue[] = [];
    public contactPhoneTypeOptions: EnumValue[] = [];

    // email table
    public selectedContactEmailType: EnumValue[] = [];
    public contactEmailTypeOptions: EnumValue[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private contactService: ContactTService,
        private inputService: TaInputService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getDropdownLists();

        this.checkForInputChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            !changes.isNewRowCreated.firstChange &&
            changes.isNewRowCreated.currentValue
        ) {
            this.createFormArrayRow();

            this.getModalTableDataValue();
        }
    }

    public trackByIdentity = (_: number, item: string): string => item;

    private createForm(): void {
        this.modalTableForm = this.formBuilder.group({
            phoneTableItems: this.formBuilder.array([]),
            emailTableItems: this.formBuilder.array([]),
        });
    }

    public onSelectDropdown(
        event: EnumValue,
        action: string,
        index?: number
    ): void {
        switch (action) {
            case ConstantStringEnum.CONTACT_PHONE_TYPE:
                this.selectedContactPhoneType[index] = event;

                break;
            case ConstantStringEnum.CONTACT_EMAIL_TYPE:
                this.selectedContactEmailType[index] = event;

                break;
            default:
                break;
        }
    }

    private getDropdownLists(): void {
        if (this.isPhoneTable || this.isEmailTable)
            this.contactService
                .getCompanyContactModal()
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.contactPhoneTypeOptions = res.contactPhoneType;
                    this.contactEmailTypeOptions = res.contactEmailType;
                });
    }

    private getConstantData(): void {
        if (this.isPhoneTable)
            this.modalTableHeaders =
                ModalTableConstants.PHONE_TABLE_HEADER_ITEMS;

        if (this.isEmailTable)
            this.modalTableHeaders =
                ModalTableConstants.EMAIL_TABLE_HEADER_ITEMS;
    }

    private getModalTableDataValue(): void {
        const modalTableValue = this.getFormArray().value;

        this.modalTableValueEmitter.emit(modalTableValue);
    }

    public getFormArray(): UntypedFormArray {
        if (this.isPhoneTable)
            return this.modalTableForm.get(
                ConstantStringEnum.PHONE_TABLE_ITEMS
            ) as UntypedFormArray;

        if (this.isEmailTable)
            return this.modalTableForm.get(
                ConstantStringEnum.EMAIL_TABLE_ITEMS
            ) as UntypedFormArray;
    }

    private createFormArrayRow(): void {
        const newIsInputHoverRow = this.createIsHoverRow();

        let newFormArrayRow: UntypedFormGroup;

        if (this.isPhoneTable) {
            newFormArrayRow = this.formBuilder.group({
                phone: [null, [Validators.required, phoneFaxRegex]],
                phoneExt: [null, phoneExtension],
                contactPhoneType: [null],
            });

            this.isContactPhoneExtExist = [
                ...this.isContactPhoneExtExist,
                false,
            ];
        }

        if (this.isEmailTable) {
            newFormArrayRow = this.formBuilder.group({
                email: [null, [Validators.required]],
                contactEmailType: [null],
            });

            this.inputService.customInputValidator(
                newFormArrayRow.get(ConstantStringEnum.EMAIL),
                ConstantStringEnum.EMAIL,
                this.destroy$
            );
        }

        this.isInputHoverRows = [...this.isInputHoverRows, newIsInputHoverRow];

        this.getFormArray().push(newFormArrayRow);
    }

    public deleteFormArrayRow(index: number): void {
        this.getFormArray().removeAt(index);

        if (this.isPhoneTable) {
            this.isContactPhoneExtExist.splice(index, 1);
            this.selectedContactPhoneType.splice(index, 1);
        }

        if (this.isEmailTable) this.selectedContactEmailType.splice(index, 1);

        this.getModalTableDataValue();
    }

    private createIsHoverRow(): boolean[] {
        return JSON.parse(
            JSON.stringify(
                this.isPhoneTable
                    ? ModalTableConstants.IS_INPUT_HOVER_ROW_PHONE
                    : ModalTableConstants.IS_INPUT_HOVER_ROW_EMAIL
            )
        );
    }

    public handleInputHover(
        isHovering: boolean,
        isInputHoverRowIndex: number,
        inputIndex: number
    ): void {
        this.isInputHoverRows[isInputHoverRowIndex][inputIndex] = isHovering;
    }

    private checkForInputChanges(): void {
        this.getFormArray()
            .valueChanges.pipe(
                distinctUntilChanged(),
                throttleTime(2),
                takeUntil(this.destroy$)
            )
            .subscribe((res: CreateContactPhoneCommand[]) => {
                if (res) {
                    this.getModalTableDataValue();

                    if (
                        this.getFormArray().status === ConstantStringEnum.VALID
                    ) {
                        this.modalTableValidStatusEmitter.emit(true);
                    } else {
                        this.modalTableValidStatusEmitter.emit(false);
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
