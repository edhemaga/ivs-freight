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
import { TaInputComponent } from '../ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../ta-input-dropdown/ta-input-dropdown.component';
import { TaCheckboxComponent } from 'src/app/shared/components/ta-checkbox/ta-checkbox.component';

// services
import { TaInputService } from '../ta-input/services/ta-input.service';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { RepairService } from '../../services/repair.service';
import { PmService } from 'src/app/pages/pm-truck-trailer/services/pm.service';

// constants
import { ModalTableConstants } from 'src/app/shared/components/ta-modal-table/utils/constants/modal-table.constants';

// enums
import { TaModalTableStringEnum } from 'src/app/shared/components/ta-modal-table/enums/ta-modal-table-string.enum';

// validations
import {
    descriptionValidation,
    phoneExtension,
    phoneFaxRegex,
} from '../ta-input/validators/ta-input.regex-validations';

// models
import {
    ContactEmailResponse,
    ContactPhoneResponse,
    CreateContactPhoneCommand,
    DepartmentResponse,
    EnumValue,
} from 'appcoretruckassist';
import { RepairDescriptionResponse } from 'src/app/pages/repair/pages/repair-modals/repair-order-modal/models/repair-description-response.model';
import { RepairSubtotal } from 'src/app/pages/repair/pages/repair-modals/repair-order-modal/models/repair-subtotal.model';
import { PMTableData } from 'src/app/pages/pm-truck-trailer/pages/models/pm-table-data.model';
import { PmDropdownOptions } from '../../models/pm-dropdown-options.model';

// helpers
import { MethodsCalculationsHelper } from '../../utils/helpers/methods-calculations.helper';

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
        TaCheckboxComponent,
    ],
    templateUrl: './ta-modal-table.component.html',
    styleUrls: ['./ta-modal-table.component.scss'],
})
export class TaModalTableComponent implements OnInit, OnChanges, OnDestroy {
    @Input() isPhoneTable: boolean = false;
    @Input() isEmailTable: boolean = false;
    @Input() isDescriptionTable: boolean = false;
    @Input() isContactTable: boolean = false;
    @Input() isPMTruckTable: boolean = false;
    @Input() isPMTrailerTable: boolean = false;

    @Input() isNewRowCreated: boolean = false;

    @Input() isEdit: boolean = false;

    @Input() modalTableData:
        | ContactPhoneResponse[]
        | ContactEmailResponse[]
        | RepairDescriptionResponse[]
        | PMTableData[] = [];

    @Output() modalTableValueEmitter = new EventEmitter<
        CreateContactPhoneCommand[]
    >();
    @Output() modalTableValidStatusEmitter = new EventEmitter<boolean>();

    @Output() total = new EventEmitter<RepairSubtotal[]>();

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

    // description table
    public subtotals: RepairSubtotal[] = [];

    // repair table
    public repairDepartmentOptions: DepartmentResponse[];

