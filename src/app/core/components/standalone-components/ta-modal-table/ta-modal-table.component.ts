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

import {
    Subject,
    debounceTime,
    distinctUntilChanged,
    takeUntil,
    throttleTime,
} from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../shared/ta-input-dropdown/ta-input-dropdown.component';

// services
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ContactTService } from 'src/app/pages/contacts/state/services/contact.service';
import { RepairTService } from 'src/app/pages/repair/state/repair.service';

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
import {
    ContactEmailResponse,
    ContactPhoneResponse,
    CreateContactPhoneCommand,
    DepartmentResponse,
    EnumValue,
} from 'appcoretruckassist';
import {
    RepairDescriptionResponse,
    Subtotal,
} from '../../modals/repair-modals/repair-order-modal/state/models/repair.model';

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
    @Input() isDescriptionTable: boolean = false;
    @Input() isContactTable: boolean = false;

    @Input() isNewRowCreated: boolean = false;

    @Input() modalTableData:
        | ContactPhoneResponse[]
        | RepairDescriptionResponse[]
        | ContactEmailResponse[] = [];

    @Output() modalTableValueEmitter = new EventEmitter<
        CreateContactPhoneCommand[]
    >();
    @Output() modalTableValidStatusEmitter = new EventEmitter<boolean>();

    @Output() total = new EventEmitter<Subtotal[]>();

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

    //  description table
    public subtotals: Subtotal[] = [];

    // repair table
    public repairDepartmentOptions: DepartmentResponse[];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private contactService: ContactTService,
        private inputService: TaInputService,
        private shopService: RepairTService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getDropdownLists();

        this.checkForInputChanges();

        this.calculateSubtotal();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.modalTableData?.currentValue)
            this.updateModalTableData(changes.modalTableData.currentValue);

        if (
            !changes.isNewRowCreated?.firstChange &&
            changes.isNewRowCreated?.currentValue
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
            descriptionTableItems: this.formBuilder.array([]),
            contactTableItems: this.formBuilder.array([]),
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
        if (this.isPhoneTable || this.isEmailTable) {
            this.contactService
                .getCompanyContactModal()
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.contactPhoneTypeOptions = res.contactPhoneType;
                    this.contactEmailTypeOptions = res.contactEmailType;
                });
        } else if (this.isContactTable) {
            this.shopService
                .getRepairShopModalDropdowns()
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.repairDepartmentOptions = res.departments;
                });
        }
    }

    private getConstantData(): void {
        if (this.isPhoneTable)
            this.modalTableHeaders =
                ModalTableConstants.PHONE_TABLE_HEADER_ITEMS;

        if (this.isEmailTable)
            this.modalTableHeaders =
                ModalTableConstants.EMAIL_TABLE_HEADER_ITEMS;

        if (this.isDescriptionTable)
            this.modalTableHeaders =
                ModalTableConstants.DESCRIPTION_TABLE_HEADER_ITEMS;

        if (this.isContactTable)
            this.modalTableHeaders =
                ModalTableConstants.CONTACT_TABLE_HEADER_ITEMS;
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

        if (this.isEmailTable) {
            return this.modalTableForm.get(
                ConstantStringEnum.EMAIL_TABLE_ITEMS
            ) as UntypedFormArray;
        }

        if (this.isDescriptionTable) {
            return this.modalTableForm.get(
                ConstantStringEnum.DESCRIPTION_TABLE_ITEMS
            ) as UntypedFormArray;
        }

        if (this.isContactTable) {
            return this.modalTableForm.get(
                ConstantStringEnum.CONTACT_TABLE_ITEMS
            ) as UntypedFormArray;
        }
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

        if (this.isDescriptionTable) {
            newFormArrayRow = this.formBuilder.group({
                description: [null, [Validators.required]],
                pm: [null],
                qty: [null, [Validators.required]],
                price: [null, [Validators.required]],
            });
        }

        if (this.isContactTable) {
            newFormArrayRow = this.formBuilder.group({
                fullName: [null, [Validators.required]],
                departmant: [null, [Validators.required]],
                phone: [null, [Validators.required, phoneFaxRegex]],
                ext: [null, phoneExtension],
                email: [null, [Validators.required]],
            });

            this.isContactPhoneExtExist = [
                ...this.isContactPhoneExtExist,
                false,
            ];

            this.inputService.customInputValidator(
                newFormArrayRow.get(ConstantStringEnum.EMAIL),
                ConstantStringEnum.EMAIL,
                this.destroy$
            );
        }

        this.isInputHoverRows = [...this.isInputHoverRows, newIsInputHoverRow];

        this.getFormArray().push(newFormArrayRow);
    }

    public calculateSubtotal(): void {
        this.modalTableForm
            .get('descriptionTableItems')
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                throttleTime(2)
            )
            .subscribe((items) => {
                if (items.length === 0) this.subtotals = [];

                items.forEach((item, index) => {
                    const calculateSubtotal =
                        parseInt(item.qty) * parseInt(item.price);

                    const existingItemIndex = this.subtotals.findIndex(
                        (item) => item.index === index
                    );

                    if (calculateSubtotal) {
                        if (existingItemIndex !== -1) {
                            this.subtotals[existingItemIndex].subtotal =
                                calculateSubtotal;
                        } else {
                            this.subtotals.push({
                                subtotal: calculateSubtotal,
                                index: index,
                            });
                        }
                    } else {
                        if (existingItemIndex !== -1) {
                            this.subtotals[existingItemIndex].subtotal = 0;
                        } else {
                            this.subtotals.push({
                                subtotal: 0,
                                index: index,
                            });
                        }
                    }

                    this.total.emit(this.subtotals);
                });
            });
    }

    public deleteFormArrayRow(index: number): void {
        this.getFormArray().removeAt(index);

        if (this.isPhoneTable) {
            this.isContactPhoneExtExist.splice(index, 1);
            this.selectedContactPhoneType.splice(index, 1);
        }

        if (this.isEmailTable) this.selectedContactEmailType.splice(index, 1);

        if (this.isDescriptionTable) this.getModalTableDataValue();
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

    private updateModalTableData(
        modalTableData: (ContactPhoneResponse | ContactEmailResponse)[]
    ): void {
        for (let i = 0; i < modalTableData.length; i++) {
            this.createFormArrayRow();

            if (this.isPhoneTable) {
                const data = modalTableData[i] as ContactPhoneResponse;

                this.getFormArray().at(i).patchValue({
                    phone: data.phone,
                    phoneExt: data.phoneExt,
                    contactPhoneType: data.contactPhoneType.name,
                });

                if (data.phoneExt) this.isContactPhoneExtExist[i] = true;

                if (data.contactPhoneType.name)
                    this.selectedContactPhoneType[i] = data.contactPhoneType;
            }

            if (this.isEmailTable) {
                const data = modalTableData[i] as ContactEmailResponse;

                this.getFormArray().at(i).patchValue({
                    email: data.email,
                    contactEmailType: data.contactEmailType.name,
                });

                this.inputService.customInputValidator(
                    this.getFormArray().at(i).get(ConstantStringEnum.EMAIL),
                    ConstantStringEnum.EMAIL,
                    this.destroy$
                );

                if (data.contactEmailType.name)
                    this.selectedContactEmailType[i] = data.contactEmailType;
            }

            if (this.isDescriptionTable) {
                const data = modalTableData[i] as RepairDescriptionResponse;

                this.getFormArray().at(i).patchValue({
                    description: data.description,
                    pm: data.pm,
                    qty: data.qty,
                    price: data.price,
                    subtotal: data.subtotal,
                });
            }
        }
    }

    private checkForInputChanges(): void {
        this.getFormArray()
            ?.valueChanges.pipe(
                distinctUntilChanged(),
                throttleTime(2),
                takeUntil(this.destroy$)
            )
            .subscribe((res) => {
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
