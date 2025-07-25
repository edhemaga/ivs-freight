import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    FormArray,
} from '@angular/forms';
import { takeUntil } from 'rxjs';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';
import { RepairService } from '@shared/services/repair.service';
import { CompanyRepairShopService } from '@pages/settings/services/company-repairshop.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// Pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

// Models
import { Confirmation } from '@shared/components/ta-shared-modals/confirmation-modal/models/confirmation.model';
import { RepairShopListDto, RepairShopResponse } from 'appcoretruckassist';
import {
    CompanyOfficeResponseWithGroupedContacts,
    SettingsDepartmentCardModel,
} from '@pages/settings/pages/settings-location/models';

// Enums
import { DropActionsStringEnum } from '@shared/enums/drop-actions-string.enum';
import { RepairShopModalStringEnum } from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';

// Component
import { SettingsLocationBaseComponent } from '../settings-location-base/settings-location-base.component';

@Component({
    selector: 'app-settings-repair-shop',
    templateUrl: './settings-repair-shop.component.html',
    styleUrls: ['./settings-repair-shop.component.scss'],
    providers: [FormatCurrencyPipe],
})
export class SettingsRepairShopComponent
    extends SettingsLocationBaseComponent
    implements OnInit
{
    public RepairShopModalStringEnum = RepairShopModalStringEnum;

    public repairShopData: any;
    public count: number = 0;
    public repairsActions: any;
    public repairShopDataId: any;
    public isServiceCardOpened: boolean[] = [];
    public isWorkingCardOpened: boolean[] = [];
    public isBankingInfoOpened: boolean[] = [];
    public isVisibleNoteCard: boolean[] = [];
    public repairShopForm: UntypedFormGroup;

    constructor(
        // Router
        protected activatedRoute: ActivatedRoute,
        public router: Router,

        // Services
        protected tableService: TruckassistTableService,
        protected confirmationService: ConfirmationService,
        protected cdRef: ChangeDetectorRef,
        private repairShopSrv: CompanyRepairShopService,
        private repairService: RepairService,
        protected settingsLocationService: SettingsLocationService,
        public dropDownService: DropDownService,
        private confirmationActivationService: ConfirmationActivationService,

        // Pipes
        public FormatCurrencyPipe: FormatCurrencyPipe,

        // Form builder
        private formBuilder: UntypedFormBuilder
    ) {
        super(
            tableService,
            confirmationService,
            cdRef,
            activatedRoute,
            settingsLocationService,
            dropDownService,
            FormatCurrencyPipe,
            router
        );
    }

    ngOnInit(): void {
        // Required for subscriptions to work
        super.ngOnInit();

        this.getInitalList();

        this.onShopClose();

        this.createForm();
    }

    private onShopClose() {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.repairService.updateRepairShopStatus(res.data.id);
                }
            });
    }

    private createForm() {
        this.repairShopForm = this.formBuilder.group({
            [RepairShopModalStringEnum.NOTE]: this.formBuilder.array([]),
        });
    }

    private addNote(value: string): void {
        const notesArray = this.repairShopForm.get(
            RepairShopModalStringEnum.NOTE
        ) as FormArray;
        notesArray.push(this.formBuilder.control(value));
    }

    public get notes(): FormArray {
        return this.repairShopForm.get(
            RepairShopModalStringEnum.NOTE
        ) as FormArray;
    }

    public getList(): void {
        this.repairShopSrv
            .getRepairShopList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.repairShopData = item.pagination;
                this.repairShopData.data = this.processOfficeData(
                    this.repairShopData.data
                );
                this.notes.clear();

                this.repairShopData.data.forEach((shop: RepairShopListDto) => {
                    this.addNote(shop.note);
                    this.isServiceCardOpened.push(true);
                    this.isWorkingCardOpened.push(true);
                    this.isBankingInfoOpened.push(true);
                    this.isVisibleNoteCard.push(!!shop.note);
                });
            });
    }

    public getInitalList(): void {
        this.getList();
    }

    private processOfficeData(data: RepairShopListDto[]): RepairShopListDto[] {
        return data.map((office) => {
            const groupedContacts = office.contacts.reduce(
                (acc, contact) => {
                    const departmentName = contact?.department?.name;

                    if (departmentName) {
                        if (!acc[departmentName]) {
                            acc[departmentName] = {
                                isCardOpen: true,
                                cardName: departmentName,
                                values: [],
                            };
                        }
                        acc[departmentName].values.push(contact);
                    }

                    return acc;
                },
                {} as Record<string, SettingsDepartmentCardModel>
            );

            return {
                ...office,
                groupedContacts,
            };
        });
    }

    public getActiveServices(data: RepairShopResponse) {
        return data.serviceTypes.filter((item) => item.active);
    }

    public handleConfirmation(res: Confirmation): void {
        if (
            res.type === DropActionsStringEnum.DELETE &&
            res.template === DropActionsStringEnum.COMPANY_REPAIR_SHOP
        ) {
            this.repairService
                .deleteRepairShop(res.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }

    public onCardToggle(i: number): void {
        const office = this.repairShopData.data[
            i
        ] as CompanyOfficeResponseWithGroupedContacts;

        if (office.groupedContacts) {
            Object.keys(office.groupedContacts).forEach((key) => {
                office.groupedContacts[key].isCardOpen = false;
            });
        }

        this.isServiceCardOpened[i] = false;
        this.isWorkingCardOpened[i] = false;
        this.isBankingInfoOpened[i] = false;
        this.isVisibleNoteCard[i] = false;
    }
}