    // pm table
    public pmTruckOptions: PmDropdownOptions[] = [];
    public pmTrailerOptions: PmDropdownOptions[] = [];
    public activePmDropdownItem: EnumValue[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private contactService: ContactsService,
        private inputService: TaInputService,
        private shopService: RepairService,
        private pmService: PmService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getDropdownLists();

        this.checkForInputChanges();

        this.calculateSubtotal();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.modalTableData?.currentValue) {
            this.updateModalTableData(changes.modalTableData.currentValue);
        }

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
            pmTableItems: this.formBuilder.array([]),
        });
    }

    public onSelectDropdown(event: any, action: string, index?: number): void {
        switch (action) {
            case TaModalTableStringEnum.CONTACT_PHONE_TYPE:
                this.selectedContactPhoneType[index] = event;

                break;
            case TaModalTableStringEnum.CONTACT_EMAIL_TYPE:
                this.selectedContactEmailType[index] = event;

                break;
            case TaModalTableStringEnum.PM_TRUCK_TYPE:
                if (event) {
                    this.activePmDropdownItem[index] = event;

                    this.getFormArray()
                        .at(index)
                        .patchValue({
                            svg: event.logoName,
                            title: event.title,
                            mileage:
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    event.mileage ?? 10000
                                ),
                            defaultMileage:
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    event.mileage ?? 10000
                                ),
                            value: event.title,
                        });
                }

                break;
            case TaModalTableStringEnum.PM_TRAILER_TYPE:
                if (event) {
                    this.activePmDropdownItem[index] = event;

                    this.getFormArray()
                        .at(index)
                        .patchValue({
                            svg: event.logoName,
                            title: event.title,
                            mileage:
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    event.mileage ?? 6
                                ),
                            defaultMileage:
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    event.mileage ?? 6
                                ),
                            value: event.title,
                        });
                }

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
        }

        if (this.isContactTable) {
            this.shopService
                .getRepairShopModalDropdowns()
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.repairDepartmentOptions = res.departments;
                });
        }

        if (this.isPMTruckTable) {
            this.pmService
                .getPMTruckDropdown()
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        let pmDropdownList: PmDropdownOptions[] = [
                            {
                                id: 7655,
                                name: 'ADD NEW',
                                logoName: '',
                                folder: 'common',
                                subFolder: 'repair-pm',
                                mileage:
                                    MethodsCalculationsHelper.convertNumberInThousandSep(
                                        10000
                                    ),
                            },
                        ];

                        res.map((pmTruck, index) => {
                            pmDropdownList.push({
                                id: index + 1,
                                name: pmTruck.title,
                                logoName: pmTruck.logoName,
                                folder: 'common',
                                subFolder: 'repair-pm',
                                mileage:
                                    MethodsCalculationsHelper.convertNumberInThousandSep(
                                        pmTruck.mileage
                                    ),
                            });
                        });

                        this.pmTruckOptions = pmDropdownList;
                    },
                });
        }

        if (this.isPMTrailerTable) {
            this.pmService
                .getPMTrailerDropdown()
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        let pmDropdownList: PmDropdownOptions[] = [
                            {
                                id: 7655,
                                name: 'ADD NEW',
                                logoName: '',
                                folder: 'common',
                                subFolder: 'repair-pm',
                                mileage: '6',
                            },
                        ];

                        res.map((pmTrailer, index) => {
                            pmDropdownList.push({
                                id: index + 1,
                                name: pmTrailer.title,
                                logoName: pmTrailer.logoName,
                                folder: 'common',
                                subFolder: 'repair-pm',
                                mileage: pmTrailer.months.toString(),
                            });
                        });

                        this.pmTrailerOptions = pmDropdownList;
                    },
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

        if (this.isPMTruckTable)
            this.modalTableHeaders =
                ModalTableConstants.PM_TRUCK_TABLE_HEADER_ITEMS;

        if (this.isPMTrailerTable)
            this.modalTableHeaders =
                ModalTableConstants.PM_TRAILER_TABLE_HEADER_ITEMS;
    }

    private getModalTableDataValue(): void {
        const modalTableValue = this.getFormArray().value;

        this.modalTableValueEmitter.emit(modalTableValue);
    }

    public getFormArray(): UntypedFormArray {
        if (this.isPhoneTable)
            return this.modalTableForm.get(
                TaModalTableStringEnum.PHONE_TABLE_ITEMS
            ) as UntypedFormArray;

        if (this.isEmailTable) {
            return this.modalTableForm.get(
                TaModalTableStringEnum.EMAIL_TABLE_ITEMS
            ) as UntypedFormArray;
        }

        if (this.isDescriptionTable) {
            return this.modalTableForm.get(
                TaModalTableStringEnum.DESCRIPTION_TABLE_ITEMS
            ) as UntypedFormArray;
        }

        if (this.isContactTable) {
            return this.modalTableForm.get(
                TaModalTableStringEnum.CONTACT_TABLE_ITEMS
            ) as UntypedFormArray;
        }

        if (this.isPMTruckTable || this.isPMTrailerTable) {
            return this.modalTableForm.get(
                TaModalTableStringEnum.PM_TABLE_ITEMS
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
                newFormArrayRow.get(TaModalTableStringEnum.EMAIL),
                TaModalTableStringEnum.EMAIL,
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
                newFormArrayRow.get(TaModalTableStringEnum.EMAIL),
                TaModalTableStringEnum.EMAIL,
                this.destroy$
            );
        }

        if (this.isPMTruckTable || this.isPMTrailerTable) {
            newFormArrayRow = this.formBuilder.group({
                id: [null],
                isChecked: [true, [Validators.required]],
                svg: [
                    'assets/svg/common/repair-pm/ic_custom_pm.svg',
                    [Validators.required],
                ],
                title: [null],
                mileage: [null, [Validators.required]],
                defaultMileage: [null, [Validators.required]],
                status: [null, [Validators.required]],
                value: [null, [...descriptionValidation]],
            });
        }

        this.isInputHoverRows = [...this.isInputHoverRows, newIsInputHoverRow];

        this.getFormArray().push(newFormArrayRow);
    }

    public calculateSubtotal(): void {
        this.modalTableForm
            .get(TaModalTableStringEnum.DESCRIPTION_TABLE_ITEMS)
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                throttleTime(2)
            )
            .subscribe((items: RepairDescriptionResponse[]) => {
                if (items.length) this.subtotals = [];

                items.forEach((item, index) => {
                    const calculateSubtotal =
                        parseInt(String(item.qty)) * parseInt(item.price);

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

        if (
            this.isDescriptionTable ||
            this.isPMTruckTable ||
            this.isPMTrailerTable
        )
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
                    this.getFormArray().at(i).get(TaModalTableStringEnum.EMAIL),
                    TaModalTableStringEnum.EMAIL,
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

            if (this.isPMTruckTable || this.isPMTrailerTable) {
                const data = modalTableData[i] as PMTableData;

                this.getFormArray().at(i).patchValue({
                    id: data.id,
                    isChecked: data.isChecked,
                    svg: data.svg,
                    title: data.title,
                    mileage: data.mileage,
                    defaultMileage: data.defaultMileage,
                    status: data.status,
                    value: data.title,
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
                        this.getFormArray().status ===
                        TaModalTableStringEnum.VALID
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
