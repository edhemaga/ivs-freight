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
    AbstractControl,
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
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ContactsService } from '@shared/services/contacts.service';
import { RepairService } from '@shared/services/repair.service';
import { PmService } from '@pages/pm-truck-trailer/services/pm.service';

// constants
import { ModalTableConstants } from '@shared/components/ta-modal-table/utils/constants/modal-table.constants';

// enums
import { TaModalTableStringEnum } from '@shared/components/ta-modal-table/enums/ta-modal-table-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// validations
import {
    descriptionValidation,
    phoneExtension,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// pipes
import { HeaderRequiredStarPipe } from '@shared/components/ta-modal-table/pipes/header-required-star.pipe';

// models
import {
    ContactEmailResponse,
    ContactPhoneResponse,
    CreateContactEmailCommand,
    CreateContactPhoneCommand,
    DepartmentResponse,
    EnumValue,
    RepairItemCommand,
} from 'appcoretruckassist';
import { RepairDescriptionResponse } from '@pages/repair/pages/repair-modals/repair-order-modal/models/repair-description-response.model';
import { RepairSubtotal } from '@pages/repair/pages/repair-modals/repair-order-modal/models/repair-subtotal.model';
import { PMTableData } from '@pages/pm-truck-trailer/pages/pm-table/models/pm-table-data.model';
import { ModalTableDropdownOption } from '@shared/models/pm-dropdown-options.model';
import { TruckTrailerPmDropdownLists } from '@shared/models/truck-trailer-pm-dropdown-lists.model';

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

        // pipes
        HeaderRequiredStarPipe,
    ],
    templateUrl: './ta-modal-table.component.html',
    styleUrls: ['./ta-modal-table.component.scss'],
})
export class TaModalTableComponent implements OnInit, OnChanges, OnDestroy {
    @Input() isPhoneTable?: boolean = false;
    @Input() isEmailTable?: boolean = false;
    @Input() isRepairBillTable?: boolean = false;
    @Input() isRepairOrderTable?: boolean = false;
    @Input() isContactTable?: boolean = false;
    @Input() isPMTruckTable?: boolean = false;
    @Input() isPMTrailerTable?: boolean = false;

    @Input() isNewRowCreated: boolean = false;
    @Input() isEdit: boolean = false;

    @Input() modalTableData:
        | ContactPhoneResponse[]
        | ContactEmailResponse[]
        | RepairDescriptionResponse[]
        | PMTableData[] = [];
    @Input() dropdownData: TruckTrailerPmDropdownLists;

    @Output() modalTableValueEmitter = new EventEmitter<
        | CreateContactPhoneCommand[]
        | CreateContactEmailCommand[]
        | RepairItemCommand[]
    >();
    @Output() modalTableValidStatusEmitter = new EventEmitter<boolean>();
    @Output() totalCostValueEmitter = new EventEmitter<RepairSubtotal[]>();

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

    // contacts table
    public repairDepartmentOptions: DepartmentResponse[];

    // repair bill table
    public selectedTruckTrailerRepairPm = [];
    public truckTrailerRepairPmOptions = [];
    public subTotals: RepairSubtotal[] = [];

    // pm table
    public pmTruckOptions: ModalTableDropdownOption[] = [];
    public pmTrailerOptions: ModalTableDropdownOption[] = [];
    public activePmDropdownItem: ModalTableDropdownOption[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private inputService: TaInputService,
        private contactService: ContactsService,
        private repairService: RepairService,
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

        if (
            !changes.dropdownData?.firstChange &&
            changes.dropdownData?.currentValue
        ) {
            this.getDropdownLists(changes.dropdownData.currentValue);
        }
    }

    public trackByIdentity = (_: number, item: string): string => item;

    private createForm(): void {
        this.modalTableForm = this.formBuilder.group({
            phoneTableItems: this.formBuilder.array([]),
            emailTableItems: this.formBuilder.array([]),
            repairBillTableItems: this.formBuilder.array([]),
            contactTableItems: this.formBuilder.array([]),
            pmTableItems: this.formBuilder.array([]),
        });
    }

