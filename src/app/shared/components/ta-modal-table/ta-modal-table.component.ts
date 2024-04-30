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
    FormGroup,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

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
import { ModalTableConstants } from '@shared/components/ta-modal-table/utils/constants/ta-modal-table.constants';

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
import { RepairItemResponse } from 'appcoretruckassist';
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
    @Input() isEdit?: boolean = false;

    @Input() modalTableData?:
        | ContactPhoneResponse[]
        | ContactEmailResponse[]
        | RepairItemResponse[]
        | PMTableData[] = [];
    @Input() dropdownData?: TruckTrailerPmDropdownLists;

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

        this.calculateRepairBillSubtotal();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            !changes.modalTableData?.firstChange &&
            changes.modalTableData?.currentValue
        ) {
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

        if (changes.isRepairOrderTable) {
            this.getConstantData();

            this.resetIsRepairBillTableForm();
        }
    }

    public trackByIdentity = (_: number, item: string): string => item;

    private createForm(): void {
        this.modalTableForm = this.formBuilder.group({
            phoneTableItems: this.formBuilder.array([]),
            emailTableItems: this.formBuilder.array([]),
            repairBillTableItems: this.formBuilder.array([]),
            repairOrderTableItems: this.formBuilder.array([]),
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
            case TaModalTableStringEnum.PM_TRUCK_TRAILER_REPAIR_TYPE:
                if (event) this.selectedTruckTrailerRepairPm[index] = event;

                this.getModalTableDataValue();

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
            default:
                break;
        }
    }

    private getDropdownLists(
        dropdownData?: TruckTrailerPmDropdownLists[]
    ): void {
        switch (true) {
            case this.isPhoneTable || this.isEmailTable:
                this.contactService
                    .getCompanyContactModal()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res) => {
                        this.contactPhoneTypeOptions = res.contactPhoneType;
                        this.contactEmailTypeOptions = res.contactEmailType;
                    });

                break;
            case this.isRepairBillTable || this.isRepairOrderTable:
                this.truckTrailerRepairPmOptions = dropdownData;

                break;
            case this.isContactTable:
                this.repairService
                    .getRepairShopModalDropdowns()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res) => {
                        this.repairDepartmentOptions = res.departments;
                    });

                break;
            case this.isPMTruckTable:
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

                break;
            case this.isPMTrailerTable:
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

                break;
            default:
                break;
        }
    }

    private getConstantData(): void {
        switch (true) {
            case this.isPhoneTable:
                this.modalTableHeaders =
                    ModalTableConstants.PHONE_TABLE_HEADER_ITEMS;

                break;
            case this.isEmailTable:
                this.modalTableHeaders =
                    ModalTableConstants.EMAIL_TABLE_HEADER_ITEMS;

                break;
            case this.isRepairBillTable && !this.isRepairOrderTable:
                this.modalTableHeaders =
                    ModalTableConstants.REPAIR_BILL_TABLE_HEADER_ITEMS;

                break;
            case this.isRepairOrderTable:
                this.modalTableHeaders =
                    ModalTableConstants.REPAIR_ORDER_TABLE_HEADER_ITEMS;

                break;
            case this.isContactTable:
                this.modalTableHeaders =
                    ModalTableConstants.CONTACT_TABLE_HEADER_ITEMS;

                break;
            case this.isPMTruckTable:
                this.modalTableHeaders =
                    ModalTableConstants.PM_TRUCK_TABLE_HEADER_ITEMS;

                break;
            case this.isPMTrailerTable:
                this.modalTableHeaders =
                    ModalTableConstants.PM_TRAILER_TABLE_HEADER_ITEMS;

                break;
            default:
                break;
        }
    }

    private getModalTableDataValue(): void {
        let modalTableDataValue = this.getFormArray().value;

        if (this.isRepairBillTable || this.isRepairOrderTable) {
            modalTableDataValue = modalTableDataValue.map(
                (itemRow: RepairItemCommand, index: number) => {
                    return {
                        ...itemRow,
                        ...(this.isRepairBillTable &&
                            !this.isRepairOrderTable && {
                                subtotal: this.subTotals[index]?.subtotal,
                            }),
                        pmTruck:
                            this.selectedTruckTrailerRepairPm[index]?.truckId &&
                            this.selectedTruckTrailerRepairPm[index],
                        pmTrailer:
                            this.selectedTruckTrailerRepairPm[index]
                                ?.trailerId &&
                            this.selectedTruckTrailerRepairPm[index],
                        quantity: +itemRow.quantity,
                        price: +itemRow.price,
                    };
                }
            );
        }

        this.modalTableValueEmitter.emit(modalTableDataValue);
    }

    public getFormArray(): UntypedFormArray {
        switch (true) {
            case this.isPhoneTable:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.PHONE_TABLE_ITEMS
                ) as UntypedFormArray;
            case this.isEmailTable:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.EMAIL_TABLE_ITEMS
                ) as UntypedFormArray;
            case this.isRepairBillTable:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.REPAIR_BILL_TABLE_ITEMS
                ) as UntypedFormArray;
            case this.isRepairOrderTable:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.REPAIR_ORDER_TABLE_ITEMS
                ) as UntypedFormArray;
            case this.isContactTable:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.CONTACT_TABLE_ITEMS
                ) as UntypedFormArray;
            case this.isPMTruckTable || this.isPMTrailerTable:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.PM_TABLE_ITEMS
                ) as UntypedFormArray;
            default:
                break;
        }
    }

    private createFormArrayRow(): void {
        const newIsInputHoverRow = this.createIsHoverRow();

        let newFormArrayRow: UntypedFormGroup;

        switch (true) {
            case this.isPhoneTable:
                newFormArrayRow = this.formBuilder.group({
                    phone: [null, [Validators.required, phoneFaxRegex]],
                    phoneExt: [null, phoneExtension],
                    contactPhoneType: [null],
                });

                this.isContactPhoneExtExist = [
                    ...this.isContactPhoneExtExist,
                    false,
                ];

                break;
            case this.isEmailTable:
                newFormArrayRow = this.formBuilder.group({
                    email: [null, [Validators.required]],
                    contactEmailType: [null],
                });

                this.inputService.customInputValidator(
                    newFormArrayRow.get(TaModalTableStringEnum.EMAIL),
                    TaModalTableStringEnum.EMAIL,
                    this.destroy$
                );

                break;
            case this.isRepairBillTable && !this.isRepairOrderTable:
                newFormArrayRow = this.formBuilder.group({
                    description: [null, [Validators.required]],
                    pm: [null],
                    quantity: [null, [Validators.required]],
                    price: [null, [Validators.required]],
                });

                break;
            case this.isRepairOrderTable:
                newFormArrayRow = this.formBuilder.group({
                    description: [null, [Validators.required]],
                    pm: [null],
                    quantity: [null, [Validators.required]],
                });

                break;
            case this.isContactTable:
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

                break;
            case this.isPMTruckTable || this.isPMTrailerTable:
                newFormArrayRow = this.formBuilder.group({
                    id: [null],
                    isChecked: [true, [Validators.required]],
                    svg: [
                        TableStringEnum.PM_DEFAULT_SVG,
                        [Validators.required],
                    ],
                    title: [
                        null,
                        [Validators.required, ...descriptionValidation],
                    ],
                    mileage: [null, [Validators.required]],
                    defaultMileage: [null, [Validators.required]],
                    status: [null],
                    value: [null],
                });

                break;
            default:
                break;
        }

        this.isInputHoverRows = [...this.isInputHoverRows, newIsInputHoverRow];

        this.getFormArray().push(newFormArrayRow);
    }

    public deleteFormArrayRow(index: number): void {
        this.getFormArray().removeAt(index);

        switch (true) {
            case this.isPhoneTable:
                this.isContactPhoneExtExist.splice(index, 1);
                this.selectedContactPhoneType.splice(index, 1);

                break;
            case this.isEmailTable:
                this.selectedContactEmailType.splice(index, 1);

                break;
            case this.isRepairBillTable || this.isRepairOrderTable:
                this.selectedTruckTrailerRepairPm.splice(index, 1);

                break;
            default:
                break;
        }

        this.getModalTableDataValue();
    }

    private createIsHoverRow(): boolean[] {
        return JSON.parse(
            JSON.stringify(
                this.isPhoneTable
                    ? ModalTableConstants.IS_INPUT_HOVER_ROW_PHONE
                    : this.isEmailTable
                    ? ModalTableConstants.IS_INPUT_HOVER_ROW_EMAIL
                    : this.isRepairBillTable && !this.isRepairOrderTable
                    ? ModalTableConstants.IS_INPUT_HOVER_ROW_REPAIR_BILL
                    : this.isRepairOrderTable
                    ? ModalTableConstants.IS_INPUT_HOVER_ROW_REPAIR_ORDER
                    : this.isContactTable
                    ? ModalTableConstants.IS_INPUT_HOVER_ROW_CONTACT
                    : this.isContactTable
                    ? ModalTableConstants.IS_INPUT_HOVER_ROW_CONTACT
                    : null
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
        modalTableData: (
            | ContactPhoneResponse
            | ContactEmailResponse
            | RepairItemResponse
            | PMTableData
        )[]
    ): void {
        for (let i = 0; i < modalTableData.length; i++) {
            this.createFormArrayRow();

            switch (true) {
                case this.isPhoneTable:
                    const phoneData = modalTableData[i] as ContactPhoneResponse;

                    this.getFormArray().at(i).patchValue({
                        phone: phoneData?.phone,
                        phoneExt: phoneData?.phoneExt,
                        contactPhoneType: phoneData?.contactPhoneType.name,
                    });

                    if (phoneData?.phoneExt)
                        this.isContactPhoneExtExist[i] = true;

                    if (phoneData?.contactPhoneType.name)
                        this.selectedContactPhoneType[i] =
                            phoneData?.contactPhoneType;

                    break;
                case this.isEmailTable:
                    const emailData = modalTableData[i] as ContactEmailResponse;

                    this.getFormArray().at(i).patchValue({
                        email: emailData?.email,
                        contactEmailType: emailData?.contactEmailType.name,
                    });

                    this.inputService.customInputValidator(
                        this.getFormArray()
                            .at(i)
                            .get(TaModalTableStringEnum.EMAIL),
                        TaModalTableStringEnum.EMAIL,
                        this.destroy$
                    );

                    if (emailData?.contactEmailType.name)
                        this.selectedContactEmailType[i] =
                            emailData?.contactEmailType;

                    break;
                case this.isRepairBillTable && !this.isRepairOrderTable:
                    const repairBillData = modalTableData[
                        i
                    ] as RepairItemResponse;

                    this.getFormArray()
                        .at(i)
                        .patchValue({
                            description: repairBillData?.description,
                            pm:
                                repairBillData?.pmTruck?.title ||
                                repairBillData?.pmTrailer?.title,
                            quantity: repairBillData?.quantity,
                            price: repairBillData?.price,
                            subtotal: repairBillData?.subtotal,
                        });

                    this.subTotals[i] = {
                        subtotal: repairBillData?.subtotal,
                        index: i,
                    };

                    this.selectedTruckTrailerRepairPm[i] =
                        repairBillData?.pmTruck || repairBillData?.pmTrailer;

                    break;
                case this.isRepairOrderTable:
                    const repairOrderData = modalTableData[
                        i
                    ] as RepairItemResponse;

                    this.getFormArray()
                        .at(i)
                        .patchValue({
                            description: repairOrderData?.description,
                            pm:
                                repairOrderData?.pmTruck?.title ||
                                repairOrderData?.pmTrailer?.title,
                            quantity: repairOrderData?.quantity,
                        });

                    this.selectedTruckTrailerRepairPm[i] =
                        repairOrderData?.pmTruck || repairOrderData?.pmTrailer;

                    break;
                case this.isPMTruckTable || this.isPMTrailerTable:
                    const pmData = modalTableData[i] as PMTableData;

                    this.getFormArray().at(i).patchValue({
                        id: pmData?.id,
                        isChecked: pmData?.isChecked,
                        svg: pmData?.svg,
                        title: pmData?.title,
                        mileage: pmData?.mileage,
                        defaultMileage: pmData?.defaultMileage,
                        status: pmData?.status,
                        value: pmData?.title,
                    });

                    break;
                default:
                    break;
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

        if (this.isRepairBillTable)
            setTimeout(() => {
                this.calculateRepairBillSubtotal();
            }, 300);
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

    public calculateRepairBillSubtotal(): void {
        if (this.isRepairBillTable && !this.isRepairOrderTable)
            this.modalTableForm
                .get(TaModalTableStringEnum.REPAIR_BILL_TABLE_ITEMS)
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((items: RepairItemResponse[]) => {
                    if (items?.length) this.subTotals = [];

                    items?.forEach((item, index) => {
                        const calculateSubtotal = item.quantity * item.price;

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

    private resetIsRepairBillTableForm(): void {
        if (!this.isRepairOrderTable) {
            const formArray = this.getFormArray();

            if (formArray) {
                formArray.controls.forEach((control) => {
                    if (control instanceof FormGroup) {
                        control.addControl(
                            TaModalTableStringEnum.PRICE,
                            this.formBuilder.control(null, Validators.required)
                        );
                    }
                });
            }
        }

        if (this.isRepairOrderTable) {
            const formArray = this.getFormArray();

            if (formArray) {
                formArray.controls.forEach((control) => {
                    if (control instanceof FormGroup) {
                        this.inputService.changeValidators(
                            control.get(TaModalTableStringEnum.PRICE),
                            false
                        );
                    }
                });
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
