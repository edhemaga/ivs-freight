import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormArray,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

// moment

// Models

// Services
import { ModalService } from '@shared/services/modal.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';
import { FormService } from '@shared/services/form.service';

// Validators

// Helpers

// Animation
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// Component
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';

// Pipes
import { ActiveItemsPipe } from '@shared/pipes/active-Items.pipe';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Enums
import { RepairShopModalEnum } from './enums/repair-shop-modal.enum';
import { RepairShopConstants } from './utils/constants/repair-shop-modal.constants';
import {
    repairShopValidation,
    phoneFaxRegex,
    phoneExtension,
    addressValidation,
    addressUnitValidation,
    bankValidation,
    routingBankValidation,
    accountBankValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { AddressEntity } from 'appcoretruckassist/model/addressEntity';
import {
    BankResponse,
    CreateResponse,
    EnumValue,
    RepairShopModalResponse,
} from 'appcoretruckassist/model/models';
import { RepairService } from '@shared/services/repair.service';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { mapServices } from './utils/helper';
import { OpenHours, RepairShopModalService } from './models/edit-data.model';
import moment from 'moment';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import { TaUploadFileComponent } from '@shared/components/ta-upload-files/components/ta-upload-file/ta-upload-file.component';
export type OpenHourFormGroup = FormGroup<{
    isDay: FormControl<boolean>;
    dayOfWeek: FormControl<number>;
    dayLabel: FormControl<string>;
    startTime: FormControl<string | null | Date>;
    endTime: FormControl<string | null | Date>;
}>;
@Component({
    selector: 'app-repair-shop-modal',
    templateUrl: './repair-shop-modal.component.html',
    styleUrls: ['./repair-shop-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, BankVerificationService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbModule,

        // Component
        TaAppTooltipV2Component,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaInputDropdownComponent,
        TaInputNoteComponent,
        TaModalTableComponent,
        TaUploadFileComponent,
        // Pipes
        ActiveItemsPipe,
    ],
})
export class RepairShopModalComponent implements OnInit, OnDestroy {
    // Tab
    public tabs = RepairShopConstants.TABS(true);
    selectedTab = 1;
    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

    public animationTabClass = 'animation-three-tabs';
    private destroy$ = new Subject<void>();
    public RepairShopModalEnum = RepairShopModalEnum;
    public repairShopForm: UntypedFormGroup;
    // TODO: add type
    @Input() isEditMode: boolean;
    banks: BankResponse[];
    public selectedAddress: AddressEntity = null;
    services: RepairShopModalService[] = [];

    public repairTypes: EnumValue[] = [];

    // Contact tab
    public modalTableTypeEnum = ModalTableTypeEnum;
    public contactAddedCounter: number = 0;
    isNewContactAdded: boolean;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private shopService: RepairService,
        private bankVerificationService: BankVerificationService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.repairShopForm = this.formBuilder.group({
            name: [null, [Validators.required, ...repairShopValidation]],
            pinned: [null],
            phone: [null, [Validators.required, phoneFaxRegex]],
            phoneExt: [null, [...phoneExtension]],
            email: [null],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            openHours: this.formBuilder.array([]),
            openHoursSameAllDays: [null],
            startTimeAllDays: [null],
            endTimeAllDays: [null],
            openAlways: [false],
            bankId: [null, [...bankValidation]],
            routing: [null, routingBankValidation],
            account: [null, accountBankValidation],
            note: [null],
            contacts: [null],
            files: [null],
            servicesHelper: [null],
            shopServiceType: [null, Validators.required],
        });

        this.initializeServices();

        this.repairShopForm.valueChanges.subscribe(v => console.log(v))
    }

    public onModalAction(e: any) {}

    get modalTitle(): string {
        console.log('setting up title');
        return this.isEditMode
            ? RepairShopModalEnum.MODAL_TITLE_EDIT
            : RepairShopModalEnum.MODAL_TITLE_ADD;
    }

    public tabChange(selectedTab: { id: number }): void {
        this.selectedTab = selectedTab.id;
        let dotAnimation = document.querySelector(`.${this.animationTabClass}`);

        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    // Favorite
    public addShopToFavorite() {
        this.repairShopForm.get('pinned').patchValue(!this.isFavorite);
    }

    get isFavorite() {
        return !!this.repairShopForm.get('pinned').value;
    }

    get favoriteLabel() {
        return this.isFavorite
            ? this.RepairShopModalEnum.REMOVE_FAVORITE
            : this.RepairShopModalEnum.ADD_FAVORITE;
    }

    // TODO:
    // Address starts here
    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
        longLat: any;
    }) {
        if (event.valid) {
            // this.selectedAddress = event.address;
            // this.longitude = event.longLat.longitude;
            // this.latitude = event.longLat.latitude;
        }
    }
    // TODO:
    get isPhoneExtExist() {
        return false;
    }

    // Service tab
    private initializeServices() {
        return this.shopService
            .getRepairShopModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RepairShopModalResponse) => {
                    this.services = mapServices(res, true);
                    this.repairTypes = res.shopServiceTypes;
                    this.banks = res.banks;
                },
            });
    }

    public repairTypeTabChange(repairType: EnumValue) {
        this.repairShopForm.get('shopServiceType').patchValue(repairType.id);
    }

    public activeRepairService(service: RepairShopModalService) {
        service.active = !service.active;
    }

    // Open hours
    public isOpenHoursHidden: boolean = false;
    public timeFormat = 'HH:mm:ss';
    public get openHours(): FormArray<OpenHourFormGroup> {
        return this.repairShopForm.get(
            'openHours'
        ) as FormArray<OpenHourFormGroup>;
    }

    // You can add bank manully if there is no option in dropdown
    public onSaveNewBank(bank: { data: { name: string } }) {
        this.bankVerificationService
            .createBank({ name: bank.data.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CreateResponse) => {
                    const newBank = {
                        id: res.id,
                        name: bank.data.name,
                    };
                    this.repairShopForm.get('bankId').patchValue(newBank.id);
                    this.banks = [...this.banks, newBank];
                },
                error: () => {},
            });
    }

    // New bank selected or field is cleared
    public onBankChange(event: BankResponse | null) {
        this.repairShopForm.get('bankId').patchValue(event?.id ?? null);
    }

    // Set bank field as required
    get isBankSelected() {
        return !!this.repairShopForm.get('bankId').value;
    }

    // Documents
    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];
    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.repairShopForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.repairShopForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) {
                    this.filesForDelete.push(event.deleteId);
                }

                this.fileModified = true;
                break;
            }
            default: {
                break;
            }
        }
    }

    // TODO: Check this code 
    // Contact tab
    public addContact(): void {
        this.isNewContactAdded = true;

        setTimeout(() => {
            this.isNewContactAdded = false;
        }, 400);
    }
    public handleModalTableValueEmit(modalTableDataValue): void {
        this.contactAddedCounter = modalTableDataValue.length;

        this.repairShopForm.get('contacts').patchValue(modalTableDataValue);

        this.cdr.detectChanges();
    }
    public handleModalTableValidStatusEmit(validStatus: boolean): void {
        this.repairShopForm.setErrors({ invalid: !validStatus });
    }
        

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