    public onSelectDropdown(
        event: ModalTableDropdownOption,
        action: string,
        index?: number
    ): void {
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
                                event.mileage ??
                                TableStringEnum.PM_DEFAULT_MILEAGE,
                            defaultMileage:
                                event.mileage ??
                                TableStringEnum.PM_DEFAULT_MILEAGE,
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
                                event.mileage ??
                                TableStringEnum.PM_DEFAULT_MONTHS,
                            defaultMileage:
                                event.mileage ??
                                TableStringEnum.PM_DEFAULT_MONTHS,
                            value: event.title,
                        });
                }

                break;
            case TaModalTableStringEnum.PM_TRUCK_TRAILER_REPAIR_TYPE:
                if (event) this.selectedTruckTrailerRepairPm[index] = event;

                break;
            default:
                break;
        }
    }

    private getDropdownLists(
        dropdownData?: TruckTrailerPmDropdownLists[]
    ): void {
        if (this.isPhoneTable || this.isEmailTable) {
            this.contactService
                .getCompanyContactModal()
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.contactPhoneTypeOptions = res.contactPhoneType;
                    this.contactEmailTypeOptions = res.contactEmailType;
                });
        } else if (this.isRepairBillTable) {
            this.truckTrailerRepairPmOptions = dropdownData;
        } else if (this.isContactTable) {
            this.repairService
                .getRepairShopModalDropdowns()
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.repairDepartmentOptions = res.departments;
                });
        } else if (this.isPMTruckTable) {
            this.pmService
                .getPMTruckDropdown()
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        const pmDropdownList: ModalTableDropdownOption[] = [
                            {
                                id: 7655,
                                name: TableStringEnum.ADD_NEW_3,
                                logoName: null,
                                folder: TableStringEnum.COMMON,
                                subFolder: TableStringEnum.REPAIR_PM,
                                mileage: TableStringEnum.PM_DEFAULT_MILEAGE,
                            },
                        ];

                        res.map((pmTruck, index) => {
                            pmDropdownList.push({
                                id: index + 1,
                                name: pmTruck.title,
                                logoName: pmTruck.logoName,
                                folder: TableStringEnum.COMMON,
                                subFolder: TableStringEnum.REPAIR_PM,
                                mileage:
                                    MethodsCalculationsHelper.convertNumberInThousandSep(
                                        pmTruck.mileage
                                    ),
                            });
                        });

                        this.pmTruckOptions = pmDropdownList;
                    },
                });
        } else if (this.isPMTrailerTable) {
            this.pmService
                .getPMTrailerDropdown()
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        const pmDropdownList: ModalTableDropdownOption[] = [
                            {
                                id: 7655,
                                name: TableStringEnum.ADD_NEW_3,
                                logoName: null,
                                folder: TableStringEnum.COMMON,
                                subFolder: TableStringEnum.REPAIR_PM,
                                mileage: '6',
                            },
                        ];

                        res.map((pmTrailer, index) => {
                            pmDropdownList.push({
                                id: index + 1,
                                name: pmTrailer.title,
                                logoName: pmTrailer.logoName,
                                folder: TableStringEnum.COMMON,
                                subFolder: TableStringEnum.REPAIR_PM,
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
        else if (this.isEmailTable)
            this.modalTableHeaders =
                ModalTableConstants.EMAIL_TABLE_HEADER_ITEMS;
        else if (this.isRepairBillTable)
            this.modalTableHeaders =
                ModalTableConstants.REPAIR_BILL_TABLE_HEADER_ITEMS;
        else if (this.isContactTable)
            this.modalTableHeaders =
                ModalTableConstants.CONTACT_TABLE_HEADER_ITEMS;
        else if (this.isPMTruckTable)
            this.modalTableHeaders =
                ModalTableConstants.PM_TRUCK_TABLE_HEADER_ITEMS;
        else if (this.isPMTrailerTable)
            this.modalTableHeaders =
                ModalTableConstants.PM_TRAILER_TABLE_HEADER_ITEMS;
    }

    private getModalTableDataValue(): void {
        let modalTableValue = this.getFormArray().value;

        if (this.isRepairBillTable) {
            modalTableValue = modalTableValue.map(
                (itemRow: AbstractControl, index: number) => {
                    return {
                        ...itemRow,
                        subtotal: this.subTotals[index]?.subtotal,
                        pmTruckId:
                            this.selectedTruckTrailerRepairPm[index]?.truckId &&
                            this.selectedTruckTrailerRepairPm[index]?.id,
                        pmTrailerId:
                            this.selectedTruckTrailerRepairPm[index]
                                ?.trailerId &&
                            this.selectedTruckTrailerRepairPm[index]?.id,
                    };
                }
            );
        }

        this.modalTableValueEmitter.emit(modalTableValue);
    }

    public getFormArray(): UntypedFormArray {
        if (this.isPhoneTable)
            return this.modalTableForm.get(
                TaModalTableStringEnum.PHONE_TABLE_ITEMS
            ) as UntypedFormArray;
        else if (this.isEmailTable) {
            return this.modalTableForm.get(
                TaModalTableStringEnum.EMAIL_TABLE_ITEMS
            ) as UntypedFormArray;
        } else if (this.isRepairBillTable) {
            return this.modalTableForm.get(
                TaModalTableStringEnum.REPAIR_BILL_TABLE_ITEMS
            ) as UntypedFormArray;
        } else if (this.isContactTable) {
            return this.modalTableForm.get(
                TaModalTableStringEnum.CONTACT_TABLE_ITEMS
            ) as UntypedFormArray;
        } else if (this.isPMTruckTable || this.isPMTrailerTable) {
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
        } else if (this.isEmailTable) {
            newFormArrayRow = this.formBuilder.group({
                email: [null, [Validators.required]],
                contactEmailType: [null],
            });

            this.inputService.customInputValidator(
                newFormArrayRow.get(TaModalTableStringEnum.EMAIL),
                TaModalTableStringEnum.EMAIL,
                this.destroy$
            );
        } else if (this.isRepairBillTable) {
            newFormArrayRow = this.formBuilder.group({
                description: [null, [Validators.required]],
                pm: [null],
                qty: [null, [Validators.required]],
                price: [null, [Validators.required]],
            });
        } else if (this.isContactTable) {
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
        } else if (this.isPMTruckTable || this.isPMTrailerTable) {
            newFormArrayRow = this.formBuilder.group({
                id: [null],
                isChecked: [true, [Validators.required]],
                svg: [TableStringEnum.PM_DEFAULT_SVG, [Validators.required]],
                title: [null, [Validators.required, ...descriptionValidation]],
                mileage: [null, [Validators.required]],
                defaultMileage: [null, [Validators.required]],
                status: [null],
                value: [null],
            });
        }

        this.isInputHoverRows = [...this.isInputHoverRows, newIsInputHoverRow];

        this.getFormArray().push(newFormArrayRow);
    }

    public calculateSubtotal(): void {
        this.modalTableForm
            .get(TaModalTableStringEnum.REPAIR_BILL_TABLE_ITEMS)
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                throttleTime(2)
            )
            .subscribe((items: RepairDescriptionResponse[]) => {
                if (items.length) this.subTotals = [];

                items.forEach((item, index) => {
                    const calculateSubtotal =
                        parseInt(String(item.qty)) * parseInt(item.price);

                    const existingItemIndex = this.subTotals.findIndex(
                        (item) => item.index === index
                    );

                    if (calculateSubtotal) {
                        if (existingItemIndex !== -1) {
                            this.subTotals[existingItemIndex].subtotal =
                                calculateSubtotal;
                        } else {
                            this.subTotals.push({
                                subtotal: calculateSubtotal,
                                index: index,
                            });
                        }
                    } else {
                        if (existingItemIndex !== -1) {
                            this.subTotals[existingItemIndex].subtotal = 0;
                        } else {
                            this.subTotals.push({
                                subtotal: 0,
                                index: index,
                            });
                        }
                    }

                    this.totalCostValueEmitter.emit(this.subTotals);
                });
            });
    }

    public deleteFormArrayRow(index: number): void {
        this.getFormArray().removeAt(index);

        if (this.isPhoneTable) {
            this.isContactPhoneExtExist.splice(index, 1);
            this.selectedContactPhoneType.splice(index, 1);
        } else if (this.isEmailTable)
            this.selectedContactEmailType.splice(index, 1);

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
            } else if (this.isEmailTable) {
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
            } else if (this.isRepairBillTable) {
                const data = modalTableData[i] as RepairDescriptionResponse;

                this.getFormArray().at(i).patchValue({
                    description: data.description,
                    pm: data.pm,
                    qty: data.qty,
                    price: data.price,
                    subtotal: data.subtotal,
                });
            } else if (this.isPMTruckTable || this.isPMTrailerTable) {
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

            if (i === modalTableData.length - 1) {
                if (
                    this.getFormArray().status === TaModalTableStringEnum.VALID
                ) {
                    this.modalTableValidStatusEmitter.emit(true);
                } else {
                    this.modalTableValidStatusEmitter.emit(false);
                }
            }
        }
    }

    private checkForInputChanges(): void {
        this.getFormArray()
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
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
