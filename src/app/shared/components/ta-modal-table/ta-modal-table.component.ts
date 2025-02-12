import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
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
import { TaModalTablePhoneComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-phone/ta-modal-table-phone.component';
import { TaModalTableEmailComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-email/ta-modal-table-email.component';
import { TaModalTableRepairComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-repair/ta-modal-table-repair.component';
import { TaModalTableContactComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-contact/ta-modal-table-contact.component';
import { TaModalTablePmComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-pm/ta-modal-table-pm.component';
import { TaModalTableOffDutyLocationComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-off-duty-location/ta-modal-table-off-duty-location.component';
import { TaModalTableFuelCardComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-fuel-card/ta-modal-table-fuel-card.component';
import { TaModalTablePreviousAddressesComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-previous-addresses/ta-modal-table-previous-addresses.component';
import { TaModalTableLoadItemsComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-load-items/ta-modal-table-load-items.component';
import { TaModalTableDepartmentComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-department/ta-modal-table-department.component';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ContactsService } from '@shared/services/contacts.service';
import { PmService } from '@pages/pm-truck-trailer/services/pm.service';
import { DriverService } from '@pages/driver/services/driver.service';
import { FormService } from '@shared/services/form.service';

// constants
import { ModalTableConstants } from '@shared/components/ta-modal-table/utils/constants/';

// enums
import { TaModalTableStringEnum } from '@shared/components/ta-modal-table/enums/';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';

// validations
import {
    addressValidation,
    descriptionValidation,
    phoneExtension,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// pipes
import { HeaderRequiredStarPipe } from '@shared/components/ta-modal-table/pipes/';
import { MultiSwitchCasePipe } from '@shared/pipes/multi-switch-case.pipe';

// SVG routes
import { ModalTableSvgRoutes } from '@shared/components/ta-modal-table/utils/svg-routes';

// models
import {
    AddressEntity,
    ContactEmailResponse,
    ContactPhoneResponse,
    CreateContactEmailCommand,
    CreateContactPhoneCommand,
    DepartmentResponse,
    DriverModalFuelCardResponse,
    EnumValue,
    GetDriverModalResponse,
    DriverDetailsOffDutyLocationResponse,
    LoadStopItemCommand,
    TrailerTypeResponse,
    CompanyOfficeDepartmentContactResponse,
    BrokerContactResponse,
    RepairShopContactResponse,
    FuelItemResponse,
} from 'appcoretruckassist';
import { RepairItemResponse } from 'appcoretruckassist';
import { RepairSubtotal } from '@pages/repair/pages/repair-modals/repair-order-modal/models/repair-subtotal.model';
import { PMTableData } from '@pages/pm-truck-trailer/pages/pm-table/models/pm-table-data.model';
import { ModalTableDropdownOption } from '@shared/models/pm-dropdown-options.model';
import { TruckTrailerPmDropdownLists } from '@shared/models/truck-trailer-pm-dropdown-lists.model';
import { RepairItemCommand } from 'appcoretruckassist/model/repairItemCommand';
import { LoadStopItemDropdownLists } from '@pages/load/pages/load-modal/models';

// enums
import { eFuelTransactionType } from '@pages/fuel/pages/fuel-table/enums';
import { FuelDataOptionsStringEnum } from '@pages/fuel/enums';

@Component({
    selector: 'app-ta-modal-table',
    templateUrl: './ta-modal-table.component.html',
    styleUrls: ['./ta-modal-table.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        ReactiveFormsModule,

        // components
        TaModalTablePhoneComponent,
        TaModalTableEmailComponent,
        TaModalTableRepairComponent,
        TaModalTableContactComponent,
        TaModalTablePmComponent,
        TaModalTableOffDutyLocationComponent,
        TaModalTableFuelCardComponent,
        TaModalTablePreviousAddressesComponent,
        TaModalTableLoadItemsComponent,
        TaModalTableDepartmentComponent,

        // pipes
        HeaderRequiredStarPipe,
        MultiSwitchCasePipe,
    ],
})
export class TaModalTableComponent implements OnInit, OnChanges, OnDestroy {
    @Input() tableType: ModalTableTypeEnum;
    @Input() isNewRowCreated: boolean = false;
    @Input() isEdit?: boolean = false;
    @Input() isResetSelected?: boolean = false;

    @Input() modalTableData?:
        | ContactPhoneResponse[]
        | ContactEmailResponse[]
        | RepairItemResponse[]
        | PMTableData[]
        | DriverDetailsOffDutyLocationResponse[]
        | DriverModalFuelCardResponse[]
        | BrokerContactResponse[]
        | RepairShopContactResponse[] = [];
    @Input() dropdownData?: TruckTrailerPmDropdownLists | DepartmentResponse[];
    @Input() stopItemDropdownLists?: LoadStopItemDropdownLists;
    @Input() isHazardous: boolean;
    @Input() selectedTrailer: TrailerTypeResponse;
    @Input() isFuelTransactionTable: boolean;
    @Input() fuelItemsDropdown: EnumValue[];
    @Input() fuelTransactionType: eFuelTransactionType;
    @Input() fuelModalActionType: FuelDataOptionsStringEnum;

    @Output() modalTableValueEmitter = new EventEmitter<
        | CreateContactPhoneCommand[]
        | CreateContactEmailCommand[]
        | RepairItemCommand[]
        | LoadStopItemCommand[]
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
    public selectedDepartment: DepartmentResponse[] = [];
    public departmentOptions: DepartmentResponse[] = [];

    // repair bill table
    public selectedTruckTrailerRepairPm = [];
    public truckTrailerRepairPmOptions = [];
    public subTotals: RepairSubtotal[] = [];
    public activeFuelItem = [];
    // pm table
    public pmTruckOptions: ModalTableDropdownOption[] = [];
    public pmTrailerOptions: ModalTableDropdownOption[] = [];
    public activePmDropdownItem: ModalTableDropdownOption[] = [];

    // off duty location table
    public selectedAddress: AddressEntity[] = [];

    // fuel card table
    public selectedFuelCard: DriverModalFuelCardResponse[] = [];
    public fuelCardOptions: DriverModalFuelCardResponse[] = [];

    // Load table
    public selectedQuantity: EnumValue[] = [];
    public selectedStack: EnumValue[] = [];
    public selectedSecure: EnumValue[] = [];
    public selectedTarps: EnumValue[] = [];
    public selectedHazardous: EnumValue[] = [];

    // enums
    public taModalTableStringEnum = TaModalTableStringEnum;
    public modalTableTypeEnum = ModalTableTypeEnum;

    // SVG routes
    public svgRoutes = ModalTableSvgRoutes;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private inputService: TaInputService,
        private contactService: ContactsService,
        private pmService: PmService,
        private driverService: DriverService,
        private formService: FormService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getDropdownLists();

        this.checkForInputChanges();

        this.calculateRepairBillSubtotal();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.modalTableData?.currentValue) {
            setTimeout(() =>
                this.updateModalTableData(changes.modalTableData.currentValue)
            );
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

        if (
            changes.tableType?.currentValue ===
                ModalTableTypeEnum.REPAIR_ORDER ||
            changes.tableType?.currentValue === ModalTableTypeEnum.REPAIR_BILL
        ) {
            this.resetIsRepairBillTableForm();

            this.getConstantData();
        }

        if (
            !changes.isResetSelected?.firstChange &&
            changes.isResetSelected?.currentValue
        ) {
            this.resetSelected();
        }
    }

    get isPhoneTable() {
        return this.tableType === ModalTableTypeEnum.PHONE;
    }

    get isEmailTable() {
        return this.tableType === ModalTableTypeEnum.EMAIL;
    }

    get isRepairBillTable() {
        return this.tableType === ModalTableTypeEnum.REPAIR_BILL;
    }

    get isRepairOrderTable() {
        return this.tableType === ModalTableTypeEnum.REPAIR_ORDER;
    }

    get isContactTable() {
        return this.tableType === ModalTableTypeEnum.CONTACT;
    }

    get isDepartmentContactTable() {
        return this.tableType === ModalTableTypeEnum.DEPARTMENT_CONTACT;
    }

    get isPMTruckTable() {
        return this.tableType === ModalTableTypeEnum.PM_TRUCK;
    }

    get isPMTrailerTable() {
        return this.tableType === ModalTableTypeEnum.PM_TRAILER;
    }

    get isOffDutyLocationTable() {
        return this.tableType === ModalTableTypeEnum.OFF_DUTY_LOCATION;
    }

    get isFuelCardTable() {
        return this.tableType === ModalTableTypeEnum.FUEL_CARD;
    }

    get isPreviousAddressesTable() {
        return this.tableType === ModalTableTypeEnum.PREVIOUS_ADDRESSES;
    }

    get isLoadItemTable() {
        return this.tableType === ModalTableTypeEnum.LOAD_ITEMS;
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
            offDutyLocationTableItems: this.formBuilder.array([]),
            fuelCardTableItems: this.formBuilder.array([]),
            previousAddressesTableItems: this.formBuilder.array([]),
            loadModalTableItems: this.formBuilder.array([]),
            departmentTableItems: this.formBuilder.array([]),
        });
    }

    private resetSelected(): void {
        if (this.isRepairBillTable || this.isRepairOrderTable)
            this.selectedTruckTrailerRepairPm = [];
    }

    public onSelectAddress(event: {
        address: {
            address: AddressEntity;
            valid: boolean;
        };
        index: number;
    }): void {
        const { address, index } = event;

        if (address.valid) {
            this.selectedAddress[index] = address.address;

            this.getModalTableDataValue();
        }
    }

    public onSelectDropdown(event: {
        dropdownEvent: ModalTableDropdownOption;
        action: string;
        index?: number;
    }): void {
        const { dropdownEvent, action, index } = event;

        switch (action) {
            case TaModalTableStringEnum.CONTACT_PHONE_TYPE:
                this.selectedContactPhoneType[index] = dropdownEvent;

                break;
            case TaModalTableStringEnum.CONTACT_EMAIL_TYPE:
                this.selectedContactEmailType[index] = dropdownEvent;

                break;
            case TaModalTableStringEnum.PM_TRUCK_TRAILER_REPAIR_TYPE:
                this.selectedTruckTrailerRepairPm[index] = dropdownEvent;

                break;
            case TaModalTableStringEnum.CONTACT_DEPARTMENT_TYPE:
                this.selectedDepartment[index] = dropdownEvent;

                break;
            case TaModalTableStringEnum.PM_TRUCK_TYPE:
                this.handleDropdownPmType(
                    dropdownEvent,
                    index,
                    TableStringEnum.PM_DEFAULT_MILEAGE
                );

                break;
            case TaModalTableStringEnum.PM_TRAILER_TYPE:
                this.handleDropdownPmType(
                    dropdownEvent,
                    index,
                    TableStringEnum.PM_DEFAULT_MONTHS
                );

                break;
            case TaModalTableStringEnum.FUEL_CARD_TYPE:
                this.selectedFuelCard[index] = dropdownEvent;

                break;

            case TaModalTableStringEnum.REPAIR_BILL_TABLE_ITEMS:
                this.activeFuelItem[index] = dropdownEvent;

                break;
            default:
                break;
        }
    }

    private handleDropdownPmType(
        event: ModalTableDropdownOption,
        index: number,
        defaultMileage: string
    ): void {
        if (event) {
            this.activePmDropdownItem[index] = event;

            this.getFormArray()
                .at(index)
                .patchValue({
                    svg: event.logoName,
                    title: event.title,
                    mileage: event.mileage ?? defaultMileage,
                    defaultMileage: event.mileage ?? defaultMileage,
                    value: event.title,
                });
        }
    }

    private getDropdownLists(
        dropdownData?: TruckTrailerPmDropdownLists[] | DepartmentResponse[]
    ): void {
        switch (this.tableType) {
            case ModalTableTypeEnum.EMAIL:
            case ModalTableTypeEnum.PHONE:
                this.getPhoneEmailDropdownList();

                break;
            case ModalTableTypeEnum.REPAIR_BILL:
            case ModalTableTypeEnum.REPAIR_ORDER:
                this.truckTrailerRepairPmOptions = dropdownData;

                break;
            case ModalTableTypeEnum.CONTACT:
            case ModalTableTypeEnum.DEPARTMENT_CONTACT:
                this.departmentOptions = dropdownData as DepartmentResponse[];

                break;
            case ModalTableTypeEnum.PM_TRUCK:
                this.getPmTruckDropdownList();

                break;
            case ModalTableTypeEnum.PM_TRAILER:
                this.getPmTrailerDropdownList();

                break;
            case ModalTableTypeEnum.FUEL_CARD:
                this.getFuelCardDropdownList();

                break;
            default:
                break;
        }
    }

    private getPhoneEmailDropdownList(): void {
        this.contactService
            .getCompanyContactModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.contactPhoneTypeOptions = res.contactPhoneType;
                this.contactEmailTypeOptions = res.contactEmailType;
            });
    }

    private getPmTruckDropdownList(): void {
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
    }

    private getPmTrailerDropdownList(): void {
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

    private getFuelCardDropdownList(): void {
        this.driverService
            .getDriverDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: GetDriverModalResponse) => {
                if (data) {
                    const { fuelCards } = data;

                    this.fuelCardOptions = fuelCards;
                }
            });
    }

    private getConstantData(): void {
        switch (this.tableType) {
            case ModalTableTypeEnum.PHONE:
                this.modalTableHeaders =
                    ModalTableConstants.PHONE_TABLE_HEADER_ITEMS;

                break;
            case ModalTableTypeEnum.EMAIL:
                this.modalTableHeaders =
                    ModalTableConstants.EMAIL_TABLE_HEADER_ITEMS;

                break;
            case ModalTableTypeEnum.REPAIR_BILL:
                this.modalTableHeaders = this.isFuelTransactionTable
                    ? ModalTableConstants.FUEL_TABLE_HEADER_ITEMS
                    : ModalTableConstants.REPAIR_BILL_TABLE_HEADER_ITEMS;

                break;
            case ModalTableTypeEnum.REPAIR_ORDER:
                this.modalTableHeaders =
                    ModalTableConstants.REPAIR_ORDER_TABLE_HEADER_ITEMS;

                break;
            case ModalTableTypeEnum.CONTACT:
                this.modalTableHeaders =
                    ModalTableConstants.CONTACT_TABLE_HEADER_ITEMS;

                break;
            case ModalTableTypeEnum.DEPARTMENT_CONTACT:
                this.modalTableHeaders =
                    ModalTableConstants.DEPARTMENT_CONTACT_TABLE_HEADER_ITEMS;

                break;
            case ModalTableTypeEnum.PM_TRUCK:
                this.modalTableHeaders =
                    ModalTableConstants.PM_TRUCK_TABLE_HEADER_ITEMS;

                break;
            case ModalTableTypeEnum.PM_TRAILER:
                this.modalTableHeaders =
                    ModalTableConstants.PM_TRAILER_TABLE_HEADER_ITEMS;

                break;
            case ModalTableTypeEnum.OFF_DUTY_LOCATION:
                this.modalTableHeaders =
                    ModalTableConstants.OFF_DUTY_LOCATION_TABLE_HEADER_ITEMS;

                break;
            case ModalTableTypeEnum.FUEL_CARD:
                this.modalTableHeaders =
                    ModalTableConstants.FUEL_CARD_TABLE_HEADER_ITEMS;

                break;
            case ModalTableTypeEnum.PREVIOUS_ADDRESSES:
                this.modalTableHeaders =
                    ModalTableConstants.PREVIOUS_ADDRESSES_TABLE_HEADER_ITEMS;

                break;
            case ModalTableTypeEnum.LOAD_ITEMS:
                this.modalTableHeaders =
                    ModalTableConstants.LOAD_ITEM_TABLE_HEADER_ITEMS;

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
                                subtotal: itemRow.subtotal,
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

        if (this.isOffDutyLocationTable) {
            modalTableDataValue = modalTableDataValue.map(
                (
                    itemRow: DriverDetailsOffDutyLocationResponse,
                    index: number
                ) => {
                    return {
                        ...itemRow,
                        address:
                            this.selectedAddress[index]?.address &&
                            this.selectedAddress[index],
                    };
                }
            );
        }

        if (this.isPreviousAddressesTable) {
            modalTableDataValue = modalTableDataValue.map(
                (item, index: number) => {
                    return {
                        unit: item.unit,
                        address: this.selectedAddress[index],
                    };
                }
            );
        }

        this.modalTableValueEmitter.emit(modalTableDataValue);
    }

    public getFormArray(): UntypedFormArray {
        switch (this.tableType) {
            case ModalTableTypeEnum.PHONE:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.PHONE_TABLE_ITEMS
                ) as UntypedFormArray;
            case ModalTableTypeEnum.EMAIL:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.EMAIL_TABLE_ITEMS
                ) as UntypedFormArray;
            case ModalTableTypeEnum.REPAIR_BILL:
            case ModalTableTypeEnum.REPAIR_ORDER:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.REPAIR_BILL_TABLE_ITEMS
                ) as UntypedFormArray;
            case ModalTableTypeEnum.REPAIR_ORDER:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.REPAIR_ORDER_TABLE_ITEMS
                ) as UntypedFormArray;
            case ModalTableTypeEnum.CONTACT:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.CONTACT_TABLE_ITEMS
                ) as UntypedFormArray;
            case ModalTableTypeEnum.DEPARTMENT_CONTACT:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.DEPARTMENT_CONTACT_ITEMS
                ) as UntypedFormArray;
            case ModalTableTypeEnum.PM_TRUCK:
            case ModalTableTypeEnum.PM_TRAILER:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.PM_TABLE_ITEMS
                ) as UntypedFormArray;
            case ModalTableTypeEnum.OFF_DUTY_LOCATION:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.OFF_DUTY_LOCATION_TABLE_ITEMS
                ) as UntypedFormArray;
            case ModalTableTypeEnum.FUEL_CARD:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.FUEL_CARD_TABLE_ITEMS
                ) as UntypedFormArray;
            case ModalTableTypeEnum.PREVIOUS_ADDRESSES:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.PREVIOUS_ADDRESSES_TABLE_ITEMS
                ) as UntypedFormArray;
            case ModalTableTypeEnum.LOAD_ITEMS:
                return this.modalTableForm?.get(
                    TaModalTableStringEnum.LOAD_MODAL_TABLE_ITEMS
                ) as UntypedFormArray;
            default:
                break;
        }
    }

    private createFormArrayRow(): void {
        const newIsInputHoverRow = this.createIsHoverRow();

        let newFormArrayRow: UntypedFormGroup;

        switch (this.tableType) {
            case ModalTableTypeEnum.PHONE:
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
            case ModalTableTypeEnum.EMAIL:
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
            case ModalTableTypeEnum.REPAIR_BILL:
                newFormArrayRow = this.formBuilder.group({
                    description: [
                        null,
                        this.isFuelTransactionTable
                            ? null
                            : [Validators.required],
                    ],
                    pm: [null],
                    quantity: [
                        null,
                        this.isFuelTransactionTable
                            ? null
                            : [Validators.required],
                    ],
                    price: [null, [Validators.required]],
                    itemfuel: [
                        null,
                        !this.isFuelTransactionTable
                            ? null
                            : [Validators.required],
                    ],
                    qty: [
                        null,
                        !this.isFuelTransactionTable
                            ? null
                            : [Validators.required],
                    ],
                    subtotal: [null],
                });

                break;
            case ModalTableTypeEnum.REPAIR_ORDER:
                newFormArrayRow = this.formBuilder.group({
                    description: [null, [Validators.required]],
                    pm: [null],
                    quantity: [null, [Validators.required]],
                });

                break;
            case ModalTableTypeEnum.CONTACT:
                newFormArrayRow = this.formBuilder.group({
                    fullName: [null, [Validators.required]],
                    department: [null, [Validators.required]],
                    phone: [null, [Validators.required, phoneFaxRegex]],
                    phoneExt: [
                        TaModalTableStringEnum.EMPTY_STRING,
                        phoneExtension,
                    ],
                    email: [null, [Validators.required]],
                });

                this.inputService.customInputValidator(
                    newFormArrayRow.get(TaModalTableStringEnum.EMAIL),
                    TaModalTableStringEnum.EMAIL,
                    this.destroy$
                );

                break;
            case ModalTableTypeEnum.DEPARTMENT_CONTACT:
                newFormArrayRow = this.formBuilder.group({
                    department: [null, [Validators.required]],
                    phone: [null, [Validators.required, phoneFaxRegex]],
                    extensionPhone: [null, phoneExtension],
                    email: [null, [Validators.required]],
                });

                break;
            case ModalTableTypeEnum.PM_TRAILER:
            case ModalTableTypeEnum.PM_TRUCK:
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
                    defaultMileage: [null],
                    status: [null],
                    value: [null],
                });

                break;
            case ModalTableTypeEnum.OFF_DUTY_LOCATION:
                newFormArrayRow = this.formBuilder.group({
                    nickname: [null, [Validators.required]],
                    address: [null, [Validators.required]],
                });

                break;
            case ModalTableTypeEnum.FUEL_CARD:
                newFormArrayRow = this.formBuilder.group({
                    card: [null, [Validators.required]],
                });

                break;
            case ModalTableTypeEnum.PREVIOUS_ADDRESSES:
                newFormArrayRow = this.formBuilder.group({
                    address: [
                        null,
                        [Validators.required, ...addressValidation],
                    ],
                    unit: [null, Validators.maxLength(50)],
                });

                break;
            case ModalTableTypeEnum.LOAD_ITEMS:
                newFormArrayRow = this.formBuilder.group({
                    description: [
                        null,
                        this.isHazardous
                            ? null
                            : [...descriptionValidation, Validators.required],
                    ],
                    quantity: [null],
                    temperature: [
                        null,
                        this.formService.rangeValidator(-20, 99),
                    ],
                    weight: [
                        null,
                        this.formService.rangeValidator(0, 9999999, 7),
                    ],
                    length: [null, this.formService.rangeValidator(0, 999)],
                    height: [null, this.formService.rangeValidator(0, 999)],
                    tarp: [null],
                    stackable: [null],
                    secure: [null],
                    bolNumber: [null],
                    pickupNumber: [null],
                    sealNumber: [null],
                    code: [null],
                    hazardousMaterialId: [
                        null,
                        !this.isHazardous ? null : [Validators.required],
                    ],
                    units: [null],
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
        switch (this.tableType) {
            case ModalTableTypeEnum.PHONE:
                this.isContactPhoneExtExist.splice(index, 1);
                this.selectedContactPhoneType.splice(index, 1);

                break;
            case ModalTableTypeEnum.EMAIL:
                this.selectedContactEmailType.splice(index, 1);

                break;
            case ModalTableTypeEnum.REPAIR_BILL:
            case ModalTableTypeEnum.REPAIR_ORDER:
                this.selectedTruckTrailerRepairPm.splice(index, 1);
                this.activeFuelItem.slice(index, 1);

                break;
            case ModalTableTypeEnum.CONTACT:
            case ModalTableTypeEnum.DEPARTMENT_CONTACT:
                this.selectedDepartment.splice(index, 1);

                break;
            case ModalTableTypeEnum.OFF_DUTY_LOCATION:
            case ModalTableTypeEnum.PREVIOUS_ADDRESSES:
                this.selectedAddress.splice(index, 1);

                break;
            case ModalTableTypeEnum.FUEL_CARD:
                this.selectedFuelCard.splice(index, 1);

                break;
            case ModalTableTypeEnum.LOAD_ITEMS:
                this.selectedQuantity.splice(index, 1);
                this.selectedStack.splice(index, 1);
                this.selectedSecure.splice(index, 1);
                this.selectedTarps.splice(index, 1);
                this.selectedHazardous.splice(index, 1);

                break;
            default:
                break;
        }

        this.getModalTableDataValue();
    }

    public deleteHazardous(index: number) {
        this.selectedHazardous.splice(index, 1);
    }

    private createIsHoverRow(): boolean[] {
        let isInputHoverRow = null;

        switch (this.tableType) {
            case ModalTableTypeEnum.PHONE:
                isInputHoverRow = ModalTableConstants.IS_INPUT_HOVER_ROW_PHONE;

                break;
            case ModalTableTypeEnum.EMAIL:
                isInputHoverRow = ModalTableConstants.IS_INPUT_HOVER_ROW_EMAIL;

                break;
            case ModalTableTypeEnum.REPAIR_BILL:
                isInputHoverRow = this.isFuelTransactionTable
                    ? ModalTableConstants.IS_INPUT_HOVER_ROW_FUEL_TRANSACTION
                    : ModalTableConstants.IS_INPUT_HOVER_ROW_REPAIR_BILL;

                break;
            case ModalTableTypeEnum.REPAIR_ORDER:
                isInputHoverRow =
                    ModalTableConstants.IS_INPUT_HOVER_ROW_REPAIR_ORDER;

                break;
            case ModalTableTypeEnum.CONTACT:
                isInputHoverRow =
                    ModalTableConstants.IS_INPUT_HOVER_ROW_CONTACT;

                break;
            case ModalTableTypeEnum.DEPARTMENT_CONTACT:
                isInputHoverRow =
                    ModalTableConstants.IS_INPUT_HOVER_ROW_DEPARTMENT_CONTACTS;

                break;
            case ModalTableTypeEnum.OFF_DUTY_LOCATION:
                isInputHoverRow =
                    ModalTableConstants.IS_INPUT_HOVER_ROW_OFF_DUTY_LOCATION;

                break;
            case ModalTableTypeEnum.FUEL_CARD:
                isInputHoverRow =
                    ModalTableConstants.IS_INPUT_HOVER_ROW_FUEL_CARD;

                break;
            case ModalTableTypeEnum.PREVIOUS_ADDRESSES:
                isInputHoverRow =
                    ModalTableConstants.IS_INPUT_HOVER_ROW_PREVIOUS_ADDRESSES;

                break;
            case ModalTableTypeEnum.LOAD_ITEMS:
                isInputHoverRow =
                    ModalTableConstants.IS_INPUT_HOVER_ROW_LOAD_ITEMS;

                break;
            default:
                break;
        }

        return JSON.parse(JSON.stringify(isInputHoverRow));
    }

    public handleInputHover(event: {
        isHovering: boolean;
        isInputHoverRowIndex: number;
        inputIndex: number;
    }): void {
        const { isHovering, isInputHoverRowIndex, inputIndex } = event;

        this.isInputHoverRows[isInputHoverRowIndex][inputIndex] = isHovering;
    }

    private updateModalTableData(
        modalTableData: (
            | ContactPhoneResponse
            | ContactEmailResponse
            | RepairItemResponse
            | PMTableData
            | DriverDetailsOffDutyLocationResponse
            | LoadStopItemCommand
            | RepairShopContactResponse
        )[]
    ): void {
        modalTableData.forEach((data, i) => {
            this.createFormArrayRow();

            switch (this.tableType) {
                case ModalTableTypeEnum.CONTACT:
                    this.handleContactData(data, i);

                    break;
                case ModalTableTypeEnum.DEPARTMENT_CONTACT:
                    this.handleDepartmentContactData(data, i);

                    break;
                case ModalTableTypeEnum.PHONE:
                    this.handlePhoneData(data, i);

                    break;
                case ModalTableTypeEnum.EMAIL:
                    this.handleEmailData(data, i);

                    break;
                case ModalTableTypeEnum.REPAIR_BILL:
                    this.handleRepairBillData(data, i);

                    break;
                case ModalTableTypeEnum.REPAIR_ORDER:
                    this.handleRepairOrderData(data, i);

                    break;
                case ModalTableTypeEnum.PM_TRUCK:
                case ModalTableTypeEnum.PM_TRAILER:
                    this.handlePmData(data, i);

                    break;
                case ModalTableTypeEnum.OFF_DUTY_LOCATION:
                    this.handleOffDutyLocationData(data, i);

                    break;
                case ModalTableTypeEnum.PREVIOUS_ADDRESSES:
                    let addressData = data as {
                        addressUnit: string;
                        address: AddressEntity;
                    };
                    const formGroup = this.getFormArray().at(i);

                    formGroup.patchValue({
                        unit: addressData?.addressUnit,
                        address: addressData?.address?.address,
                    });

                    this.selectedAddress[i] = addressData.address;

                    break;
                case ModalTableTypeEnum.LOAD_ITEMS:
                    this.handleLoadModalItems(data, i);

                    break;
                default:
                    break;
            }

            if (i === modalTableData.length - 1) {
                const isFormValid =
                    this.getFormArray().status === TaModalTableStringEnum.VALID;

                this.modalTableValidStatusEmitter.emit(isFormValid);
            }
        });
    }

    public unitsChanged(event: { unit: EnumValue; index: number }): void {
        const formGroup = this.getFormArray().at(event.index);

        formGroup.patchValue({
            units: event.unit.id,
        });

        // IF WE DON'T SET THIS LAST VALUE WILL ALWAYS BE NULL
        this.modalTableValueEmitter.emit(this.getFormArray().value);
    }

    public handleContactData(
        contactData: BrokerContactResponse | RepairShopContactResponse,
        index: number
    ): void {
        const formGroup = this.getFormArray().at(index);

        const fullName =
            (contactData as BrokerContactResponse).contactName ||
            (contactData as RepairShopContactResponse).fullName;
        const phoneExt =
            (contactData as BrokerContactResponse).extensionPhone ||
            (contactData as RepairShopContactResponse).phoneExt;

        formGroup.patchValue({
            fullName,
            department: contactData.department.name,
            phone: contactData.phone,
            phoneExt: phoneExt ?? TaModalTableStringEnum.EMPTY_STRING,
            email: contactData.email,
        });

        this.selectedDepartment[index] = contactData.department;
    }

    private handleDepartmentContactData(
        contactData: CompanyOfficeDepartmentContactResponse,
        index: number
    ) {
        const formGroup = this.getFormArray().at(index);

        formGroup.patchValue({
            department: contactData.department.name,
            phone: contactData.phone,
            extensionPhone:
                contactData.extensionPhone ??
                TaModalTableStringEnum.EMPTY_STRING,
            email: contactData.email,
        });

        this.selectedDepartment[index] = contactData.department;
    }

    private handlePhoneData(
        phoneData: ContactPhoneResponse,
        index: number
    ): void {
        const formGroup = this.getFormArray().at(index);

        formGroup.patchValue({
            phone: phoneData?.phone,
            phoneExt: phoneData?.phoneExt,
            contactPhoneType: phoneData?.contactPhoneType?.name,
        });

        if (phoneData?.phoneExt) {
            this.isContactPhoneExtExist[index] = true;
        }

        if (phoneData?.contactPhoneType?.name) {
            this.selectedContactPhoneType[index] = phoneData.contactPhoneType;
        }
    }

    private handleEmailData(
        emailData: ContactEmailResponse,
        index: number
    ): void {
        const formGroup = this.getFormArray().at(index);

        formGroup.patchValue({
            email: emailData?.email,
            contactEmailType: emailData?.contactEmailType?.name,
        });

        this.inputService.customInputValidator(
            formGroup.get(TaModalTableStringEnum.EMAIL),
            TaModalTableStringEnum.EMAIL,
            this.destroy$
        );

        if (emailData?.contactEmailType?.name) {
            this.selectedContactEmailType[index] = emailData.contactEmailType;
        }
    }

    private handleRepairBillData(
        repairBillData: RepairItemResponse,
        index: number
    ): void {
        const formGroup = this.getFormArray().at(index);

        formGroup.patchValue({
            description: repairBillData?.description,
            pm:
                repairBillData?.pmTruck?.title ||
                repairBillData?.pmTrailer?.title,
            quantity: repairBillData?.quantity,
            price: repairBillData?.price,
            subtotal: repairBillData?.subtotal,
            qty: (repairBillData as FuelItemResponse)?.qty,
            itemfuel: (repairBillData as FuelItemResponse)?.itemFuel?.name,
        });

        this.subTotals[index] = {
            subtotal: repairBillData?.subtotal,
            index,
        };

        this.selectedTruckTrailerRepairPm[index] =
            repairBillData?.pmTruck || repairBillData?.pmTrailer;

        if (this.isFuelTransactionTable) {
            this.activeFuelItem[index] = (
                repairBillData as FuelItemResponse
            )?.itemFuel;
        }
    }

    private handleRepairOrderData(
        repairOrderData: RepairItemResponse,
        index: number
    ): void {
        const formGroup = this.getFormArray().at(index);

        formGroup.patchValue({
            description: repairOrderData?.description,
            pm:
                repairOrderData?.pmTruck?.title ||
                repairOrderData?.pmTrailer?.title,
            quantity: repairOrderData?.quantity,
        });

        this.selectedTruckTrailerRepairPm[index] =
            repairOrderData?.pmTruck || repairOrderData?.pmTrailer;
    }

    private handlePmData(pmData: PMTableData, index: number): void {
        const formGroup = this.getFormArray().at(index);

        formGroup.patchValue({
            id: pmData?.id,
            isChecked: pmData?.isChecked,
            svg: pmData?.svg,
            title: pmData?.title,
            mileage: pmData?.mileage,
            defaultMileage: pmData?.defaultMileage,
            status: pmData?.status,
            value: pmData?.title,
        });
    }

    private handleOffDutyLocationData(
        offDutyLocationData: DriverDetailsOffDutyLocationResponse,
        index: number
    ): void {
        const formGroup = this.getFormArray().at(index);

        formGroup.patchValue({
            nickname: offDutyLocationData?.nickname,
            address: offDutyLocationData?.address?.address,
        });

        this.selectedAddress[index] = offDutyLocationData?.address;
    }

    private handleLoadModalItems(
        modalItem: LoadStopItemCommand,
        index: number
    ): void {
        const formGroup = this.getFormArray().at(index);
        formGroup.patchValue({
            description: modalItem.description || null,
            quantity: modalItem.quantity || null,
            temperature: modalItem.temperature || null,
            weight: modalItem.weight || null,
            length: modalItem.length || null,
            height: modalItem.height || null,
            tarp: (modalItem.tarp as EnumValue)?.name || null,
            stackable: (modalItem.stackable as EnumValue)?.name || null,
            secure: (modalItem.secure as EnumValue)?.name || null,
            bolNumber: modalItem.bolNumber || null,
            pickupNumber: modalItem.pickupNumber || null,
            sealNumber: modalItem.sealNumber || null,
            code: modalItem.code || null,
            hazardousMaterialId: modalItem.hazardousMaterialId,
            units: modalItem.units || null,
        });

        this.selectedQuantity[index] =
            this.stopItemDropdownLists?.quantityDropdownList?.find(
                (quantity) => quantity.id === (modalItem.units as EnumValue)?.id
            );
        this.selectedStack[index] = modalItem.stackable as EnumValue;
        this.selectedSecure[index] = modalItem.secure as EnumValue;
        this.selectedTarps[index] = modalItem.tarp as EnumValue;

        // if we get items from backend field is called hazardousMaterial not hazardousMaterialId

        this.selectedHazardous[index] =
            this.stopItemDropdownLists?.hazardousDropdownList.find(
                (hazard) =>
                    hazard.id === (modalItem as any).hazardousMaterial?.id
            );
    }

    private checkForInputChanges(): void {
        this.getFormArray()
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.getModalTableDataValue();

                    const isValid =
                        this.getFormArray().status ===
                        TaModalTableStringEnum.VALID;
                    this.modalTableValidStatusEmitter.emit(isValid);
                }
            });
    }

    public calculateRepairBillSubtotal(): void {
        if (this.tableType === ModalTableTypeEnum.REPAIR_BILL)
            this.modalTableForm
                .get(TaModalTableStringEnum.REPAIR_BILL_TABLE_ITEMS)
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe(
                    (items: RepairItemResponse[] | FuelItemResponse[]) => {
                        if (items?.length) this.subTotals = [];

                        items?.forEach((item, index) => {
                            const quantity = this.isFuelTransactionTable
                                ? item.qty
                                : item.quantity;

                            const calculateSubtotal =
                                MethodsCalculationsHelper.convertThousandSepInNumber(
                                    quantity
                                ) *
                                MethodsCalculationsHelper.convertThousandSepInNumber(
                                    item.price
                                );

                            const existingItemIndex = this.subTotals.findIndex(
                                (item) => item.index === index
                            );

                            const subtotalValue = calculateSubtotal || 0;

                            if (existingItemIndex !== -1) {
                                this.subTotals[existingItemIndex].subtotal =
                                    subtotalValue;
                            } else {
                                this.subTotals.push({
                                    subtotal: subtotalValue,
                                    index: index,
                                });
                            }

                            this.getFormArray()
                                .at(index)
                                .get(TaModalTableStringEnum.SUBTOTAL)
                                .patchValue(subtotalValue, {
                                    emitEvent: false,
                                });

                            this.totalCostValueEmitter.emit(this.subTotals);
                        });
                    }
                );
    }

    private resetIsRepairBillTableForm(): void {
        const formArray = this.getFormArray();

        if (formArray) {
            formArray.controls.forEach((control) => {
                if (control instanceof FormGroup) {
                    if (this.tableType === ModalTableTypeEnum.REPAIR_ORDER) {
                        this.inputService.changeValidators(
                            control.get(TaModalTableStringEnum.PRICE),
                            false
                        );
                    } else {
                        control.addControl(
                            TaModalTableStringEnum.PRICE,
                            this.formBuilder.control(null, Validators.required)
                        );
                    }
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
