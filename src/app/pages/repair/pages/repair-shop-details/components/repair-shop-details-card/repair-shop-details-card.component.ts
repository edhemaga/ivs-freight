import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { map, Subject, takeUntil } from 'rxjs';

// store
import { RepairDetailsQuery } from '@pages/repair/state/repair-details-state/repair-details.query';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// components
import { RepairShopDetailsOpenHoursCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-open-hours-card/repair-shop-details-open-hours-card.component';
import { RepairShopDetailsServicesCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-services-card/repair-shop-details-services-card.component';
import { RepairShopDetailsBankCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-bank-card/repair-shop-details-bank-card.component';
import { RepairShopDetailsRepairExpenseCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-repair-expense-card/repair-shop-details-repair-expense-card.component';
import { RepairShopDetailsMapCoverCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-map-cover-card/repair-shop-details-map-cover-card.component';

import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';

// pipes
import { FormatCurrencyPipe, FormatDatePipe } from '@shared/pipes';

// models
import { RepairShopResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-repair-shop-details-card',
    templateUrl: './repair-shop-details-card.component.html',
    styleUrls: ['./repair-shop-details-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        RepairShopDetailsOpenHoursCardComponent,
        RepairShopDetailsServicesCardComponent,
        RepairShopDetailsBankCardComponent,
        RepairShopDetailsRepairExpenseCardComponent,
        RepairShopDetailsMapCoverCardComponent,

        ///// TODO
        TaDetailsHeaderCardComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaProfileImagesComponent,
        TaCopyComponent,
        TaUploadFilesComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCounterComponent,
        TaDetailsHeaderComponent,
        TaTabSwitchComponent,
        TaDetailsDropdownComponent,

        // Pipes
        FormatDatePipe,
        FormatCurrencyPipe,
    ],
})
export class RepairShopDetailsCard implements OnInit, OnChanges, OnDestroy {
    @Input() repairShop: RepairShopResponse;

    private destroy$ = new Subject<void>();

    public noteControl: UntypedFormControl = new UntypedFormControl();

    public shopsDropdowns: any[] = [];
    public shopIndex: any;

    // note card
    public noteForm: UntypedFormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // router
        private act_route: ActivatedRoute,
        private router: Router,

        // services
        private detailsPageDriverSer: DetailsPageService,
        private tableService: TruckassistTableService,

        // ref
        private cdRef: ChangeDetectorRef,

        // store
        private repairDetailsQuery: RepairDetailsQuery
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.repairShop?.currentValue !=
            changes.repairShop?.previousValue
        ) {
            this.noteControl.patchValue(changes.repairShop.currentValue.note);
            this.repairShop = changes.repairShop?.currentValue;
        }

        this.getShopsDropdown(changes.repairShop.currentValue);

        this.cdRef.detectChanges();
    }

    ngOnInit(): void {
        console.log('repairShop', this.repairShop);
        this.createForm();

        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res?.animation && res.tab === 'repair-shop') {
                    this.repairShop = res.data;
                    this.cdRef.detectChanges();
                }
            });

        // Only One Time Call From Store Data
        this.getShopsDropdown();

        // Call Change Dropdown When Router Change
        this.router.events
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: any) => {
                if (event instanceof NavigationEnd) {
                    this.getShopsDropdown();
                }
            });

        let currentIndex = this.shopsDropdowns.findIndex((item) => item.active);
        this.shopIndex = currentIndex;
    }

    private createForm(): void {
        this.noteForm = this.formBuilder.group({
            note: [this.repairShop?.note],
        });
    }

    public getShopsDropdown(newData?) {
        this.repairDetailsQuery.repairShopMinimal$
            .pipe(
                takeUntil(this.destroy$),
                map((data: any) => {
                    return data?.pagination?.data.map((item) => {
                        return {
                            id: item.id,
                            name: item.name,
                            status: item.status,
                            svg: item.pinned ? 'ic_star.svg' : '',
                            folder: 'common',
                            active:
                                item.id ===
                                +this.act_route.snapshot.params['id'],
                        };
                    });
                })
            )
            .subscribe((data) => {
                if (newData) {
                    data[0]['name'] = newData.name;
                }
                this.shopsDropdowns = data;
            });
    }

    public onSelectedShop(event: any) {
        if (event && event.id !== +this.act_route.snapshot.params['id']) {
            this.shopsDropdowns = this.shopsDropdowns.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    status: item.status,
                    svg: item.pinned ? 'ic_star.svg' : null,
                    folder: 'common',
                    active: item.id === event.id,
                };
            });

            this.detailsPageDriverSer.getDataDetailId(event.id);
        }
    }

    public onChangeShop(action: string) {
        let currentIndex = this.shopsDropdowns.findIndex((item) => item.active);

        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.onSelectedShop(this.shopsDropdowns[currentIndex]);
                    this.shopIndex = currentIndex;
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.shopsDropdowns.length > currentIndex
                ) {
                    this.onSelectedShop({
                        id: this.shopsDropdowns[currentIndex].id,
                    });
                    this.shopIndex = currentIndex;
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
    }
}
